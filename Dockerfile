FROM oven/bun:latest

COPY . .
RUN bun install

CMD [ "bun", "--env-file=.env", "start" ]