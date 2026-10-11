// ===== Liste des sections de l'accueil (même ordre que dans ton main.py) =====
const SECTIONS = [                                   // tableau = liste d'éléments
  { id: 'cours',     nom: 'COURS',        icone: 'cours.png' },      // section Cours
  { id: 'chants',    nom: 'CHANTS',       icone: 'chants.png' },     // section Chants
  { id: 'tior',      nom: 'TIOR',         icone: 'tior.png' },       // tour de garde
  { id: 'ordre',     nom: 'ORDRE SERRÉ',  icone: 'ordre.png' },      // ordre serré
  { id: 'galons',    nom: 'GALONS',       icone: 'galons.png' },     // arbre de galons
  { id: 'manifeste', nom: 'MANIFESTE',    reste: 'de la révolution progressiste populaire', icone: 'manifeste.png' }, // manifeste (2 lignes)
  { id: 'apropos',   nom: 'À PROPOS',     icone: 'apropos.png' },    // à propos
  { id: 'contribuer',nom: 'CONTRIBUER',   icone: 'contribuer.png' }, // contribuer
];

// ===== Raccourcis pour trouver des éléments de la page =====
const $ = (sel) => document.querySelector(sel);      // $('#x') = trouve l'élément d'id x

// ===== Affiche un petit message temporaire =====
function toast(message) {                            // message = texte à montrer
  const el = $('#toast');                            // récupère la bulle
  el.textContent = message;                          // met le texte dedans
  el.classList.add('visible');                       // la rend visible
  clearTimeout(toast.minuteur);                      // annule l'ancien minuteur éventuel
  toast.minuteur = setTimeout(() => el.classList.remove('visible'), 1800); // la cache après 1,8 s
}

// ===== Change d'écran (accueil <-> manifeste) =====
function afficherEcran(id) {                         // id = 'accueil' ou 'manifeste'
  document.querySelectorAll('.ecran').forEach(e => e.classList.remove('actif')); // cache tous les écrans
  $('#' + id).classList.add('actif');                // affiche celui demandé
}

// ===== Construction de la grille d'accueil =====
function construireAccueil() {                       // appelée une fois au démarrage
  const grille = $('#grille');                       // conteneur des tuiles
  SECTIONS.forEach((s, i) => {                       // pour chaque section (s) et son numéro (i)
    const t = document.createElement('div');         // crée une case
    t.className = 'tuile verre';                     // lui donne le style tuile + verre
    t.style.animationDelay = (i * 0.055) + 's';      // apparition en cascade
    t.innerHTML =                                    // contenu HTML de la tuile
      `<img src="icones/${s.icone}" alt="">` +       // icône de la section
      `<div class="nom">${s.nom}` +                  // nom en majuscules
      (s.reste ? `<small>${s.reste}</small>` : '') + // 2e ligne si elle existe (Manifeste)
      `</div>`;                                      // fin du nom
    t.addEventListener('click', () => ouvrirSection(s.id)); // au clic : ouvre la section
    grille.appendChild(t);                           // ajoute la tuile à la grille
  });
}

// ===== Que faire quand on touche une tuile =====
function ouvrirSection(id) {                         // id de la section touchée
  if (id === 'manifeste') {                          // si c'est le Manifeste
    setTimeout(ouvrirManifeste, 150);                // ouvre après la petite animation d'appui
  } else if (id === 'chants') {                      // si c'est Chants
    setTimeout(ouvrirChants, 150);                   // ouvre après la petite animation d'appui
  } else if (id === 'apropos') {                     // si c'est À propos
    setTimeout(ouvrirApropos, 150);
  } else if (id === 'contribuer') {                  // si c'est Contribuer
    setTimeout(ouvrirContribuer, 150);
  } else if (id === 'cours') {                       // si c'est Cours
    setTimeout(ouvrirCours, 150);                    // ouvre la liste des modules
  } else if (id === 'tior') {                        // si c'est Tour de garde
    setTimeout(ouvrirTior, 150);
  } else if (id === 'ordre') {                       // si c'est Ordre serré
    setTimeout(ouvrirOrdre, 150);
  } else if (id === 'galons') {                      // si c'est Arbre de galons
    setTimeout(ouvrirGalons, 150);
  } else {                                           // sinon
    toast('Bientôt disponible');                     // pas encore construit
  }
}

// ===== COURS, ORDRE SERRÉ, TOUR DE GARDE : modules et chapitres =====
// Les trois rubriques partagent la même présentation (module dépliable -> chapitres
// sur un fil doré), donc une seule fonction générique construit les trois écrans ;
// seules les données (fichier JSON, étiquette « MODULE »/« MOUVEMENT ») changent.
const donneesRubriques = {};                          // cache : { cours: [...], ordre: [...], tior: [...] }

function construireRubrique(idConteneur, modules, etiquette) {
  const conteneur = $('#' + idConteneur);
  modules.forEach((mod, i) => {                      // pour chaque module (mod) et son numéro (i)
    const num = String(i + 1).padStart(2, '0');      // 1 -> "01"
    const bloc = document.createElement('div');      // tuile du module
    bloc.className = 'module verre';
    bloc.style.animationDelay = (i * 0.04) + 's';    // apparition en cascade
    const entete = document.createElement('div');    // partie toujours visible
    entete.className = 'module-entete';
    entete.innerHTML = `<span class="mod-num">${etiquette} ${num}</span><span>${echapper(mod.titre)}</span><span class="mod-fleche">▼</span>`;
    entete.addEventListener('click', () => {         // au clic : ouvre/ferme les chapitres
      vibrer(10);
      bloc.classList.toggle('ouvert');
    });
    const zone = document.createElement('div');      // partie dépliable
    zone.className = 'module-chapitres';
    const fil = document.createElement('div');       // colonne avec le fil doré
    fil.className = 'chapitres-fil';
    mod.chapitres.forEach((chap, k) => {             // un bouton par chapitre/mouvement
      const b = document.createElement('div');
      b.className = 'chapitre';
      const solo = mod.chapitres.length === 1 && chap.titre === mod.titre; // pas de variante : rien à numéroter
      b.innerHTML = solo ? `<span>${echapper(chap.titre)}</span>`
        : `<b>${String(k + 1).padStart(2, '0')}</b><span>${echapper(chap.titre)}</span>`;
      b.addEventListener('click', () => { vibrer(10); setTimeout(() => ouvrirChapitre(mod.titre, chap.titre, chap.contenu), 120); });
      fil.appendChild(b);
    });
    zone.appendChild(fil);
    bloc.appendChild(entete);
    bloc.appendChild(zone);
    conteneur.appendChild(bloc);
  });
}

async function ouvrirRubrique(cle, fichier, idConteneur, idEcran, etiquette) {
  if (!donneesRubriques[cle]) {                       // si pas encore chargé
    try {
      const rep = await fetch(fichier);
      donneesRubriques[cle] = await rep.json();
      construireRubrique(idConteneur, donneesRubriques[cle], etiquette);
    } catch (e) { toast('Chargement impossible'); return; } // hors connexion sans cache : message
  }
  afficherEcran(idEcran);
}
const ouvrirCours = () => ouvrirRubrique('cours', 'cours.json', 'liste-modules', 'cours', 'MODULE');
const ouvrirOrdre = () => ouvrirRubrique('ordre', 'ordre_serre.json', 'liste-ordre', 'ordre', 'MOUVEMENT');
const ouvrirTior = () => ouvrirRubrique('tior', 'tior.json', 'liste-tior', 'tior', 'TECHNIQUE');

$('#btn-retour-cours').addEventListener('click', () => afficherEcran('accueil'));
$('#btn-retour-ordre').addEventListener('click', () => afficherEcran('accueil'));
$('#btn-retour-tior').addEventListener('click', () => afficherEcran('accueil'));

// Ouvre un chapitre dans la fenêtre qui glisse depuis le bas
function ouvrirChapitre(titreModule, titreChapitre, contenu) {
  const texte = (contenu || '').trim();
  $('#feuille-module').textContent = titreModule.toUpperCase();
  $('#feuille-titre').textContent = titreChapitre;
  const zone = $('#feuille-texte');
  zone.classList.toggle('vide', !texte);             // style discret si vide
  zone.textContent = texte || "Le contenu de ce chapitre n'a pas encore été rédigé.\n\nReviens plus tard.";
  zone.scrollTop = 0;
  $('#feuille-chapitre').classList.add('ouverte');   // fait glisser la fenêtre
}
function fermerChapitre() { $('#feuille-chapitre').classList.remove('ouverte'); }
$('#feuille-fermer').addEventListener('click', fermerChapitre);
$('#feuille-chapitre').addEventListener('click', (e) => { if (e.target.id === 'feuille-chapitre') fermerChapitre(); });

