const CACHE_NAME = 'ai-english-v4'; // 升級為 v4
const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './icon.png'
];

self.addEventListener('install', (e) => {
    self.skipWaiting();
    e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener('activate', (e) => {
    e.waitUntil(caches.keys().then((keys) => Promise.all(keys.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
    }))));
    return self.clients.claim();
});

self.addEventListener('fetch', (e) => {
    const url = new URL(e.request.url);
    // 排除 API 和 CDN (OpenCC)
    if (url.hostname.includes('ocr.space') || 
        url.hostname.includes('dictionaryapi.dev') || 
        url.hostname.includes('mymemory.translated.net') ||
        url.hostname.includes('jsdelivr.net')) return; // 新增 jsdelivr 排除
    
    if (e.request.method === 'POST') return;
    
    e.respondWith(caches.match(e.request).then((response) => response || fetch(e.request)));
});
