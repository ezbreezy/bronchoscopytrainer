// BronchoTrainer service worker. Template: vite.config.ts fills in 7d37b18f5ed8 and ["./","assets/index-CWWQYWvB.js","assets/index-DULgXZDo.css","icons/icon-192.png","icons/icon-512.png","icons/icon.svg","index.html","manifest.webmanifest"] at build time.
//  - app shell (html, js, css, icons): precached on install, cache-first (index.html is network-first)
//  - /cases/*: cached on first use. case.json and tree.json are network-first (cache fallback); big files are cache-first
//    and never precached. The cache name carries a hash of the published case files, so changed data starts a fresh cache.
const VERSION = "__VERSION__";
const PRECACHE = __PRECACHE__;
const SHELL = `bt-shell-${VERSION}`;
const CASES = `bt-cases-974d634e6356`;
const scope = self.registration.scope;
const abs = (p) => new URL(p, scope).href;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL)
      .then((c) => c.addAll(PRECACHE.map(abs)))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => ((k.startsWith("bt-shell-") && k !== SHELL) || (k.startsWith("bt-cases-") && k !== CASES))).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

async function cacheFirst(req, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  if (res.ok && res.status === 200) cache.put(req, res.clone()).catch(() => {});
  return res;
}

async function networkFirst(req, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const res = await fetch(req);
    if (res.ok && res.status === 200) cache.put(req, res.clone()).catch(() => {});
    return res;
  } catch (err) {
    const hit = await cache.match(req);
    if (hit) return hit;
    throw err;
  }
}

async function networkFirstPage(req) {
  const cache = await caches.open(SHELL);
  try {
    const res = await fetch(req);
    if (res.ok) cache.put(abs("index.html"), res.clone()).catch(() => {});
    return res;
  } catch (err) {
    const hit = (await cache.match(abs("index.html"))) || (await cache.match(abs("./")));
    if (hit) return hit;
    throw err;
  }
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin || !url.href.startsWith(scope)) return;
  if (req.headers.has("range")) return; // let the network handle partial requests
  if (req.mode === "navigate") {
    event.respondWith(networkFirstPage(req));
  } else if (url.pathname.includes("/cases/")) {
    const small = /\/(case|tree)\.json$/.test(url.pathname);
    event.respondWith(small ? networkFirst(req, CASES) : cacheFirst(req, CASES));
  } else {
    event.respondWith(cacheFirst(req, SHELL));
  }
});
