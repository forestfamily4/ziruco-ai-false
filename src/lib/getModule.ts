export function getModule(x: string) {
  let m = require(x);
  m = m.default || m;
  delete require.cache[x];
  return Object.assign(m, { path: x });
}