// ===== ARBRE DE GALONS : organigramme zoomable (comme l'application), avec bascule INTERACTIF / IMAGE =====
let galonsCategories = [];                            // catégories chargées depuis galons.json
const GAL_L = 1800, GAL_H = 1180;                     // taille du plan (indépendante de l'écran)
const gal = { sc: 1, tx: 0, ty: 0, scMin: 0.05, scMax: 3, modeImage: false, construit: false }; // état du zoom / déplacement
const galPointeurs = new Map();                       // doigts posés (pour pincer / glisser)
let galGeste = null;                                  // infos du geste en cours (tap ou déplacement)

function galTrait(x1, y1, x2, y2) { return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`; } // un trait du schéma
function galConnecter(xp, ypBas, xs, yeHaut) {       // tronc, barre horizontale, puis une branche par enfant
  const yb = (ypBas + yeHaut) / 2;
  let t = galTrait(xp, ypBas, xp, yb);
  if (xs.length) t += galTrait(Math.min(...xs), yb, Math.max(...xs), yb);
  xs.forEach(x => { t += galTrait(x, yb, x, yeHaut); });
  return t;
}
function galBoite(cat, i, x, y, w, h, sommet) {       // tuile d'un grade (nom + galons), cliquable
  const g = galonsCategories.find(c => c.id === cat).grades[i];
  const nb = g.galons || 0;
  const zone = !nb ? 0 : (cat === 'officiers_generaux' ? 18 : 10 + nb * 5);
  let marques = '';
  if (nb && cat === 'officiers_generaux') marques = '<span class="gal-pastilles">' + '<i></i>'.repeat(nb) + '</span>';
  else if (nb) marques = '<span class="gal-barres">' + '<i></i>'.repeat(nb) + '</span>';
  return `<div class="boite-galon ${sommet ? 'sommet' : cat}" data-cat="${cat}" data-i="${i}" style="left:${x - w / 2}px;top:${y - h / 2}px;width:${w}px;height:${h}px">` +
         marques + `<span class="gal-nom" style="margin-top:${zone}px">${echapper(g.nom)}</span></div>`;
}
function galBarre(texte, x, y, w, h) {                // bandeau de catégorie (non cliquable)
  return `<div class="barre-galon" style="left:${x - w / 2}px;top:${y - h / 2}px;width:${w}px;height:${h}px">${texte}</div>`;
}

function construirePlanGalons() {                     // dessine tout le schéma une seule fois (mêmes positions que l'appli)
  const cx = GAL_L / 2;
  let traits = '', html = '';
  html += galBoite('officiers_generaux', 0, cx, 70, 320, 80, true);
  html += galBarre('OFFICIERS GÉNÉRAUX', cx, 170, 560, 40);
  traits += galConnecter(cx, 110, [cx], 150);
  const xg = [cx - 560, cx - 160, cx + 160, cx + 560];
  xg.forEach((x, k) => { html += galBoite('officiers_generaux', k + 1, x, 290, 280, 120); });
  traits += galConnecter(cx, 190, xg, 230);
  const xSub = xg[0], xSup = cx, xSo = xg[3];
  html += galBarre('OFFICIERS SUBALTERNES', xSub, 430, 300, 38);
  html += galBarre('OFFICIERS SUPÉRIEURS', xSup, 430, 520, 38);
  html += galBarre('SOUS-OFFICIERS', xSo, 430, 300, 38);
  traits += galConnecter(xg[0], 350, [xSub], 411);
  traits += galConnecter(cx, 350, [xg[1], xg[2]], 411);
  traits += galConnecter(xg[3], 350, [xSo], 411);
  const xs1 = [xSub - 120, xSub, xSub + 120];
  xs1.forEach((x, k) => { html += galBoite('officiers', k, x, 560, 110, 120); });
  traits += galConnecter(xSub, 449, xs1, 500);
  const xs2 = [xSup - 190, xSup, xSup + 190];
  html += galBoite('officiers', 3, xs2[0], 560, 220, 140);
  html += galBoite('officiers', 4, xs2[1], 560, 150, 120);
  html += galBoite('officiers', 5, xs2[2], 560, 130, 120);
  traits += galConnecter(xSup, 449, xs2, 500);
  const xs3 = [xSo - 240, xSo - 120, xSo, xSo + 120, xSo + 240];
  xs3.forEach((x, k) => { html += galBoite('sous_officiers', k, x, 560, 105, 120); });
  traits += galConnecter(xSo, 449, xs3, 500);
  html += galBarre('MILITAIRES DU RANG (MDR)', cx, 700, 560, 40);
  traits += galConnecter(cx, 620, [cx], 680);
  const xs4 = [cx - 210, cx, cx + 210];
  xs4.forEach((x, k) => { html += galBoite('militaires_du_rang', k, x, 810, 160, 110); });
  traits += galConnecter(cx, 720, xs4, 755);
  html += `<div class="gal-legende" style="left:${cx - 700}px;top:880px;width:1400px;height:140px"><b>LÉGENDE</b>\n` +
    galonsCategories.map(c => c.titre + ' : ' + c.description.charAt(0).toLowerCase() + c.description.slice(1)).join('\n') +
    '\n\nTouchez un grade pour en savoir plus. Pincez pour zoomer, glissez pour déplacer la vue.</div>';
  $('#plan-interactif').innerHTML = `<svg class="gal-traits" width="${GAL_L}" height="${GAL_H}" viewBox="0 0 ${GAL_L} ${GAL_H}">${traits}</svg>` + html;
  gal.construit = true;
}

function galTaille() {                                // taille du contenu affiché (plan dessiné ou image)
  if (gal.modeImage) { const im = $('#plan-image'); return [im.naturalWidth || 1536, im.naturalHeight || 1024]; }
  return [GAL_L, GAL_H];
}
function galAppliquer() { const el = gal.modeImage ? $('#plan-image') : $('#plan-interactif'); el.style.transform = `translate(${gal.tx}px, ${gal.ty}px) scale(${gal.sc})`; }
function galContraindre() {                           // vue d'ensemble : centré et immobile ; zoomé : borné aux bords du contenu
  const z = $('#plan-zone'), [cw, ch] = galTaille(), bw = cw * gal.sc, bh = ch * gal.sc;
  gal.tx = bw <= z.clientWidth ? (z.clientWidth - bw) / 2 : Math.min(0, Math.max(z.clientWidth - bw, gal.tx));
  gal.ty = bh <= z.clientHeight ? (z.clientHeight - bh) / 2 : Math.min(0, Math.max(z.clientHeight - bh, gal.ty));
  galAppliquer();
}
function galCentrer() {                               // vue d'ensemble : tout le schéma tient dans la zone
  const z = $('#plan-zone'); if (z.clientWidth < 2) return;
  const [cw, ch] = galTaille();
  const ech = Math.min(z.clientWidth / cw, z.clientHeight / ch) * 0.96;
  gal.scMin = ech * 0.999; gal.scMax = Math.max(gal.modeImage ? 2.2 : 1.6, ech * 3);
  gal.sc = ech; galContraindre();
}
function galZoomer(f, mx, my) {                       // zoom de facteur f autour du point (mx, my) de la zone
  const cible = Math.min(Math.max(gal.sc * f, gal.scMin), gal.scMax), r = cible / gal.sc;
  gal.tx = mx - (mx - gal.tx) * r; gal.ty = my - (my - gal.ty) * r; gal.sc = cible; galContraindre();
}

function ouvrirInfoGalon(cat, i) {                    // infobulle : nom du grade + rôle de sa catégorie
  const c = galonsCategories.find(x => x.id === cat);
  ouvrirModale(c.grades[i].nom.split('\n')[0], `<p class="centre">${echapper(c.description)}</p>`, [{ texte: 'OK' }]);
}

(function brancherGalons() {                          // pincer, glisser, molette, toucher une tuile
  const z = $('#plan-zone');
  const pos = (e) => { const r = z.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  z.addEventListener('pointerdown', (e) => {
    z.setPointerCapture(e.pointerId);
    galPointeurs.set(e.pointerId, pos(e));
    if (galPointeurs.size === 1) {
      const t = e.target.closest ? e.target.closest('.boite-galon') : null;
      galGeste = { x0: e.clientX, y0: e.clientY, tuile: t, seul: true, sc0: gal.sc };
    } else if (galGeste) galGeste.seul = false;       // 2 doigts : ce n'est plus un simple toucher
  });
  z.addEventListener('pointermove', (e) => {
    if (!galPointeurs.has(e.pointerId)) return;
    const avant = [...galPointeurs.values()], p = pos(e);
    galPointeurs.set(e.pointerId, p);
    if (galPointeurs.size === 1) {
      gal.tx += p[0] - avant[0][0]; gal.ty += p[1] - avant[0][1]; galContraindre();
    } else if (galPointeurs.size === 2) {
      const [a, b] = [...galPointeurs.values()];
      const [a0, b0] = avant;                          // positions des deux doigts avant ce mouvement
      const d0 = Math.hypot(a0[0] - b0[0], a0[1] - b0[1]) || 1, d1 = Math.hypot(a[0] - b[0], a[1] - b[1]);
      const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
      gal.tx += mx - (a0[0] + b0[0]) / 2; gal.ty += my - (a0[1] + b0[1]) / 2; // le centre des doigts entraîne la vue
      galZoomer(d1 / d0, mx, my);
    }
  });
  const fin = (e) => {
    if (!galPointeurs.has(e.pointerId)) return;
    galPointeurs.delete(e.pointerId);
    if (galPointeurs.size === 0 && galGeste) {
      const g = galGeste; galGeste = null;
      const bouge = Math.hypot(e.clientX - g.x0, e.clientY - g.y0);
      if (e.type === 'pointerup' && g.seul && g.tuile && bouge < 12 && Math.abs(gal.sc - g.sc0) < 1e-3) {
        vibrer(10); ouvrirInfoGalon(g.tuile.dataset.cat, +g.tuile.dataset.i);
      }
    }
  };
  z.addEventListener('pointerup', fin); z.addEventListener('pointercancel', fin);
  z.addEventListener('wheel', (e) => { e.preventDefault(); const [mx, my] = pos(e); galZoomer(e.deltaY < 0 ? 1.12 : 1 / 1.12, mx, my); }, { passive: false });
  window.addEventListener('resize', () => { if ($('#galons').classList.contains('actif')) galCentrer(); });
  $('#gal-recentrer').addEventListener('click', galCentrer);
  $('#gal-mode').addEventListener('click', () => {    // bascule INTERACTIF <-> IMAGE (fondu rapide)
    const zone = $('#plan-zone'); zone.classList.add('bascule');
    setTimeout(() => {
      gal.modeImage = !gal.modeImage;
      $('#plan-interactif').hidden = gal.modeImage; $('#plan-image').hidden = !gal.modeImage;
      $('#gal-mode').textContent = gal.modeImage ? 'INTERACTIF' : 'IMAGE';
      galCentrer(); zone.classList.remove('bascule');
    }, 150);
  });
  $('#plan-image').addEventListener('load', () => { if (gal.modeImage) galCentrer(); });
})();

async function ouvrirGalons() {
  if (!galonsCategories.length) {
    try {
      const rep = await fetch('galons.json');
      galonsCategories = await rep.json();
    } catch (e) { toast('Chargement impossible'); return; }
  }
  if (!gal.construit) construirePlanGalons();
  afficherEcran('galons');
  gal.modeImage = false; $('#plan-interactif').hidden = false; $('#plan-image').hidden = true; $('#gal-mode').textContent = 'IMAGE';
  requestAnimationFrame(galCentrer);                  // la zone n'a sa taille qu'une fois l'écran affiché
}
$('#btn-retour-galons').addEventListener('click', () => afficherEcran('accueil'));

// ===== MANIFESTE =====
let pages = [];                                      // toutes les pages (chargées depuis manifeste.json)
let index = 0;                                       // numéro de la page affichée (0 = première)

// Échappe les caractères spéciaux HTML pour éviter les bugs d'affichage
function echapper(texte) {                           // texte brut en entrée
  return texte.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); // remplace & < >
}

// Transforme les blocs d'une page en HTML (équivalent de convertir_page_markup)
function pageVersHtml(page) {                        // page = un élément de manifeste.json
  const numeros = new Set(pages.map(p => p.numero)); // tous les numéros de page existants
  return page.blocs.map(b => {                       // pour chaque bloc de la page
    const type = b[0];                               // type : h1, h2, p, quote, list, img
    if (type === 'h1') return `<h1>${echapper(b[1])}</h1>`;   // grand titre vert
    if (type === 'h2') return `<h2>${echapper(b[1])}</h2>`;   // sous-titre rouge
    if (type === 'p')  return `<p>${echapper(b[1])}</p>`;     // paragraphe
    if (type === 'quote') {                          // citation
      const source = b[2] ? `<cite>— ${echapper(b[2])}</cite>` : ''; // auteur si présent
      return `<blockquote>« ${echapper(b[1])} »${source}</blockquote>`; // citation entre guillemets
    }
    if (type === 'list') {                           // liste (ex : table des matières)
      return '<ul>' + b[1].map(item => {             // pour chaque ligne de la liste
        const m = item.match(/(\d+)\s*$/);           // cherche un numéro de page à la fin
        if (m && numeros.has(m[1])) {                // si ce numéro correspond à une page
          const debut = echapper(item.slice(0, m.index)); // texte avant le numéro
          return `<li>${debut}<a class="ref" data-page="${m[1]}">${m[1]}</a></li>`; // numéro cliquable
        }
        return `<li>${echapper(item)}</li>`;         // ligne simple
      }).join('') + '</ul>';                         // assemble toutes les lignes
    }
    if (type === 'img') {                            // image (couverture, armoiries...)
      return `<img src="${b[1]}" alt="" onerror="this.outerHTML='<div class=&quot;image-absente&quot;>Image à ajouter : ${b[1]}</div>'">`; // message si le fichier manque
    }
    return '';                                       // type inconnu : rien
  }).join('');                                       // assemble tous les blocs
}

// Affiche la page numéro n
function afficherPage(n) {                           // n = numéro (0 à pages.length-1)
  index = Math.max(0, Math.min(pages.length - 1, n)); // garde n entre la 1re et la dernière page
  const zone = $('#page-contenu');                   // zone de lecture
  zone.innerHTML = pageVersHtml(pages[index]);       // remplit avec la page
  zone.scrollTop = 0;                                // remonte en haut
  $('#titre-page').textContent = pages[index].numero; // titre = nom/numéro de la page
  $('#compteur').textContent = (index + 1) + ' / ' + pages.length; // "3 / 52"
  $('#btn-prec').disabled = index === 0;             // grise Précédent sur la 1re page
  $('#btn-suiv').disabled = index === pages.length - 1; // grise Suivant sur la dernière
  try { localStorage.setItem('manifeste_index', index); } catch (e) {} // mémorise la page (dans le navigateur)
}

// Ouvre l'écran Manifeste (charge le contenu la 1re fois)
async function ouvrirManifeste() {                   // async = peut attendre le chargement
  if (!pages.length) {                               // si les pages ne sont pas encore chargées
    const rep = await fetch('manifeste.json');       // télécharge le fichier de contenu
    pages = await rep.json();                        // le transforme en données
  }
  afficherEcran('manifeste');                        // montre l'écran
  let debut = 0;                                     // page de départ par défaut
  try { debut = parseInt(localStorage.getItem('manifeste_index')) || 0; } catch (e) {} // reprend où on s'était arrêté
  afficherPage(debut);                               // affiche cette page
}

// ===== Boutons du Manifeste =====
$('#btn-retour').addEventListener('click', () => afficherEcran('accueil')); // flèche : retour accueil
$('#btn-prec').addEventListener('click', () => afficherPage(index - 1));    // Précédent
$('#btn-suiv').addEventListener('click', () => afficherPage(index + 1));    // Suivant
$('#btn-sommaire').addEventListener('click', () => {                        // bouton sommaire
  const i = pages.findIndex(p => p.numero === 'Table des matières');        // trouve la table des matières
  if (i >= 0) afficherPage(i);                                              // y va si elle existe
});
$('#page-contenu').addEventListener('click', (e) => {                       // clic dans le texte
  const ref = e.target.closest('.ref');                                     // était-ce un numéro cliquable ?
  if (!ref) return;                                                         // sinon on ne fait rien
  const i = pages.findIndex(p => p.numero === ref.dataset.page);            // trouve la page visée
  if (i >= 0) afficherPage(i);                                              // y va
});

// ===== CHANTS =====
let categories = [];                                 // toutes les catégories (chargées depuis chants.json)

// Construit la liste des catégories et de leurs chants (une seule fois)
function construireChants() {                        // appelée à la 1re ouverture de l'écran
  const conteneur = $('#liste-categories');           // conteneur de l'accordéon
  categories.forEach((cat, i) => {                    // pour chaque catégorie (cat) et son numéro (i)
    const bloc = document.createElement('div');       // crée le bloc de la catégorie
    bloc.className = 'categorie verre';               // style tuile + verre
    const entete = document.createElement('div');     // ligne cliquable (titre + flèche)
    entete.className = 'categorie-entete';
    entete.innerHTML =                                // contenu de la ligne
      `<span class="num">${i + 1}</span>` +           // numéro rond
      `<span class="titre-cat">${cat.categorie}</span>` + // nom de la catégorie
      `<span class="fleche">▼</span>`;                // chevron (tourne à l'ouverture)
    entete.addEventListener('click', () => bloc.classList.toggle('ouverte')); // ouvre/ferme au clic
    const liste = document.createElement('div');      // conteneur des chants de cette catégorie
    liste.className = 'liste-chants';
    cat.chants.forEach((chant, j) => {                // pour chaque chant de la catégorie
      const ligne = document.createElement('div');    // une ligne cliquable
      ligne.className = 'chant-ligne';
      ligne.innerHTML = `<span class="puce">—</span><span>${chant.titre}</span>`; // tiret + nom
      ligne.addEventListener('click', () => ouvrirParoles(cat, j)); // au clic : ouvre les paroles
      liste.appendChild(ligne);                       // ajoute la ligne à la catégorie
    });
    bloc.appendChild(entete);                         // assemble : entête...
    bloc.appendChild(liste);                          // ...puis liste des chants
    conteneur.appendChild(bloc);                      // ajoute la catégorie à l'écran
  });
}

// Ouvre l'écran Chants (charge le contenu la 1re fois)
async function ouvrirChants() {                       // async = peut attendre le chargement
  if (!categories.length) {                            // si pas encore chargé
    const rep = await fetch('chants.json');            // télécharge le fichier des paroles
    categories = await rep.json();                     // le transforme en données
    construireChants();                                 // construit l'accordéon une seule fois
  }
  if (!mappingAudio) await chargerMappingAudio();        // charge audio_mapping.json avant le 1er chant ouvert
  afficherEcran('chants');                              // montre l'écran
}

// Transforme un titre de chant en nom de fichier.
// D'abord audio_mapping.json (les vrais noms, notamment les 4 exceptions historiques
// de l'app Android : ditanye.mp3, immerge.mp3, honneur_de_la_patrie.mp3, imbonaleh.mp3),
// et seulement si le titre n'y figure pas, un calcul automatique en repli.
let mappingAudio = null;                               // rempli au premier appel (voir chargerMappingAudio)
async function chargerMappingAudio() {
  try { const rep = await fetch('audio_mapping.json'); mappingAudio = await rep.json(); }
  catch (e) { mappingAudio = {}; }                      // hors connexion sans cache : on gardera le calcul automatique
}
function nomFichierAudioCalcule(titre) {                // titre = "Le Ditanyè (Burkina Faso)" par ex.
  let t = titre.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // enlève les accents (é -> e)
  t = t.toLowerCase();                                // tout en minuscules
  t = t.replace(/\([^)]*\)/g, '');                    // enlève les parenthèses "(Burkina Faso)"
  t = t.replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, ''); // remplace le reste par des "_"
  return t + '.mp3';
}
const PISTES_LANGUES = {                               // chants proposés en plusieurs langues : [nom affiché, fichier]
  'Le Ditanyè (Burkina Faso)': [['Français', 'ditanye.mp3'], ['Mooré', 'ditanye_moore.mp3'], ['Dioula', 'ditanye_dioula.mp3'], ['Fulfulde', 'ditanye_fulfulde.mp3']],
};
const pisteParChant = {};                              // langue choisie par chant (index dans PISTES_LANGUES), 0 = la 1re
function nomFichierAudio(titre) {
  const pistes = PISTES_LANGUES[titre];
  if (pistes) return 'assets/audio/' + pistes[pisteParChant[titre] || 0][1]; // chant multilingue : fichier de la langue choisie
  const nom = (mappingAudio && mappingAudio[titre]) || nomFichierAudioCalcule(titre);
  return 'assets/audio/' + nom;                        // chemin complet attendu du fichier
}

const lecteurAudio = new Audio();                     // un seul lecteur audio réutilisé pour tous les chants
let enLecture = false;                                // sait si un son est en train de jouer
let chantEnCours = '';                                // titre du chant actuellement chargé (pour le mini-lecteur)
let curseurTenu = false;                              // vrai pendant qu'on fait glisser le curseur (évite les sauts)

function formaterTemps(s) {                           // 125.4 -> "2:05"
  if (!isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60), r = Math.floor(s % 60);
  return m + ':' + String(r).padStart(2, '0');
}

// Ouvre les paroles d'un chant précis (cat = sa catégorie, j = sa position dans la catégorie)
function ouvrirParoles(cat, j) {                        // appelée au clic sur une ligne de chant
  const chant = cat.chants[j];                          // récupère le chant choisi
  $('#titre-chant').textContent = chant.titre;          // affiche son titre en haut
  $('#paroles-texte').innerHTML = chant.html;           // affiche ses paroles (avec Couplet/Refrain en rouge)
  $('#paroles-texte').scrollTop = 0;                    // remonte en haut du texte
  afficherEcran('paroles');                             // montre l'écran

  afficherChoixLangue(chant);                           // puces de langue (seulement pour les chants multilingues)
  if (chant.titre === chantEnCours) return;             // même chant déjà chargé (ex: retour depuis un autre écran) : on ne relance rien

  lecteurAudio.pause();                                 // arrête un éventuel chant précédent
  enLecture = false;                                    // plus rien en lecture
  chantEnCours = chant.titre;
  $('#mini-titre-chant').textContent = chant.titre;
  chargerSon(chant, false);                             // charge le fichier audio du chant
}

// Charge le fichier audio du chant (ou de la langue choisie) ; jouerApres = lancer la lecture dès que c'est prêt
function chargerSon(chant, jouerApres) {
  const btn = $('#btn-lecture'), miniBtn = $('#mini-lecture');  // boutons lecture/pause (page + mini-lecteur)
  btn.textContent = miniBtn.textContent = '▶';          // icône "jouer" par défaut
  btn.disabled = true;                                  // grisé tant qu'on n'a pas vérifié le fichier
  $('#barre-progression').hidden = true;                // cachée tant que la durée n'est pas connue
  if (!jouerApres) $('#mini-lecteur').hidden = true;    // caché tant que le fichier n'est pas confirmé
  $('#curseur-audio').value = 0; $('#temps-actuel').textContent = '0:00'; $('#mini-barre-remplie').style.width = '0%';
  lecteurAudio.src = nomFichierAudio(chant.titre);       // chemin du fichier audio attendu pour ce chant
  lecteurAudio.oncanplay = () => {                       // le fichier existe et se charge
    btn.disabled = false;
    $('#barre-progression').hidden = false;
    $('#curseur-audio').max = lecteurAudio.duration || 0;
    $('#temps-total').textContent = formaterTemps(lecteurAudio.duration);
    if (jouerApres) { jouerApres = false; lecteurAudio.play().catch(() => {}); } // changement de langue pendant la lecture : on enchaîne
  };
  lecteurAudio.onerror = async () => {                   // le son ne se charge pas : bouton grisé + message qui explique pourquoi
    btn.disabled = true;
    const chemin = nomFichierAudio(chant.titre);         // fichier demandé
    const code = lecteurAudio.error ? lecteurAudio.error.code : 0; // 3 = fichier illisible, 4 = introuvable ou format non lu
    let etat = '';
    try { const r = await fetch(chemin, { method: 'HEAD', cache: 'no-store' }); etat = r.ok ? 'fichier trouvé mais illisible' : 'introuvable (HTTP ' + r.status + ')'; }
    catch (e) { etat = 'serveur injoignable'; }
    toast('Son : ' + chemin + ' — ' + etat + ' [code ' + code + ']');
  };
  lecteurAudio.load();                                   // lance la vérification/chargement
}

// Puces de langue au-dessus des paroles (visibles seulement si le chant a plusieurs pistes)
function afficherChoixLangue(chant) {
  const zone = $('#choix-langue'), pistes = PISTES_LANGUES[chant.titre];
  if (!pistes) { zone.hidden = true; zone.innerHTML = ''; return; }
  const actuelle = pisteParChant[chant.titre] || 0;
  zone.innerHTML = pistes.map((p, k) => `<button class="puce-langue${k === actuelle ? ' active' : ''}" data-k="${k}">${p[0]}</button>`).join('');
  zone.hidden = false;
  zone.querySelectorAll('.puce-langue').forEach(b => b.addEventListener('click', () => {
    const k = +b.dataset.k;
    if (k === (pisteParChant[chant.titre] || 0)) return;  // déjà cette langue
    const jouait = enLecture && chantEnCours === chant.titre; // on enchaîne la lecture si ça jouait
    pisteParChant[chant.titre] = k;
    lecteurAudio.pause();
    afficherChoixLangue(chant);                           // met à jour la puce active
    if (chantEnCours === chant.titre) chargerSon(chant, jouait);
  }));
}

// Joue ou met en pause le chant actuellement affiché
function basculerLecture() {                             // appelée au clic sur le bouton ▶/⏸ (page ou mini-lecteur)
  if (enLecture) {                                       // si ça joue déjà
    lecteurAudio.pause();                                // on met en pause
  } else {                                               // sinon
    lecteurAudio.play();                                 // on lance la lecture
  }
}
function arreterLecture() {                              // bouton ✕ du mini-lecteur : arrête et oublie le chant
  lecteurAudio.pause();
  lecteurAudio.removeAttribute('src');
  chantEnCours = '';
  $('#mini-lecteur').hidden = true;
}
lecteurAudio.addEventListener('play',  () => { enLecture = true;  $('#btn-lecture').textContent = $('#mini-lecture').textContent = '⏸'; $('#mini-lecteur').hidden = false; });
lecteurAudio.addEventListener('pause', () => { enLecture = false; $('#btn-lecture').textContent = $('#mini-lecture').textContent = '▶'; });
lecteurAudio.addEventListener('ended', () => { enLecture = false; $('#btn-lecture').textContent = $('#mini-lecture').textContent = '▶'; });
lecteurAudio.addEventListener('timeupdate', () => {      // avance régulièrement pendant la lecture
  if (curseurTenu) return;                                // on ne touche pas au curseur pendant que le doigt le tient
  $('#curseur-audio').value = lecteurAudio.currentTime;
  $('#temps-actuel').textContent = formaterTemps(lecteurAudio.currentTime);
  const pct = lecteurAudio.duration ? (lecteurAudio.currentTime / lecteurAudio.duration * 100) : 0;
  $('#mini-barre-remplie').style.width = pct + '%';
});
// Curseur de la page du chant : avancer/reculer en faisant glisser, ou en touchant un point précis
$('#curseur-audio').addEventListener('input', () => { curseurTenu = true; $('#temps-actuel').textContent = formaterTemps(+$('#curseur-audio').value); });
$('#curseur-audio').addEventListener('change', () => { lecteurAudio.currentTime = +$('#curseur-audio').value; curseurTenu = false; });
$('#mini-lecture').addEventListener('click', basculerLecture);
$('#mini-fermer').addEventListener('click', arreterLecture);
$('#mini-titre-chant').addEventListener('click', () => afficherEcran('paroles')); // revenir au texte depuis le mini-lecteur

// ===== Boutons de Chants et Paroles =====
$('#btn-retour-chants').addEventListener('click', () => afficherEcran('accueil'));  // retour à l'accueil
$('#btn-retour-paroles').addEventListener('click', () => afficherEcran('chants'));  // retour à la liste ; le son continue (mini-lecteur)
$('#btn-lecture').addEventListener('click', basculerLecture); // joue/pause au clic sur le bouton

// ===== PROFIL, RÉGLAGES ET MENU DE LA TÊTE (équivalent de MenuTete / PopupProfil / PopupReglages) =====
const LIEN_APP = 'https://4sc4.github.io/IPO/';        // lien de l'appli (partage et mise à jour)
const EMAIL_CONTACT = 'abdoulascandrou@gmail.com';     // contact affiché dans À propos
const LIENS = { TikTok: 'https://www.tiktok.com/@2adot?_r=1&_t=ZS-99qRWf2wFD3', WhatsApp: 'https://wa.me/qr/5HLUR7SZD7KYI1', GitHub: 'https://github.com/4sc4' }; // réseaux
const VERSION_APP = 'IPO WEB v24';                       // version affichée dans « À propos »

// Textes de l'interface en deux langues (les cours restent en français)
const TEXTES = {
  fr: { profil: 'Profil', reglages: 'Réglages', reglages_titre: 'RÉGLAGES', compte: 'Compte', langue: 'Langue', notifications: 'Notifications', son: 'Sons', vibration: 'Vibration', texte: 'Texte agrandi', aide: 'Aide / FAQ', apropos: 'À propos', partager: "Partager l'application", maj: 'Mise à jour', donnees: 'Réinitialiser mes données', fermer: 'Fermer', annuler: 'Annuler', valider: 'Valider', espace: 'ESPACE UTILISATEUR', statut: 'Statut', session: 'SESSION IPO', centre: 'CENTRE D’IMMERSION', inscription: 'INSCRIPTION VÉRIFIÉE', reinit_profil: 'RÉINITIALISER LE PROFIL' },
  en: { profil: 'Profile', reglages: 'Settings', reglages_titre: 'SETTINGS', compte: 'Account', langue: 'Language', notifications: 'Notifications', son: 'Sound', vibration: 'Vibration', texte: 'Larger text', aide: 'Help / FAQ', apropos: 'About', partager: 'Share the app', maj: 'Update', donnees: 'Reset my data', fermer: 'Close', annuler: 'Cancel', valider: 'OK', espace: 'USER SPACE', statut: 'Status', session: 'IPO SESSION', centre: 'IMMERSION CENTER', inscription: 'VERIFIED REGISTRATION', reinit_profil: 'RESET PROFILE' },
};
const STATUTS = { appele: ['Vérifié', 'Verified'], engage: ['Engagé', 'Committed'], camarade: ['Camarade', 'Comrade'], '': ['En cours', 'In progress'] }; // statuts possibles

// Lecture / écriture dans la mémoire du navigateur (protégées : ne plantent jamais)
function lireMemoire(cle, defaut) {
  try { return Object.assign({}, defaut, JSON.parse(localStorage.getItem(cle) || '{}')); } catch (e) { return Object.assign({}, defaut); }
}
function ecrireMemoire(cle, val) { try { localStorage.setItem(cle, JSON.stringify(val)); } catch (e) {} }

const DEF_REGLAGES = { langue: 'fr', notifications: true, son: true, vibration: true, texte: false };
const DEF_PROFIL = { nom: '', pv: 'PV', statut: '', annee: '', centre: '', phrase_1: 'LA PATRIE', phrase_2: 'OU LA MORT', phrase_3: 'NOUS VAINCRONS', avatar: '' };
let reglages = lireMemoire('ipo_reglages', DEF_REGLAGES);   // réglages enregistrés
let profil = lireMemoire('ipo_profil', DEF_PROFIL);         // profil enregistré
const tr = (cle) => TEXTES[reglages.langue][cle] || TEXTES.fr[cle] || cle; // texte dans la langue choisie

function sauverReglages() { ecrireMemoire('ipo_reglages', reglages); }
function sauverProfil() { ecrireMemoire('ipo_profil', profil); }
function vibrer(ms) { if (reglages.vibration && navigator.vibrate) { try { navigator.vibrate(ms); } catch (e) {} } } // petite vibration si permise

// Applique les réglages visibles (langue, texte agrandi, son)
function appliquerReglages() {
  document.documentElement.lang = reglages.langue;                                      // langue de la page
  document.querySelectorAll('[data-t]').forEach(el => { el.textContent = tr(el.dataset.t); }); // libellés fixes
  document.body.classList.toggle('texte-grand', !!reglages.texte);                      // texte agrandi
  lecteurAudio.muted = !reglages.son;                                                   // sons coupés ou non
}

// ----- Fenêtre modale générique -----
function ouvrirModale(titre, contenuHtml, boutons) {
  const boite = $('#modale-boite');                                                     // boîte de la modale
  boite.innerHTML = (titre ? `<h3>${echapper(titre)}</h3><div class="liseret"></div>` : '') + contenuHtml + '<div class="modale-actions"></div>';
  const zone = boite.querySelector('.modale-actions');                                  // zone des boutons
  boutons.forEach(b => {                                                                // un bouton par action
    const el = document.createElement('button');
    el.className = 'btn-verre' + (b.danger ? ' btn-danger' : '');
    el.textContent = b.texte;
    el.addEventListener('click', () => { if (b.action && b.action() === false) return; fermerModale(); }); // action puis fermeture (sauf si false)
    zone.appendChild(el);
  });
  $('#modale').classList.add('ouverte');                                                // affiche la modale
  const champ = boite.querySelector('input'); if (champ) setTimeout(() => champ.focus(), 50); // curseur dans le champ
}
function fermerModale() { $('#modale').classList.remove('ouverte'); }
$('#modale').addEventListener('click', (e) => { if (e.target.id === 'modale') fermerModale(); }); // toucher en dehors ferme

// Demande une valeur texte (nom, PV, phrases...)
function demanderTexte(titre, valeur, enregistrer, majuscules) {
  ouvrirModale(titre, `<input type="text" id="champ-modale" maxlength="40" value="${echapper(valeur || '').replace(/"/g, '&quot;')}">`, [
    { texte: tr('annuler') },
    { texte: tr('valider'), action: () => { let v = $('#champ-modale').value.trim(); if (majuscules) v = v.toUpperCase(); enregistrer(v); } },
  ]);
}

