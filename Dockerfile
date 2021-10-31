FROM ubuntu:20.04
WORKDIR /app
COPY . .
RUN apt-get update && apt-get install -y \
    software-properties-common \
    npm
RUN npm install npm@latest -g && \
    npm install n -g && \
    n latest
RUN npm ci
RUN npm run build
CMD npm start
