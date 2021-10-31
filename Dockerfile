FROM ubuntu:20.04
WORKDIR /app
COPY . .
RUN sudo apt update
RUN sudo apt install nodejs
RUN sudo apt install npm
RUN npm ci
RUN npm run build
CMD npm start