// ----- Menu de la tête -----
let dernierMenu = 0;                                                                    // anti double appui
function ouvrirMenuTete() {
  const maintenant = Date.now();
  if (maintenant - dernierMenu < 600) return;                                           // ignore un 2e appui rapproché
  dernierMenu = maintenant;
  vibrer(15);
  $('#menu-avatar').src = profil.avatar || 'icones/avatar.png';                         // photo du profil dans le menu
  $('#menu-tete').classList.add('ouvert');                                              // affiche le menu
}
function fermerMenuTete() { $('#menu-tete').classList.remove('ouvert'); }
$('#btn-tete').addEventListener('click', ouvrirMenuTete);                               // la tête ouvre le menu
$('#menu-tete').addEventListener('click', (e) => { if (e.target.id === 'menu-tete') fermerMenuTete(); }); // dehors = fermer
$('#menu-profil').addEventListener('click', () => { fermerMenuTete(); ouvrirProfil('accueil'); });
$('#menu-reglages').addEventListener('click', () => { fermerMenuTete(); ouvrirReglages(); });

// ----- Écran Profil -----
let retourProfil = 'accueil';                                                           // écran où revenir
function ouvrirProfil(origine) { retourProfil = origine || 'accueil'; rendreProfil(); afficherEcran('profil'); }
function rendreProfil() {
  const nomStatut = STATUTS[profil.statut] ? STATUTS[profil.statut][reglages.langue === 'fr' ? 0 : 1] : STATUTS[''][0];
  const centre = (profil.centre || '').trim().split(/\s+/).filter(Boolean);
  const centreAff = centre.length === 2 ? centre.map(m => m[0].toUpperCase()).join('') : centre.join(' '); // deux mots -> sigles
  const e = echapper;
  $('#profil-contenu').innerHTML =
    `<div class="profil-haut">
       <div class="avatar-bloc"><div class="avatar"><img src="${profil.avatar || 'icones/avatar.png'}" alt=""></div>
         <div class="avatar-actions"><button class="btn-verre" data-act="photo" aria-label="Photo">✎</button>${profil.avatar ? '<button class="btn-verre" data-act="photo-defaut" aria-label="Photo par défaut">↺</button>' : ''}</div></div>
       <div class="carte-id" data-champ="nom"><small>ID IPO</small><b>${profil.nom ? e(profil.nom.toUpperCase()) : tr('espace')}</b></div>
     </div>
     <div class="duo">
       <div class="carte-info" data-champ="pv"><small>PV</small><b>${e(profil.pv || 'PV')}</b></div>
       <div class="carte-info" data-champ="statut"><small>${tr('statut')}</small><b>${e(nomStatut)}</b></div>
     </div>
     <div class="bloc-lignes">
       <div class="ligne-info" data-champ="statut"><span>${tr('inscription')}</span><div class="badge">${profil.statut === 'appele' ? 'OK' : '—'}</div></div>
       <div class="ligne-info" data-champ="annee"><span>${tr('session')}</span><div class="badge">${e(profil.annee || '—')}</div></div>
       <div class="ligne-info" data-champ="centre"><span>${tr('centre')}</span><div class="badge">${e(centreAff || '—')}</div></div>
     </div>
     <div class="phrases">
       ${[1, 2, 3].map(n => `<div class="phrase" data-champ="phrase_${n}">${e(profil['phrase_' + n] || DEF_PROFIL['phrase_' + n])}</div>`).join('')}
     </div>
     <button class="btn-verre large btn-danger" data-act="reinit">${tr('reinit_profil')}</button>`;
}
const TITRES_CHAMPS = { nom: 'ID IPO', pv: 'PV', annee: 'Session IPO (ex : 2026)', centre: 'Centre d’immersion', phrase_1: 'Phrase 1', phrase_2: 'Phrase 2', phrase_3: 'Phrase 3' }; // titres des fenêtres de saisie
$('#profil-contenu').addEventListener('click', (ev) => {
  vibrer(15);
  const act = ev.target.closest('[data-act]'); const champ = ev.target.closest('[data-champ]');
  if (act) {                                                                            // boutons d'action
    if (act.dataset.act === 'photo') $('#fichier-photo').click();                       // choisir une photo
    else if (act.dataset.act === 'photo-defaut') { profil.avatar = ''; sauverProfil(); rendreProfil(); } // photo par défaut
    else if (act.dataset.act === 'reinit') confirmerReinitialisation();                 // effacer le profil
    return;
  }
  if (!champ) return;
  const c = champ.dataset.champ;
  if (c === 'statut') {                                                                // choix du statut en 3 boutons
    const choisir = (v) => () => { profil.statut = v; sauverProfil(); rendreProfil(); };
    ouvrirModale(tr('statut'), '', [
      { texte: STATUTS.appele[reglages.langue === 'fr' ? 0 : 1] + ' (IPO)', action: choisir('appele') },
      { texte: STATUTS.engage[reglages.langue === 'fr' ? 0 : 1], action: choisir('engage') },
      { texte: STATUTS.camarade[reglages.langue === 'fr' ? 0 : 1], action: choisir('camarade') },
    ]);
    return;
  }
  demanderTexte(TITRES_CHAMPS[c], profil[c], (v) => { profil[c] = v; sauverProfil(); rendreProfil(); }, c.startsWith('phrase_') || c === 'pv');
});
$('#fichier-photo').addEventListener('change', (ev) => {                               // photo choisie : recadrée en carré 256 px
  const f = ev.target.files[0]; if (!f) return;
  const img = new Image(); const url = URL.createObjectURL(f);
  img.onload = () => {
    const c = document.createElement('canvas'); c.width = c.height = 256;
    const t = Math.min(img.width, img.height);                                          // plus grand carré centré
    c.getContext('2d').drawImage(img, (img.width - t) / 2, (img.height - t) / 2, t, t, 0, 0, 256, 256);
    profil.avatar = c.toDataURL('image/jpeg', 0.85); sauverProfil(); rendreProfil(); URL.revokeObjectURL(url);
  };
  img.onerror = () => toast('Image illisible');
  img.src = url; ev.target.value = '';                                                  // permet de rechoisir la même photo
});
$('#btn-retour-profil').addEventListener('click', () => afficherEcran(retourProfil));

