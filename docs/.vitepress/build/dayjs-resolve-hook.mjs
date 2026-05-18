const DAYJS_SUBPATH_RE = /^dayjs\/(plugin|locale)\/([^./]+)$/;

/** @type {import('node:module').ResolveHook} */
export async function resolve(specifier, context, nextResolve) {
  const match = specifier.match(DAYJS_SUBPATH_RE);
  if (match) {
    return nextResolve(`${specifier}.js`, context);
  }
  return nextResolve(specifier, context);
}
