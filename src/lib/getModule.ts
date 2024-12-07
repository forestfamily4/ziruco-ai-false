export async function getModule(x: string) {
  let m = await import(x);
  m = m.default || m;
  delete require.cache[x];
  return Object.assign(m, { path: x });
}
