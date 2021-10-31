#! /usr/bin/env bash

LOG_PATH=./logs/build.txt

docker pull ubuntu

VERSION=$(git describe --abbrev=0 --tags)

docker build -t app:"$VERSION" .

if [ "$?" != 0 ]; then
  echo "Во время сборки произошла ошибка" >> "$LOG_PATH"
  exit 1
fi

echo "Docker образ собран" >> "$LOG_PATH"
docker images app:"$VERSION" >> "$LOG_PATH"
