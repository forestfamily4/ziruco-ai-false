FROM oven/bun:latest

COPY . .
RUN bun install

CMD [ "bun", "start" ]