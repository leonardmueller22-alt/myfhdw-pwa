const CACHE_NAME = 'myfhdw-pwa-v85'; // Version auf v85 erhöht für das Handy-Update

const urlsToCache = [
  './',
  './index.html',
  './dashboard.html',
  './profile.html',
  './notenuebersicht.html',
  './pruefungstermine.html',
  './timetable.html',
  './dokumente.html',
  './abgaben.html',
  './kurzbewerbung.html',
  './manifest.json',
  './styles/custom.css',
  './img/homescreen192.png',
  './img/Community_Banner.jpg',
  './img/team.png',
  './img/gorilla.jpg',
  './favicon.ico',
  './files/handout.pdf',
  './files/praesentation.pptx',
  'https://d2q8mlawr49whx.cloudfront.net/V18.05.5/js/jquery/js/jquery-2.2.4.min.js',
  'https://d2q8mlawr49whx.cloudfront.net/V18.05.5/jscripts/bootstrap/js/bootstrap.min.js',
  'https://d2q8mlawr49whx.cloudfront.net/V18.05.5/jscripts/bootstrap/css/bootstrap.min.css',
  'https://d2q8mlawr49whx.cloudfront.net/V18.05.5/jscripts/bootstrap/css/bootstrap.custom.css',
  'https://d2q8mlawr49whx.cloudfront.net/V18.05.5/jscripts/fontawesome/css/all.min.css',
  'https://d2q8mlawr49whx.cloudfront.net/V18.05.5/styles/style.css',
  'https://d2q8mlawr49whx.cloudfront.net/V18.05.5/styles/vorlage.css',
  'https://d2q8mlawr49whx.cloudfront.net/V18.05.5/styles/buttons.css',
  'https://d2q8mlawr49whx.cloudfront.net/V18.05.5/styles/content.css',
  'https://d2q8mlawr49whx.cloudfront.net/V18.05.5/styles/css.css',
  'https://d2q8mlawr49whx.cloudfront.net/V18.05.5/SharedResources/dhtmlxscheduler/codebase/dhtmlxscheduler_material.css',
  'https://d2q8mlawr49whx.cloudfront.net/V18.05.5/SharedResources/dhtmlxscheduler/codebase/dhtmlxscheduler.js',
  'https://d2q8mlawr49whx.cloudfront.net/V18.05.5/SharedResources/dhtmlxscheduler/codebase/locale/locale_de.js',
  'https://d2q8mlawr49whx.cloudfront.net/V18.05.5/SharedResources/dhtmlxscheduler/codebase/ext/dhtmlxscheduler_year_view.js'
];

self.addEventListener('install', function(event) {
  self.skipWaiting(); 
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});

// WICHTIG: Dieser Teil verarbeitet die Benachrichtigungsanfragen auf dem Handy
self.addEventListener('push', function(event) {
  let data = { title: 'MyFHDW', body: 'Neue Nachricht!' };
  
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'MyFHDW', body: event.data.text() };
    }
  }

  const options = {
    body: data.body,
    icon: 'img/homescreen192.png',
    badge: 'img/homescreen192.png',
    vibrate: [100, 50, 100]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
});
