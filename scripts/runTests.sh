#! /usr/bin/env bash

LOG_FILE=runTestsLog.log

npm test -- --json --outputFile=testResults.json

if [ "$?" != 0 ]; then
  echo "Запуск тестов завершился с ошибкой" >> LOG_FILE
  exit 1
fi

TESTS_RESULT=$(node -e "const result = require('./testResults.json'); console.log(result.success ? 'Success' : 'Fail')")

TASK_KEY=$(node -e "const issue = require('./releaseIssue.json'); console.log(issue['key'])")

echo "Отпрака запроса на создание комментария в задаче $TASK_KEY" >> $LOG_FILE

RESPONSE=$(curl -H "Authorization: OAuth $OAUTH_TOKEN" -H "X-Org-ID: $X_ORG_ID" -H 'Content-Type: application/json' --data '{"text": "Результат запуска тестов: '"$TESTS_RESULT"', testResults.json"}' https://api.tracker.yandex.net/v2/issues/"$TASK_KEY"/comments)

HAS_ERRORS=$(echo "$RESPONSE" | python3 -c "import sys, json; print(hasattr(json.load(sys.stdin), 'errors'))");


if [ "$HAS_ERRORS" = "true" ]; then
  echo "Не удалось оставить комментарий в задаче" >> $LOG_FILE
  echo "$RESPONSE" >> $LOG_FILE
  exit 1
fi

echo "Создан комментарий в задаче $TASK_KEY" >> $LOG_FILE