// Efface le profil et les réglages (comme _reinitialiser_donnees_app)
function confirmerReinitialisation() {
  ouvrirModale(tr('donnees'), `<p class="centre">${reglages.langue === 'fr' ? 'Ton profil sera effacé. Continuer ?' : 'Your profile will be erased. Continue?'}</p>`, [
    { texte: tr('annuler') },
    { texte: tr('valider'), danger: true, action: () => { profil = Object.assign({}, DEF_PROFIL); sauverProfil(); ouvrirOnboarding(); toast(reglages.langue === 'fr' ? 'Profil réinitialisé' : 'Profile reset'); } },
  ]);
}

// ----- Écran Réglages -----
function ouvrirReglages() { rendreReglages(); afficherEcran('reglages'); }
function rendreReglages() {
  const inter = (cle) => `<div class="interrupteur ${reglages[cle] ? 'actif' : ''}"></div>`;
  const ligne = (id, texte, droite) => `<div class="ligne-reglage" data-id="${id}"><span>${texte}</span>${droite || ''}</div>`;
  $('#reglages-liste').innerHTML =
    ligne('compte', tr('compte')) +
    ligne('langue', tr('langue'), `<span class="valeur">${reglages.langue === 'fr' ? 'Français' : 'English'}</span>`) +
    ligne('notifications', tr('notifications'), inter('notifications')) +
    ligne('son', tr('son'), inter('son')) +
    ligne('vibration', tr('vibration'), inter('vibration')) +
    ligne('texte', tr('texte'), inter('texte')) +
    ligne('aide', tr('aide')) + ligne('apropos', tr('apropos')) + ligne('partager', tr('partager')) +
    ligne('maj', tr('maj')) + ligne('donnees', tr('donnees'));
}
const FAQ = "• Comment lancer un module ?\n  Depuis l'accueil, ouvre la tuile COURS pour retrouver les modules disponibles.\n\n• À quoi servent les tuiles ORDRE SERRÉ, TIOR et GALONS ?\n  Chacune ouvre son propre espace de contenu, comme Chants et Contribuer.\n\n• Où modifier mon profil ?\n  Réglages > Compte, ou via la tête en haut à droite de l'accueil.\n\n• Comment changer la langue de l'interface ?\n  Réglages > Langue. Les cours restent en français pour le moment.\n\n• Qui est Asca ?\n  Appelé de l'immersion patriotique obligatoire session 2026 du complexe scolaire le Savoir.";
// Texte de la page À propos (comme dans main.py)
const TEXTE_APROPOS = "IPO est une application dédiée à l’Immersion Patriotique Obligatoire. Elle permet de découvrir et de parcourir différents modules et chapitres liés à l’expérience d’immersion patriotique.\n\nPensée à la fois pour ceux qui souhaitent avoir un aperçu de cette expérience et pour ceux qui l’ont déjà vécue et souhaitent se remémorer certains de ses contenus, IPO rassemble ces éléments dans une interface simple et accessible.\n\nCette application n'est pas à but commercial et ne collecte aucune donnée personnelle.\nDu contenu sera progressivement ajouté.\nRejoins les plateformes ci-dessous pour rester informé(e) :\n\n";
function ouvrirApropos() {
  $('#apropos-col').innerHTML =
    `<h1 class="plein-titre">IPO</h1><div class="liseret"></div>
     <div class="plein-version">${VERSION_APP}</div>
     <div class="plein-texte">${echapper(TEXTE_APROPOS)}<span class="accent">IPO — Pour ma patrie, je m’engage.</span>\n\nContact : <a href="mailto:${EMAIL_CONTACT}">${EMAIL_CONTACT}</a></div>
     <div class="plein-reseaux">${Object.keys(LIENS).map(n => `<button class="btn-verre" data-lien="${n}">${n}</button>`).join('')}</div>
     <button class="btn-verre plein-fermer" data-fermer aria-label="Retour">←</button>`;
  $('#page-apropos').classList.add('ouvert');                                            // affiche en fondu
}
$('#apropos-col').addEventListener('click', (e) => {
  const lien = e.target.closest('[data-lien]');
  if (lien) { window.open(LIENS[lien.dataset.lien], '_blank', 'noopener'); return; }     // réseaux : nouvel onglet
  if (e.target.closest('[data-fermer]')) $('#page-apropos').classList.remove('ouvert');  // ferme
});

