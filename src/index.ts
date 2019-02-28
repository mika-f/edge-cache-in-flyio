import { responseCache } from "@fly/cache";

declare const fly: any;

fly.http.respondWith(async (req: RequestInfo) => {
  const url = new URL((req as any).url);

  let resp: Response = await responseCache.get(url.pathname);
  if (resp) {
    // hit
    resp.headers.set('Edge-Cache', 'Hit');
    return resp;
  }

  // no hit
  resp = await fetch(`https://blog.mochizuki.moe${url.pathname}`);

  const type = resp.headers.get('content-type');
  if (!type) {
    // what is this?
    resp.headers.set('Edge-Cache', 'Ignored');
    return resp;
  }

  if (!type.includes("text/html")) {
    // no cache in edge location (cached in Service Worker)
    resp.headers.set('Edge-Cache', 'Ignored');
    return resp;
  }

  await responseCache.set(url.pathname, resp, 3600);
  resp.headers.set('Edge-Cache', 'Origin');
  return resp;
});
