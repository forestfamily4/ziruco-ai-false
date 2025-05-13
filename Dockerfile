FROM node:22-slim

RUN apt update
COPY . .
RUN bun install

CMD [ "npm", "start" ]