// ----- Page Contribuer -----
const CONTRIB = {
  fr: { titre: 'Contribuer', intro: "IPO grandit grâce à celles et ceux qui y participent. Choisis ta façon d'aider :", formes: [
    ['Rédiger et relire les cours', "Aide à écrire les chapitres, corrige les fautes et les informations à mettre à jour."],
    ['Apporter de nouveaux chants', "Paroles, partitions, enregistrements. Uniquement des œuvres que tu as le droit de partager."],
    ['Signaler ou corriger des bugs', "Un bug repéré est déjà une aide précieuse, même sans savoir coder."],
    ['Proposer des fonctionnalités', "Une idée pour améliorer IPO ? Propose-la, ou aide à la développer."],
    ["Traduire l'application", "Aide à rendre IPO accessible dans d'autres langues."],
    ["Tester l'application", "Essaie IPO sur ton téléphone et signale ce qui ne fonctionne pas."]],
    note: "Pour toute contribution, contacte le développeur dans la rubrique « À propos ».", partage: "Partager l'application", contact: 'CONTACTER LE DÉVELOPPEUR' },
  en: { titre: 'Contribute', intro: "IPO grows thanks to the people who take part. Choose how you want to help:", formes: [
    ['Write and proofread the courses', "Help write the chapters, fix mistakes and outdated information."],
    ['Bring new songs', "Lyrics, sheet music, recordings. Only works you have the right to share."],
    ['Report or fix bugs', "Spotting a bug is already a great help, even if you don't code."],
    ['Suggest new features', "An idea to improve IPO? Suggest it, or help build it."],
    ['Translate the app', "Help make IPO available in other languages."],
    ['Test the app', "Try IPO on your phone and report anything that doesn't work."]],
    note: 'For any contribution, contact the developer in the "About" section.', partage: 'Share the app', contact: 'CONTACT THE DEVELOPER' },
};
function ouvrirContribuer() {
  const T = CONTRIB[reglages.langue] || CONTRIB.fr;                                      // textes dans la langue choisie
  $('#contribuer-col').innerHTML =
    `<h1 class="plein-titre moyen">${T.titre}</h1><div class="liseret"></div>
     <div class="plein-intro">${echapper(T.intro)}</div>
     <div class="plein-texte">${T.formes.map(f => `<div class="contrib-bloc"><b>${echapper(f[0])}</b>${echapper(f[1])}</div>`).join('')}</div>
     <div class="plein-note">${echapper(T.note)}</div>
     <button class="btn-verre" data-act="partager">${echapper(T.partage)}</button>
     <button class="btn-verre" data-act="contact">${echapper(T.contact)}</button>
     <button class="btn-verre plein-fermer" data-fermer aria-label="Retour">←</button>`;
  $('#page-contribuer').classList.add('ouvert');
}
$('#contribuer-col').addEventListener('click', (e) => {
  const a = e.target.closest('[data-act]');
  if (a && a.dataset.act === 'partager') partagerApp();                                  // menu de partage
  else if (a && a.dataset.act === 'contact') ouvrirApropos();                            // ouvre À propos par-dessus
  else if (e.target.closest('[data-fermer]')) $('#page-contribuer').classList.remove('ouvert');
});

