self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.mode !== 'navigate' || request.method !== 'GET') return

  const { origin, pathname } = new URL(request.url)
  if (origin !== self.location.origin || /^\/(?:admin|api|signin-with-chatgpt)(?:\/|$)/i.test(pathname)) return

  // Activity and publication pages always use the current network response.
  event.respondWith(fetch(request).catch(() => new Response(`<!doctype html>
<html lang="zh-Hant-TW">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#173f3b">
<title>無法連線｜小會</title>
<style>
  body { margin: 0; padding: 12vh 1.5rem; background: #fbf8f1; color: #173f3b; font: 1rem/1.7 system-ui, sans-serif; }
  main { max-width: 30rem; margin: auto; }
  a { color: inherit; text-underline-offset: .2em; }
</style>
<main>
  <h1>目前無法連線</h1>
  <p>請確認網路連線，再重新載入小會網站。</p>
  <a href="">重新載入</a>
</main>
</html>`, { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } })))
})
