#! /usr/bin/env bash

LOG_PATH=./logs/build.txt

docker pull ubuntu

echo "$VERSION" >> "$LOG_PATH"

VERSION=$(git describe --abbrev=0 --tags)

docker build -t app:"$VERSION" .

echo "Docker образ собран" >> "$LOG_PATH"
docker images app:"$VERSION" >> "$LOG_PATH"
