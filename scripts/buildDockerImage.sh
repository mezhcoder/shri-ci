#! /usr/bin/env bash

docker pull ubuntu

echo "$VERSION"

docker build -t app:"$VERSION" .

echo "Docker образ собран" >> "$LOG_PATH"
docker images app:"$VERSION" >> "$LOG_PATH"
