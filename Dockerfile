FROM node:22-slim

RUN apt update
COPY . .
RUN npm install && npm run build

CMD [ "npm", "start" ]