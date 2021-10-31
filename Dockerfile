FROM ubuntu:20.04
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build
CMD npm start
