#! /usr/bin/env bash

CURRENT_VERSION=$(git describe --abbrev=0 --tags)

if [ "$?" != "0" ]; then
  echo "Не удалось найти последний тег в репозитории"
  exit 1
fi

echo "Найден последний тег $CURRENT_VERSION"

PREV_VERSION=$(git describe --abbrev=0 --tags "$CURRENT_VERSION"^)

if [ "$?" != "0" ]; then
  echo "Не удалось найти предпоследний тег в репозитории"
  exit 1
fi

# find commits for changelog
COMMITS_DIFF=$(git log --pretty=format:"%h %s" "$PREV_VERSION".."$CURRENT_VERSION")

if [ "$?" != "0" ]; then
  echo "Не удалось сформировать changelog"
  exit 1
fi

RELEASE_INFO=$(git for-each-ref --format 'Версия: %(refname:strip=2)%0aАвтор релиза: %(taggername)%0aВремя релиза: %(taggerdate)' refs/tags/"$CURRENT_VERSION")

DESCRIPTION=$(echo -e "$RELEASE_INFO\n\nCHANGELOG:\n$COMMITS_DIFF" | sed -z 's/\n/\\n/g')

# seach an existing task for current version
FOUND_TASKS=$(curl  -H "Authorization: OAuth $OAUTH_TOKEN" -H "X-Org-ID: $X_ORG_ID" -H 'Content-Type: application/json' --data '{"filter":{"queue": "TMP", "unique": "'"$REPO"':'"$CURRENT_VERSION"'"}}' https://api.tracker.yandex.net/v2/issues/_search)

if [ "$FOUND_TASKS" != "[]" ]; then
  echo "Найдена задача для версии $VERSION. Задача будет обновлена, учитывая изменения."

  # edit found task

  TASK_ID=$(echo "$FOUND_TASKS" | python3 -c "import sys, json; print(json.load(sys.stdin)[0]['id'])");

  UPDATED_TASK=$(curl --request PATCH -H "Authorization: OAuth $OAUTH_TOKEN" -H "X-Org-ID: $X_ORG_ID" -H 'Content-Type: application/json' --data '{"description": "'"$DESCRIPTION"'"}' https://api.tracker.yandex.net/v2/issues/"$TASK_ID")

  echo "Задача $TASK_ID была обновлена"
  exit 0
fi

# create new task

echo "creating a new task"

RESPONSE=$(curl  -H "Authorization: OAuth $OAUTH_TOKEN" -H "X-Org-ID: $X_ORG_ID" -H 'Content-Type: application/json' --data '{"queue": "TMP", "summary": "Release '"$CURRENT_VERSION"'", "unique": "'"$REPO"':'"$CURRENT_VERSION"'", "description": "'"$DESCRIPTION"'"}' https://api.tracker.yandex.net/v2/issues/)

echo "Создана новая задача в очереди TMP"
