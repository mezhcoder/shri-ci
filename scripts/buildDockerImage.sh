#! /usr/bin/env bash

LOG_PATH=./logs/build.txt

docker pull ubuntu

VERSION=$(git describe --abbrev=0 --tags)
BUILD_NAME="app:$VERSION"

docker build -t "$BUILD_NAME" .

if [ "$?" != 0 ]; then
  echo "Во время сборки произошла ошибка" >> "$LOG_PATH"
  exit 1
fi

echo "Docker образ собран" >> "$LOG_PATH"
docker images app:"$VERSION" >> "$LOG_PATH"

# seach an existing task for current version
FOUND_TASKS=$(curl  -H "Authorization: OAuth $OAUTH_TOKEN" -H "X-Org-ID: $X_ORG_ID" -H 'Content-Type: application/json' --data '{"filter":{"queue": "TMP", "unique": "'"$REPO"':'"$VERSION"'"}}' https://api.tracker.yandex.net/v2/issues/_search)

if [ "$FOUND_TASKS" = "[]" ]; then
  echo "Задача для версии $VERSION не была найдена" >> $LOG_PATH
  exit 1
fi

TASK_ID=$(echo "$FOUND_TASKS" | python3 -c "import sys, json; print(json.load(sys.stdin)[0]['id'])");
echo "Найдена задача $TASK_ID для версии $VERSION" >> $LOG_PATH

curl -H "Authorization: OAuth $OAUTH_TOKEN" -H "X-Org-ID: $X_ORG_ID" -H 'Content-Type: application/json' --data '{"text": "Собран контейнер '"$BUILD_NAME"'"}' https://api.tracker.yandex.net/v2/issues/"$TASK_ID"/comments

if [ "$?" != 0 ]; then
  echo "Не удалось оставить комментарий в задаче" >> $LOG_PATH
  exit 1
fi