async function partagerApp() {
  const message = "Redécouvrez et vivez l'expérience de l'Immersion Patriotique Obligatoire à travers l'application : " + LIEN_APP;
  try {
    if (navigator.share) { await navigator.share({ title: 'IPO', text: message }); return; } // menu de partage du téléphone
    await navigator.clipboard.writeText(message); toast('Message copié');                     // sinon : copié dans le presse-papiers
  } catch (e) {}                                                                              // partage annulé : rien à faire
}
async function mettreAJour() {
  toast('Mise à jour…');
  try {
    if ('serviceWorker' in navigator) { const regs = await navigator.serviceWorker.getRegistrations(); for (const r of regs) await r.unregister(); } // retire le service worker
    if (window.caches) { for (const n of await caches.keys()) await caches.delete(n); }       // vide la mémoire hors connexion
  } catch (e) {}
  location.reload();                                                                          // recharge la dernière version
}
$('#reglages-liste').addEventListener('click', (ev) => {
  const l = ev.target.closest('.ligne-reglage'); if (!l) return;
  vibrer(15);
  const id = l.dataset.id;
  if (id === 'compte') ouvrirProfil('reglages');
  else if (id === 'langue') { reglages.langue = reglages.langue === 'fr' ? 'en' : 'fr'; sauverReglages(); appliquerReglages(); rendreReglages(); }
  else if (['notifications', 'son', 'vibration', 'texte'].includes(id)) {
    reglages[id] = !reglages[id]; sauverReglages(); appliquerReglages(); rendreReglages();
    if (id === 'vibration' && reglages.vibration) vibrer(80);                               // petit essai de vibration
    if (id === 'notifications' && reglages.notifications && window.Notification && Notification.permission === 'default') Notification.requestPermission(); // demande l'autorisation
  }
  else if (id === 'aide') ouvrirModale(tr('aide'), `<div class="faq">${echapper(FAQ)}</div>`, [{ texte: tr('fermer') }]);
  else if (id === 'apropos') ouvrirApropos();
  else if (id === 'partager') partagerApp();
  else if (id === 'maj') mettreAJour();
  else if (id === 'donnees') confirmerReinitialisation();
});
$('#btn-retour-reglages').addEventListener('click', () => afficherEcran('accueil'));
appliquerReglages();                                                                          // applique les réglages enregistrés dès le départ

