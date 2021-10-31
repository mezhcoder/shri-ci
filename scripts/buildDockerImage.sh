#! /usr/bin/env bash

LOG_PATH=buildLog.log

docker pull ubuntu

VERSION=$(git describe --abbrev=0 --tags)
BUILD_NAME="app:$VERSION"

docker build -t "$BUILD_NAME" .

if [ "$?" != 0 ]; then
  echo "Во время сборки произошла ошибка" >> "$LOG_PATH"
  exit 1
fi

echo "Docker образ $BUILD_NAME собран" >> "$LOG_PATH"
docker images app:"$VERSION" >> "$LOG_PATH"

# seach an existing task for current version
echo "Запрос на поиск задач в трекере по полю unique=$REPO:$VERSION" >> $LOG_PATH

FOUND_TASKS=$(curl  -H "Authorization: OAuth $OAUTH_TOKEN" -H "X-Org-ID: $X_ORG_ID" -H 'Content-Type: application/json' --data '{"filter":{"queue": "TMP", "unique": "'"$REPO"':'"$VERSION"'"}}' https://api.tracker.yandex.net/v2/issues/_search)

if [ "$FOUND_TASKS" = "[]" ]; then
  echo "Задача для версии $VERSION не была найдена" >> $LOG_PATH
  exit 1
fi

echo "Найдена задача $FOUND_TASKS" >> $LOG_PATH

# TASK_KEY=$(echo "$FOUND_TASKS" | python3 -c "import sys, json; print(json.load(sys.stdin)[0]['key'])");
TASK_KEY=$(node -e "const issue = require('releaseIssue.json'); console.log(issue['key'])");

echo "Найдена задача $TASK_KEY" >> $LOG_PATH

RESPONSE=$(curl -H "Authorization: OAuth $OAUTH_TOKEN" -H "X-Org-ID: $X_ORG_ID" -H 'Content-Type: application/json' --data '{"text": "Собран контейнер '"$BUILD_NAME"'"}' https://api.tracker.yandex.net/v2/issues/"$TASK_KEY"/comments)

HAS_ERRORS=$(echo "$RESPONSE" | python3 -c "import sys, json; print(hasattr(json.load(sys.stdin), 'errors'))");


if [ "$HAS_ERRORS" = "true" ]; then
  echo "Не удалось оставить комментарий в задаче" >> $LOG_PATH
  echo "$RESPONSE" >> $LOG_PATH
  exit 1
fi

echo "Создан комментарий в задаче $TASK_ID" >> $LOG_PATH
