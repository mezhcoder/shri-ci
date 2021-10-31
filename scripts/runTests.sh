#! /usr/bin/env bash

LOG_FILE=runTestsLog.log

npm test -- --json --outputFile=testResults.json

if [ "$?" != 0 ]; then
  echo "Запуск тестов завершился с ошибкой" >> LOG_FILE
  exit 1
fi

TESTS_RESULT=$(node -e "const result = require('testResults.json'); console.log(result.success ? 'Success' : 'Fail')")

# seach an existing task for current version
echo "Запрос на поиск задач в трекере по полю unique=$REPO:$VERSION" >> $LOG_FILE

FOUND_TASKS=$(curl  -H "Authorization: OAuth $OAUTH_TOKEN" -H "X-Org-ID: $X_ORG_ID" -H 'Content-Type: application/json' --data '{"filter":{"queue": "TMP", "unique": "'"$REPO"':'"$VERSION"'"}}' https://api.tracker.yandex.net/v2/issues/_search)

if [ "$FOUND_TASKS" = "[]" ]; then
  echo "Задача для версии $VERSION не была найдена" >> $LOG_FILE
  exit 1
fi

# TASK_KEY=$(echo "$FOUND_TASKS" | python3 -c "import sys, json; print(json.load(sys.stdin)[0]['key'])")
TASK_KEY=$(node -e "const issue = require('./releaseIssue.json'); console.log(issue['key'])")

echo "Найдена задача $TASK_KEY" >> $LOG_FILE

RESPONSE=$(curl -H "Authorization: OAuth $OAUTH_TOKEN" -H "X-Org-ID: $X_ORG_ID" -H 'Content-Type: application/json' --data '{"text": "Результат запуска тестов: '"$TESTS_RESULT"'"}' https://api.tracker.yandex.net/v2/issues/"$TASK_KEY"/comments)

HAS_ERRORS=$(echo "$RESPONSE" | python3 -c "import sys, json; print(hasattr(json.load(sys.stdin), 'errors'))");


if [ "$HAS_ERRORS" = "true" ]; then
  echo "Не удалось оставить комментарий в задаче" >> $LOG_FILE
  echo "$RESPONSE" >> $LOG_FILE
  exit 1
fi

echo "Создан комментарий в задаче $TASK_KEY" >> $LOG_FILE
