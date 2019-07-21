const filesToCache = [
  '.',
  'vendor/bootstrap/css/bootstrap.min.css',
  'images/ekskost_l.jpeg',
  'images/kost2a.jpg',
  'images/kost3c.jpeg',
  'images/kost4c.jpg',
  'images/kost5b.jpg',
  'images/kost6a.jpg',
  'index.html'
];

const staticCacheName = 'ayo_ngekos-v2';

self.addEventListener('install', event => {
  console.log('Attempting to install service worker and cache static assets');
  event.waitUntil(
    caches.open(staticCacheName)
    .then(cache => {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', event => {
  console.log('Activating new service worker...');

  const cacheWhitelist = [staticCacheName];

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  console.log('Fetch event for ', event.request.url);
  event.respondWith(
    caches.match(event.request)
    .then(response => {
      if (response) {
        console.log('Found ', event.request.url, ' in cache');
        return response;
      }
      console.log('Network request for ', event.request.url);
      return fetch(event.request)
      .then(response => {
        if (response.status === 404) {
          return caches.match('pages/404.html');
        }
        return caches.open(staticCacheName)
        .then(cache => {
          cache.put(event.request.url, response.clone());
          return response;
        });
      });
    }).catch(error => {
      console.log('Error, ', error);
      return caches.match('pages/offline.html');
    })
  );
});
//fetch data json


	let alamatJson=new Request('data_kos.json');
	fetch(alamatJson)
		.then( function(resp){
			return resp.json();
		})
		.then(function(data){
			let output='';
			 data.forEach(function(daftarKos){
			 	output +=`
			 <div class="col-md-4 mb-5">	
			 	<h4 class="card-title">${daftarKos.Judul}</h4>
        		<div class="card">
          			<img class="card-img-top" src="${daftarKos.Gambar}" alt="gambar belum di load">
          		<div class="card-body">
            		<p class="card-text">Deskripsi ${daftarKos.deskripsi}</p>
          		</div>
		        <div class="card-footer">
		            <a href="info kost/kost1.html" class="btn btn-primary">Find Out More!</a>
		        </div>
		        </div>
		    </div>    
			 	`;
			 });
		document.getElementById('listkos').innerHTML=output;	 
}).catch(function(error){
	console.log(error);
});






