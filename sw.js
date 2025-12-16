const CACHE_NAME = 'ai-english-v2'; // 升級版本號
const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './icon.png'
];

// 安裝：快取靜態檔案
self.addEventListener('install', (e) => {
    self.skipWaiting(); // 強制更新 SW
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

// 啟動：刪除舊快取
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(keys.map((key) => {
                if (key !== CACHE_NAME) return caches.delete(key);
            }));
        })
    );
    return self.clients.claim();
});

// 攔截請求：關鍵修正！
self.addEventListener('fetch', (e) => {
    const url = new URL(e.request.url);

    // 🚨 規則 1：如果是 API 請求 (OCR, Dictionary, Translation)，直接走網路，不快取！
    if (url.hostname.includes('ocr.space') || 
        url.hostname.includes('dictionaryapi.dev') || 
        url.hostname.includes('mymemory.translated.net')) {
        return; // 直接 return 代表不經過 Service Worker，直接連網
    }

    // 🚨 規則 2：如果是 POST 請求 (上傳圖片)，絕對不要快取！
    if (e.request.method === 'POST') {
        return;
    }

    // 其他靜態檔案 (HTML, CSS, JS) 才走快取
    e.respondWith(
        caches.match(e.request).then((response) => {
            return response || fetch(e.request);
        })
    );
});