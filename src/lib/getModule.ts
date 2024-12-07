export function getModule(x: string) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  let m = require(x);
  m = m.default || m;
  delete require.cache[x];
  return Object.assign(m, { path: x });
}