// ===== Onboarding (questions à la toute première ouverture) =====
// Reprend le déroulé de EcranOnboarding de l'app Android : nom -> a participé ou non ->
// (année + centre) ou (engagement) -> écran de bienvenue -> accueil. Utilise les mêmes
// champs de profil (nom, statut, annee, centre) que l'écran Profil, sans rien dupliquer.
let onb = { nom: '', statut: '', annee: '', centre: '' };

function rendreEtapeOnb(html) {
  const zone = $('#onb-etape');
  zone.innerHTML = html;
  zone.classList.remove('onb-entree');           // relance l'animation d'entrée à chaque étape
  void zone.offsetWidth;                          // force le navigateur à relire avant de la rajouter
  zone.classList.add('onb-entree');
}
const onbCarte = (texte) => `<div class="onb-question verre">${echapper(texte).replace(/\n/g, '<br>')}</div>`;
const onbRetour = (libelle, cb) => { const id = 'onb-r' + Math.random().toString(36).slice(2, 7); setTimeout(() => $('#' + id)?.addEventListener('click', cb), 0); return `<button class="onb-bouton secondaire" id="${id}">${echapper(libelle)}</button>`; };

function onbEtapeNom() {
  rendreEtapeOnb(`
    ${onbCarte("Bienvenue !\nQuel est ton Nom et Prénom ?")}
    <input class="onb-champ verre" id="onb-nom" placeholder="Ex: SAVADOGO Abdoul" value="${echapper(onb.nom)}" autocapitalize="words">
    <div class="onb-boutons"><button class="onb-bouton verre" id="onb-valider-nom">VALIDER</button></div>
  `);
  const champ = $('#onb-nom'); champ.focus();
  const valider = () => { const v = champ.value.trim(); if (!v) { champ.focus(); return; } onb.nom = v; vibrer(10); onbEtapeImmersion(); };
  $('#onb-valider-nom').addEventListener('click', valider);
  champ.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') valider(); });
}

