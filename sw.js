// ===== Service worker : garde l'app en mémoire pour l'utiliser sans internet =====
const NOM_CACHE = 'ipo-v24';                         // change ce nom (v2, v3...) à chaque mise à jour
const FICHIERS = [                                   // fichiers à garder hors connexion
  './', 'index.html', 'style.css', 'app.js', 'manifeste.json', 'chants.json', 'cours.json', 'ordre_serre.json', 'tior.json', 'galons.json', 'audio_mapping.json', 'manifest.webmanifest', // fichiers principaux
  'icones/cours.png', 'icones/chants.png', 'icones/tior.png', 'icones/ordre.png',       // icônes des tuiles
  'icones/avatar.png', 'icones/reglages.png', 'icones/silhouette.png', 'icones/galons.png', 'icones/manifeste.png', 'icones/apropos.png', 'icones/contribuer.png', 'assets/schema_galons.jpg', // suite des icônes
];

self.addEventListener('install', (e) => {            // à l'installation du service worker
  e.waitUntil(caches.open(NOM_CACHE).then(c => c.addAll(FICHIERS))); // télécharge et garde les fichiers
  self.skipWaiting();                                // active tout de suite la nouvelle version
});

self.addEventListener('activate', (e) => {           // à l'activation
  e.waitUntil(caches.keys().then(noms =>             // liste les anciens caches
    Promise.all(noms.filter(n => n !== NOM_CACHE).map(n => caches.delete(n))))); // supprime les anciens
  self.clients.claim();                              // prend le contrôle des pages ouvertes
});

// ----- Chants : mis en cache en entier dès la 1re écoute, pour rejouer hors connexion -----
// Le lecteur audio demande le fichier par morceaux ("Range", pour pouvoir avancer dans le son).
// Mettre directement ces morceaux en cache casserait la lecture (le cache ne garderait que le
// dernier morceau demandé). On télécharge donc toujours le fichier ENTIER une seule fois, on le
// garde tel quel, puis on découpe nous-mêmes la bonne tranche à chaque demande du lecteur.
async function servirAudio(requete) {
  const cache = await caches.open(NOM_CACHE);
  const cleComplete = new Request(new URL(requete.url).pathname, { headers: { Accept: '*/*' } }); // clé sans "Range" = toujours le fichier entier
  let reponseComplete = await cache.match(cleComplete);
  if (!reponseComplete) {                             // jamais écouté : télécharge tout, une seule fois
    const rep = await fetch(new URL(requete.url).pathname); // sans "Range" -> le serveur renvoie le fichier complet
    if (!rep.ok) return rep;
    await cache.put(cleComplete, rep.clone());
    reponseComplete = rep;
  }
  const plage = requete.headers.get('range');
  if (!plage) return reponseComplete;                 // le lecteur n'a pas demandé un morceau précis : tout renvoyer

  const blob = await reponseComplete.clone().blob();
  const taille = blob.size;
  const m = /bytes=(\d+)-(\d*)/.exec(plage);
  const debut = m ? parseInt(m[1], 10) : 0;
  const fin = (m && m[2]) ? Math.min(parseInt(m[2], 10), taille - 1) : taille - 1;
  const tranche = blob.slice(debut, fin + 1);
  return new Response(tranche, {
    status: 206, statusText: 'Partial Content',
    headers: {
      'Content-Type': blob.type || 'audio/mpeg',
      'Content-Range': `bytes ${debut}-${fin}/${taille}`,
      'Content-Length': String(tranche.size),
      'Accept-Ranges': 'bytes',
    },
  });
}

self.addEventListener('fetch', (e) => {              // à chaque demande de fichier
  if (/\.(mp3|ogg|wav)$/i.test(new URL(e.request.url).pathname)) {
    e.respondWith(servirAudio(e.request));            // traitement spécial pour l'audio (voir plus haut)
    return;
  }
  e.respondWith(                                     // on répond nous-mêmes
    caches.match(e.request).then(gardé =>            // cherche dans la mémoire
      gardé || fetch(e.request).then(rep => {        // sinon télécharge
        if (rep.ok && rep.status === 200) {          // ne garde que les réponses réussies (jamais un 404)
          const copie = rep.clone();                 // fait une copie de la réponse
          caches.open(NOM_CACHE).then(c => c.put(e.request, copie)); // la garde pour la prochaine fois
        }
        return rep;                                  // renvoie la réponse
      }).catch(() => gardé)                          // hors connexion et rien en mémoire : abandon
    )
  );
});
