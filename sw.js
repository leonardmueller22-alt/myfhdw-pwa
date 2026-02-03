const CACHE_NAME = 'myfhdw-pwa-v36'; // <--- Version auf 36 erhöht!

const urlsToCache = [
  // --- Deine lokalen Dateien ---
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
  './jscripts/getNotifications.js',

  // --- HIER SIND DIE NEUEN DATEIEN (bitte im Ordner 'files' umbenennen!) ---
  './files/handout.pdf',
  './files/praesentation.pptx',

  // --- WICHTIG: Externe Bibliotheken (CDN), damit es offline hübsch bleibt ---
  // jQuery & Bootstrap
  'https://d2q8mlawr49whx.cloudfront.net/V18.05.5/js/jquery/js/jquery-2.2.4.min.js',
  'https://d2q8mlawr49whx.cloudfront.net/V18.05.5/jscripts/bootstrap/js/bootstrap.min.js',
  'https://d2q8mlawr49whx.cloudfront.net/V18.05.5/jscripts/bootstrap/css/bootstrap.min.css',
  'https://d2q8mlawr49whx.cloudfront.net/V18.05.5/jscripts/bootstrap/css/bootstrap.custom.css',
  'https://d2q8mlawr49whx.cloudfront.net/V18.05.5/jscripts/fontawesome/css/all.min.css',
  
  // FHDW Styles (Auswahl der wichtigsten, damit die Seite Struktur hat)
  'https://d2q8mlawr49whx.cloudfront.net/V18.05.5/styles/style.css',
  'https://d2q8mlawr49whx.cloudfront.net/V18.05.5/styles/vorlage.css',
  'https://d2q8mlawr49whx.cloudfront.net/V18.05.5/styles/buttons.css',
  'https://d2q8mlawr49whx.cloudfront.net/V18.05.5/styles/content.css',
  'https://d2q8mlawr49whx.cloudfront.net/V18.05.5/styles/css.css',
  
  // --- KALENDER (TIMETABLE) ---
  // Ohne diese Dateien bleibt der Stundenplan offline leer!
  'https://d2q8mlawr49whx.cloudfront.net/V18.05.5/SharedResources/dhtmlxscheduler/codebase/dhtmlxscheduler_material.css',
  'https://d2q8mlawr49whx.cloudfront.net/V18.05.5/SharedResources/dhtmlxscheduler/codebase/dhtmlxscheduler.js',
  'https://d2q8mlawr49whx.cloudfront.net/V18.05.5/SharedResources/dhtmlxscheduler/codebase/locale/locale_de.js',
  'https://d2q8mlawr49whx.cloudfront.net/V18.05.5/SharedResources/dhtmlxscheduler/codebase/ext/dhtmlxscheduler_year_view.js'
];

// Installation: Dateien in den Cache laden
self.addEventListener('install', function(event) {
  // Das skipWaiting sorgt dafür, dass der neue Service Worker sofort aktiv wird
  self.skipWaiting(); 
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Cache geöffnet und alle Dateien (auch externe) geladen');
        return cache.addAll(urlsToCache);
      })
      .catch(function(err) {
          console.error('Fehler beim Caching:', err);
      })
  );
});

// Aktivierung: Alte Caches löschen
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Lösche alten Cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Clients sofort übernehmen, ohne Neuladen
  return self.clients.claim();
});

// Abruf: Cache First Strategie
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // 1. Ist es im Cache? Dann nimm es.
        if (response) {
          return response;
        }
        // 2. Nicht im Cache? Hol es aus dem Netz.
        return fetch(event.request);
      })
  );
});

// --- PUSH BENACHRICHTIGUNGEN HANDLING ---
self.addEventListener('notificationclick', function(event) {
  console.log('Benachrichtigung wurde angeklickt');
  event.notification.close();
});