function onbEtapeImmersion() {
  rendreEtapeOnb(`
    ${onbCarte(`Ravi de te rencontrer ${onb.nom}.\n\nAs-tu participé à l'Immersion Patriotique Obligatoire ?`)}
    <div class="onb-boutons">
      <button class="onb-bouton verre" id="onb-oui">AFFIRMATIF</button>
      <button class="onb-bouton verre" id="onb-non">NÉGATIF</button>
      ${onbRetour('‹ Retour', onbEtapeNom)}
    </div>
  `);
  $('#onb-oui').addEventListener('click', () => { vibrer(10); onbEtapeAnnee(); });
  $('#onb-non').addEventListener('click', () => { vibrer(10); onbEtapeEngagement(); });
}

function onbEtapeAnnee() {
  rendreEtapeOnb(`
    ${onbCarte("Sélectionne ton année de participation :")}
    <div class="onb-boutons">
      <button class="onb-bouton verre" data-annee="2025">2025</button>
      <button class="onb-bouton verre" data-annee="2026">2026</button>
      ${onbRetour('‹ Retour', onbEtapeImmersion)}
    </div>
  `);
  document.querySelectorAll('.onb-bouton[data-annee]').forEach(b => b.addEventListener('click', () => { onb.annee = b.dataset.annee; vibrer(10); onbEtapeCentre(); }));
}

function onbEtapeCentre() {
  rendreEtapeOnb(`
    ${onbCarte("Dans quel centre as-tu effectué ton immersion ?")}
    <input class="onb-champ verre" id="onb-centre" placeholder="Ex: Complexe Le Savoir" value="${echapper(onb.centre)}" autocapitalize="words">
    <div class="onb-boutons">
      <button class="onb-bouton verre" id="onb-valider-centre">VALIDER</button>
      ${onbRetour('‹ Retour', onbEtapeAnnee)}
    </div>
  `);
  const champ = $('#onb-centre'); champ.focus();
  const valider = () => { const v = champ.value.trim(); if (!v) { champ.focus(); return; } onb.centre = v; vibrer(10); onb.statut = 'appele'; onbFinAppel(); };
  $('#onb-valider-centre').addEventListener('click', valider);
  champ.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') valider(); });
}

function onbFinAppel() {
  rendreEtapeOnb(`
    ${onbCarte(`BIENVENUE À TOI APPELÉ DE L'IMMERSION PATRIOTIQUE OBLIGATOIRE\n\nSESSION ${echapper(onb.annee)}\n\n${echapper(onb.nom)}\n\nDU CENTRE ${echapper(onb.centre)}`)}
    <div class="onb-boutons">
      <button class="onb-bouton verre" id="onb-accueil">ACCUEIL</button>
      ${onbRetour('‹ MODIFIER INFOS', onbEtapeCentre)}
    </div>
  `);
  $('#onb-accueil').addEventListener('click', onbTerminer);
}

function onbEtapeEngagement() {
  rendreEtapeOnb(`
    ${onbCarte("Es-tu prêt à t'engager pour ta patrie ?")}
    <div class="onb-boutons">
      <button class="onb-bouton verre" id="onb-eng-oui">AFFIRMATIF</button>
      <button class="onb-bouton verre" id="onb-eng-non">NÉGATIF</button>
      ${onbRetour('‹ Retour', onbEtapeImmersion)}
    </div>
  `);
  $('#onb-eng-oui').addEventListener('click', () => { vibrer(10); onb.statut = 'camarade'; onbFinCamarade(); });
  $('#onb-eng-non').addEventListener('click', () => {
    // Comme dans l'app Android : une petite secousse, sans faire avancer l'étape.
    vibrer([20, 30, 20]);
    const carte = $('#onb-etape .onb-question');
    carte.classList.remove('onb-secousse'); void carte.offsetWidth; carte.classList.add('onb-secousse');
  });
}

function onbFinCamarade() {
  rendreEtapeOnb(`
    ${onbCarte(`Bienvenue à toi\ncamarade ${echapper(onb.nom)}`)}
    <div class="onb-boutons">
      <button class="onb-bouton verre" id="onb-accueil2">ACCUEIL</button>
      ${onbRetour('‹ Retour', onbEtapeEngagement)}
    </div>
  `);
  $('#onb-accueil2').addEventListener('click', onbTerminer);
}

function onbTerminer() {
  profil = Object.assign({}, profil, { nom: onb.nom, statut: onb.statut, annee: onb.annee, centre: onb.centre });
  sauverProfil();
  document.body.classList.remove('onb-actif');
  afficherEcran('accueil');
}

// Lance l'onboarding (au 1er lancement, ou après une réinitialisation du profil)
function ouvrirOnboarding() {
  onb = { nom: '', statut: '', annee: '', centre: '' };
  document.body.classList.add('onb-actif');
  afficherEcran('onboarding');
  onbEtapeNom();
}

// ===== Démarrage =====
construireAccueil();                                 // construit la grille d'accueil
if (profil.nom) { afficherEcran('accueil'); } else { ouvrirOnboarding(); } // 1er lancement -> onboarding
if ('serviceWorker' in navigator) {                  // si le navigateur sait le faire
  navigator.serviceWorker.register('sw.js');         // active le mode hors connexion
}
