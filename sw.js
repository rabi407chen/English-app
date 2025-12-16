const CACHE_NAME = 'ai-english-v3'; // 版本號改為 v3
// ...其餘程式碼保持不變 (請使用 V6.1 修復版那一版)
// 為了保險，下方會提供完整的 sw.js 讓你複製
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
    if (url.hostname.includes('ocr.space') || url.hostname.includes('dictionaryapi.dev') || url.hostname.includes('mymemory.translated.net')) return;
    if (e.request.method === 'POST') return;
    e.respondWith(caches.match(e.request).then((response) => response || fetch(e.request)));
});
