<!-- START: {Adding Service Worker} {3} out of {3} -->
importScripts('https://cdn.jsdelivr.net/npm/workbox-sw@2.1.2/build/importScripts/workbox-sw.prod.v2.1.2.min.js');
const workboxSW = new WorkboxSW();
workboxSW.precache([
  {
    "url": "bundle.js",
    "revision": "fdc504986b04ae5cfa5d5413bfa2f15e"
  },
  {
    "url": "index.html",
    "revision": "1fe4edc5de59d7591e77710caa1678ee"
  },
  {
    "url": "main.css",
    "revision": "02ae2deab00fde78ec4b9ba2285a54ab"
  }
]);
<!-- END: {Adding Service Worker} {3} out of {3} -->

<!-- START: {Adding Service Worker} {1} out of {3} -->
self.addEventListener('install', function (event) {
  console.log('%c ServiceWorker install method', 'color: #FF5722');
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
  console.log('%c ServiceWorker activate method', 'color: #CDDC39');
  event.waitUntil(self.clients.claim()); 
});

<!-- START: {Adding Sync} {1} out of {2} -->
self.addEventListener('message', function(event){
  console.log("SW Received Message: " + event.data);
  if(event.data[0].eventName === 'upvote') {
    self.upvoteUrl = event.data[0].url;
    self.upvoteRequestItem = event.data[0].requestItem;
  }
});

self.addEventListener('sync', event => {
  if (event.tag == 'upvoteSync') {
    event.waitUntil(
      fetch(self.upvoteUrl, self.upvoteRequestItem)
      .then(res => res.json())
      .then(res => console.log)
      .catch(e => console.log)
    );
  }
});
<!-- END: {Adding Sync} {1} out of {2} -->

<!-- END: {Adding Service Worker} {1} out of {3} -->

<!-- START: {Caching files} {1} out of {1} -->
workboxSW.router.registerRoute(/.*(?:googleapis|gstatic)\.com.*$/,
  workboxSW.strategies.cacheFirst({
    cacheName: 'googleapis',
    cacheExpiration: {
      maxEntries: 30
    },
    cacheableResponse: {statuses: [0, 200]}
  })
);
workboxSW.router.registerRoute(/.*(?:cdnjs)(?:\.cloudflare)\.com*/,
  workboxSW.strategies.cacheFirst({
    cacheName: 'cdnjs',
    cacheExpiration: {
      maxEntries: 30
    },
    cacheableResponse: {statuses: [0, 200]}
  })
);

workboxSW.router.registerRoute(/.*\/api\/search*/,
  workboxSW.strategies.cacheFirst({
    cacheName: 'user',
    cacheExpiration: {
      maxEntries: 30
    },
    cacheableResponse: {statuses: [0, 200]}
  })
);
<!-- END:  {Caching files} {1} out of {1} -->
