FROM node:slim-22

RUN apt update
COPY . .
RUN npm install && npm run build

CMD [ "npm", "start" ]