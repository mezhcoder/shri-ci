#! /usr/bin/env bash

LOG_FILE=createIssue.log

CURRENT_VERSION=$(git describe --abbrev=0 --tags)

if [ "$?" != "0" ]; then
  echo "Не удалось найти последний тег в репозитории" >> $LOG_FILE
  exit 1
fi

echo "Найден последний тег $CURRENT_VERSION" >> $LOG_FILE

PREV_VERSION=$(git describe --abbrev=0 --tags "$CURRENT_VERSION"^)

if [ "$?" != "0" ]; then
  echo "Не удалось найти предпоследний тег в репозитории" >> $LOG_FILE
  exit 1
fi

# find commits for changelog
COMMITS_DIFF=$(git log --pretty=format:"%h %s" "$PREV_VERSION".."$CURRENT_VERSION")

if [ "$?" != "0" ]; then
  echo "Не удалось сформировать changelog" >> $LOG_FILE
  exit 1
fi

RELEASE_INFO=$(git for-each-ref --format 'Версия: %(refname:strip=2)%0aАвтор релиза: %(taggername)%0aВремя релиза: %(taggerdate)' refs/tags/"$CURRENT_VERSION")

DESCRIPTION=$(echo -e "$RELEASE_INFO\n\nCHANGELOG:\n$COMMITS_DIFF" | sed -z 's/\n/\\n/g')

# seach an existing task for current version
FOUND_TASKS=$(curl  -H "Authorization: OAuth $OAUTH_TOKEN" -H "X-Org-ID: $X_ORG_ID" -H 'Content-Type: application/json' --data '{"filter":{"queue": "TMP", "unique": "'"$REPO"':'"$CURRENT_VERSION"'"}}' https://api.tracker.yandex.net/v2/issues/_search)

if [ "$FOUND_TASKS" != "[]" ]; then
  echo "$FOUND_TASKS" | python3 -c "import sys, json; print(json.dumps(json.load(sys.stdin, strict=False)[0]))" >> releaseIssue.json

  TASK_KEY=$(node -e "const issue = require('./releaseIssue.json'); console.log(issue['key'])")

  # TASK_ID=$(node -e "const issues = require('releaseIssue.json'); console.log(issues[0]['id'])");

  echo "Найдена задача $TASK_KEY для версии $VERSION. Информация о задаче записана в releaseIssue.json" >> $LOG_FILE

  # edit found task

  UPDATE_RESPONSE=$(curl --request PATCH -H "Authorization: OAuth $OAUTH_TOKEN" -H "X-Org-ID: $X_ORG_ID" -H 'Content-Type: application/json' --data '{"description": "'"$DESCRIPTION"'"}' https://api.tracker.yandex.net/v2/issues/"$TASK_KEY")

  UPDATE_ERRORS=$(node -e "const issues = require('./releaseIssue.json'); console.log(issues[0]['id'])");

  if [ "$?" != "0" ]; then
    echo "Не удалось обновить задачу" >> $LOG_FILE
    exit 1
  fi

  echo "Задача $TASK_KEY была обновлена с описанием $DESCRIPTION" >> $LOG_FILE
  exit 0
fi

# create new task

echo "creating a new task"

curl  -H "Authorization: OAuth $OAUTH_TOKEN" -H "X-Org-ID: $X_ORG_ID" -H 'Content-Type: application/json' --data '{"queue": "TMP", "summary": "Release '"$CURRENT_VERSION"'", "unique": "'"$REPO"':'"$CURRENT_VERSION"'", "description": "'"$DESCRIPTION"'"}' https://api.tracker.yandex.net/v2/issues/ >> releaseIssue.json

TASK_KEY=$(node -e "const issue = require('./releaseIssue.json'); console.log(issue['key'])")

echo "Создана задача $TASK_KEY в очереди TMP" >> $LOG_FILE
echo "Информация о задаче записана в releaseIssue.json" >> $LOG_FILE
