FROM oven/bun:debian

COPY . .
RUN bun install

CMD [ "bun", "start" ]