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

TASK_KEY=$(node -e "const issue = require('./releaseIssue.json'); console.log(issue['key'])");

echo "Отправка запроса на создание комментария в задаче $TASK_KEY" >> $LOG_PATH

RESPONSE=$(curl -H "Authorization: OAuth $OAUTH_TOKEN" -H "X-Org-ID: $X_ORG_ID" -H 'Content-Type: application/json' --data '{"text": "Собран контейнер '"$BUILD_NAME"'"}' https://api.tracker.yandex.net/v2/issues/"$TASK_KEY"/comments)

HAS_ERRORS=$(echo "$RESPONSE" | python3 -c "import sys, json; print(hasattr(json.load(sys.stdin), 'errors'))");

if [ "$HAS_ERRORS" = "true" ]; then
  echo "Не удалось оставить комментарий в задаче" >> $LOG_PATH
  echo "$RESPONSE" >> $LOG_PATH
  exit 1
fi

echo "Создан комментарий в задаче $TASK_ID" >> $LOG_PATH
