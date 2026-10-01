/* ==========================================================================
   Générateur de CV — Hub Digital CESAG (v2)
   - 100% client, aucune donnée transmise.
   - Sauvegarde locale : localStorage ("cesag.cv.v2").
   - Deux modèles : Classique / Moderne.
   - Rubriques dynamiques (formations, expériences, projets, certifications).
   - Impression A4 propre + export PDF via la boîte de dialogue native.
   ========================================================================== */
(function () {
  'use strict';

  const STORAGE_KEY = 'cesag.cv.v2';
  const MAX_PHOTO_BYTES = 2 * 1024 * 1024; // 2 Mo
  const AUTOSAVE_DELAY = 400;

  const SECTION_LABELS = {
    profil: 'Profil professionnel',
    formations: 'Formations',
    experiences: 'Expériences',
    projets: 'Projets académiques',
    competences: 'Compétences',
    certifications: 'Certifications',
    interets: 'Centres d’intérêt'
  };
  const DEFAULT_ORDER = ['profil', 'formations', 'experiences', 'projets', 'competences', 'certifications', 'interets'];

  const DEFAULT_STATE = () => ({
    template: 'classique',
    color: '#006747',
    showPhoto: true,
    photo: null,
    perso: { prenom: '', nom: '', ville: '', pays: '', telephone: '', email: '', linkedin: '' },
    titre: { formation: '', poste: '' },
    profil: { presentation: '', objectif: '' },
    formations: [],
    experiences: [],
    projets: [],
    competences: { logiciels: '', techniques: '', relationnelles: '', langues: '' },
    certifications: [],
    interets: '',
    order: DEFAULT_ORDER.slice()
  });

  // ----- Templates de lignes dynamiques -----
  const REPEATER_TEMPLATES = {
    formation: {
      labelAdd: 'formation',
      fields: [
        { key: 'diplome', label: 'Diplôme', placeholder: 'ex. Master 2 Finance', required: true },
        { key: 'etablissement', label: 'Établissement', placeholder: 'ex. CESAG', required: true },
        { key: 'ville', label: 'Ville', placeholder: 'ex. Dakar' },
        { key: 'debut', label: 'Année de début', placeholder: 'ex. 2023', inputMode: 'numeric' },
        { key: 'fin', label: 'Année de fin', placeholder: 'ex. 2026', inputMode: 'numeric' },
        { key: 'mention', label: 'Mention / spécialisation (facultatif)', placeholder: 'ex. Mention Bien', full: true }
      ]
    },
    experience: {
      labelAdd: 'expérience',
      fields: [
        { key: 'poste', label: 'Poste', placeholder: 'ex. Stagiaire analyste', required: true },
        { key: 'organisation', label: 'Organisation', placeholder: 'ex. Banque XYZ', required: true },
        { key: 'periode', label: 'Période', placeholder: 'ex. Juin — Août 2026' },
        { key: 'lieu', label: 'Lieu', placeholder: 'ex. Dakar' },
        { key: 'missions', label: 'Missions et résultats', placeholder: 'Une mission par ligne ou séparées par un tiret.', type: 'textarea', full: true }
      ]
    },
    projet: {
      labelAdd: 'projet',
      fields: [
        { key: 'nom', label: 'Nom du projet', placeholder: 'ex. Étude d’impact financier', required: true },
        { key: 'contexte', label: 'Contexte', placeholder: 'ex. Projet académique Master 2' },
        { key: 'outils', label: 'Outils employés', placeholder: 'ex. Excel, Power BI, SQL' },
        { key: 'resultats', label: 'Résultats obtenus', placeholder: 'ex. Note 17/20, publication interne', type: 'textarea', full: true }
      ]
    },
    certification: {
      labelAdd: 'certification',
      fields: [
        { key: 'nom', label: 'Nom', placeholder: 'ex. Excel Specialist', required: true },
        { key: 'organisme', label: 'Organisme', placeholder: 'ex. Microsoft' },
        { key: 'annee', label: 'Année', placeholder: 'ex. 2026', inputMode: 'numeric' },
        { key: 'lien', label: 'Lien (facultatif)', placeholder: 'https://...', type: 'url', full: true }
      ]
    }
  };

  // ----- État -----
  let state = DEFAULT_STATE();
  let autosaveTimer = null;
  let initialized = false;

  // ----- Utilitaires -----
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatMultiline(text) {
    if (!text) return '';
    return escapeHtml(text).replace(/\r?\n/g, '<br>');
  }

  function missionsToList(text) {
    if (!text) return '';
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (!lines.length) return '';
    const items = lines.map(l => l.replace(/^[-•–]\s*/, ''));
    return '<ul>' + items.map(i => `<li>${escapeHtml(i)}</li>`).join('') + '</ul>';
  }

  function genId() {
    return 'cv-' + Math.random().toString(36).slice(2, 10);
  }

  // ----- Persistance localStorage -----
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        state = Object.assign(DEFAULT_STATE(), parsed);
        // garantir intégrité des listes
        ['formations', 'experiences', 'projets', 'certifications'].forEach(k => {
          if (!Array.isArray(state[k])) state[k] = [];
        });
        if (!Array.isArray(state.order) || !state.order.length) state.order = DEFAULT_ORDER.slice();
      }
    } catch (err) {
      console.error('[CV] Lecture localStorage impossible, réinitialisation.', err);
      state = DEFAULT_STATE();
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      const el = $('#cv_autosave_status');
      if (el) {
        el.textContent = 'Enregistré localement ✔';
        clearTimeout(saveState._t);
        saveState._t = setTimeout(() => {
          if (el) el.textContent = 'Sauvegarde locale active';
        }, 1600);
      }
    } catch (err) {
      console.error('[CV] Écriture localStorage impossible.', err);
    }
  }

  function scheduleSave() {
    clearTimeout(autosaveTimer);
    autosaveTimer = setTimeout(saveState, AUTOSAVE_DELAY);
  }

  // ----- Rendu formulaire -----
  function fillStaticFields() {
    const map = {
      cv_prenom: state.perso.prenom,
      cv_nom: state.perso.nom,
      cv_ville: state.perso.ville,
      cv_pays: state.perso.pays,
      cv_telephone: state.perso.telephone,
      cv_email: state.perso.email,
      cv_linkedin: state.perso.linkedin,
      cv_formation_titre: state.titre.formation,
      cv_poste_recherche: state.titre.poste,
      cv_profil: state.profil.presentation,
      cv_objectif: state.profil.objectif,
      cv_logiciels: state.competences.logiciels,
      cv_techniques: state.competences.techniques,
      cv_relationnelles: state.competences.relationnelles,
      cv_langues: state.competences.langues,
      cv_interets: state.interets
    };
    Object.entries(map).forEach(([id, val]) => {
      const el = document.getElementById(id);
      if (el) el.value = val || '';
    });

    const tpl = document.querySelector(`input[name="cv_template"][value="${state.template}"]`);
    if (tpl) tpl.checked = true;
    const col = document.querySelector(`input[name="cv_color"][value="${state.color}"]`);
    if (col) col.checked = true;
    const photoChk = $('#cv_show_photo');
    if (photoChk) photoChk.checked = !!state.showPhoto;

    renderPhoto();
  }

  function renderPhoto() {
    const wrap = $('#cv_photo_preview');
    const img = $('#cv_photo_img');
    if (!wrap || !img) return;
    if (state.photo) {
      img.src = state.photo;
      wrap.hidden = false;
    } else {
      img.removeAttribute('src');
      wrap.hidden = true;
    }
  }

  function renderRepeater(type) {
    const def = REPEATER_TEMPLATES[type];
    if (!def) return;
    const listKey = type === 'formation' ? 'formations'
                 : type === 'experience' ? 'experiences'
                 : type === 'projet' ? 'projets'
                 : 'certifications';
    const container = document.querySelector(`[data-cv-list="${type}"]`);
    if (!container) return;

    const items = state[listKey];
    if (!items.length) {
      container.innerHTML = `<p class="cv-empty">Aucune ${def.labelAdd} ajoutée. Cliquez sur « Ajouter » pour en créer une.</p>`;
      return;
    }

    container.innerHTML = items.map((item, index) => renderRepeaterItem(type, def, item, index, items.length)).join('');
  }

  function renderRepeaterItem(type, def, item, index, total) {
    const header = index + 1;
    const fields = def.fields.map(f => {
      const inputId = `cv_${type}_${f.key}_${item._id}`;
      const value = escapeHtml(item[f.key] || '');
      const required = f.required ? 'required aria-required="true"' : '';
      const inputMode = f.inputMode ? `inputmode="${f.inputMode}"` : '';
      const errorId = `err_${inputId}`;
      const errorNode = `<p class="cv-error" id="${errorId}" aria-live="polite"></p>`;
      const fullClass = f.full ? ' cv-field--full' : '';

      let control;
      if (f.type === 'textarea') {
        control = `<textarea id="${inputId}" class="form-control" rows="3" placeholder="${escapeHtml(f.placeholder || '')}" data-cv-type="${type}" data-cv-id="${item._id}" data-cv-key="${f.key}" ${required} aria-describedby="${errorId}">${value}</textarea>`;
      } else {
        const inputType = f.type || 'text';
        control = `<input type="${inputType}" id="${inputId}" class="form-control" placeholder="${escapeHtml(f.placeholder || '')}" value="${value}" data-cv-type="${type}" data-cv-id="${item._id}" data-cv-key="${f.key}" ${required} ${inputMode} aria-describedby="${errorId}">`;
      }

      return `
        <div class="cv-field${fullClass}">
          <label class="form-label" for="${inputId}">${escapeHtml(f.label)}${f.required ? ' <span class="cv-required" aria-hidden="true">*</span>' : ''}</label>
          ${control}
          ${errorNode}
        </div>`;
    }).join('');

    return `
      <article class="cv-repeater-item" data-cv-item="${item._id}" data-cv-type="${type}" aria-label="${def.labelAdd} ${header}">
        <header class="cv-repeater-head">
          <h5>${escapeHtml(def.labelAdd.charAt(0).toUpperCase() + def.labelAdd.slice(1))} ${header}</h5>
          <div class="cv-repeater-controls">
            <button type="button" class="cv-icon-btn" data-cv-move="up" data-cv-type="${type}" data-cv-id="${item._id}" aria-label="Déplacer vers le haut" ${index === 0 ? 'disabled' : ''}><i class="fas fa-arrow-up" aria-hidden="true"></i></button>
            <button type="button" class="cv-icon-btn" data-cv-move="down" data-cv-type="${type}" data-cv-id="${item._id}" aria-label="Déplacer vers le bas" ${index === total - 1 ? 'disabled' : ''}><i class="fas fa-arrow-down" aria-hidden="true"></i></button>
            <button type="button" class="cv-icon-btn cv-icon-btn--danger" data-cv-remove="${item._id}" data-cv-type="${type}" aria-label="Supprimer cette ${def.labelAdd}"><i class="fas fa-times" aria-hidden="true"></i></button>
          </div>
        </header>
        <div class="cv-grid-2">${fields}</div>
      </article>`;
  }

  function renderAllRepeaters() {
    Object.keys(REPEATER_TEMPLATES).forEach(renderRepeater);
  }

  function renderOrderList() {
    const list = $('#cv_order_list');
    if (!list) return;
    list.innerHTML = state.order.map((key, index) => `
      <li class="cv-order-item">
        <span class="cv-order-handle" aria-hidden="true"><i class="fas fa-grip-vertical"></i></span>
        <span class="cv-order-label">${escapeHtml(SECTION_LABELS[key] || key)}</span>
        <span class="cv-order-controls">
          <button type="button" class="cv-icon-btn" data-cv-order-move="up" data-cv-order-key="${key}" aria-label="Monter la rubrique ${escapeHtml(SECTION_LABELS[key] || key)}" ${index === 0 ? 'disabled' : ''}><i class="fas fa-arrow-up" aria-hidden="true"></i></button>
          <button type="button" class="cv-icon-btn" data-cv-order-move="down" data-cv-order-key="${key}" aria-label="Descendre la rubrique ${escapeHtml(SECTION_LABELS[key] || key)}" ${index === state.order.length - 1 ? 'disabled' : ''}><i class="fas fa-arrow-down" aria-hidden="true"></i></button>
        </span>
      </li>`).join('');
  }

  // ----- Rendu Aperçu -----
  function buildHeaderBlock() {
    const nomComplet = `${state.perso.prenom || ''} ${state.perso.nom || ''}`.trim() || 'Prénom NOM';
    const localisation = [state.perso.ville, state.perso.pays].filter(Boolean).join(', ');
    const titre = [state.titre.formation, state.titre.poste].filter(Boolean).join(' — ');
    const contactParts = [];
    if (state.perso.telephone) contactParts.push(`<span><i class="fas fa-phone" aria-hidden="true"></i> ${escapeHtml(state.perso.telephone)}</span>`);
    if (state.perso.email) contactParts.push(`<span><i class="fas fa-envelope" aria-hidden="true"></i> ${escapeHtml(state.perso.email)}</span>`);
    if (state.perso.linkedin) contactParts.push(`<span><i class="fab fa-linkedin" aria-hidden="true"></i> ${escapeHtml(state.perso.linkedin)}</span>`);
    if (localisation) contactParts.push(`<span><i class="fas fa-map-marker-alt" aria-hidden="true"></i> ${escapeHtml(localisation)}</span>`);

    const photoHtml = state.showPhoto && state.photo
      ? `<img class="cv-pv-photo" src="${state.photo}" alt="">`
      : '';

    return `
      <header class="cv-pv-header">
        ${photoHtml}
        <div class="cv-pv-identity">
          <h1 class="cv-pv-name">${escapeHtml(nomComplet)}</h1>
          ${titre ? `<p class="cv-pv-title">${escapeHtml(titre)}</p>` : ''}
          ${contactParts.length ? `<div class="cv-pv-contacts">${contactParts.join('')}</div>` : ''}
        </div>
      </header>`;
  }

  function sectionTitle(label) {
    return `<h2 class="cv-pv-section-title">${escapeHtml(label)}</h2>`;
  }

  function buildSectionProfil() {
    const p = state.profil.presentation;
    const o = state.profil.objectif;
    if (!p && !o) return '';
    let body = '';
    if (p) body += `<p>${formatMultiline(p)}</p>`;
    if (o) body += `<p class="cv-pv-objectif"><strong>Objectif :</strong> ${escapeHtml(o)}</p>`;
    return `<section class="cv-pv-section">${sectionTitle(SECTION_LABELS.profil)}${body}</section>`;
  }

  function buildSectionFormations() {
    if (!state.formations.length) return '';
    const items = state.formations.map(f => {
      const period = [f.debut, f.fin].filter(Boolean).join(' — ');
      const line1 = [f.diplome].filter(Boolean).join('');
      const line2Parts = [f.etablissement, f.ville].filter(Boolean).join(', ');
      return `
        <div class="cv-pv-entry">
          <div class="cv-pv-entry-head">
            <strong>${escapeHtml(line1)}</strong>
            ${period ? `<span class="cv-pv-period">${escapeHtml(period)}</span>` : ''}
          </div>
          ${line2Parts ? `<div class="cv-pv-entry-sub">${escapeHtml(line2Parts)}</div>` : ''}
          ${f.mention ? `<div class="cv-pv-entry-detail">${escapeHtml(f.mention)}</div>` : ''}
        </div>`;
    }).join('');
    return `<section class="cv-pv-section">${sectionTitle(SECTION_LABELS.formations)}${items}</section>`;
  }

  function buildSectionExperiences() {
    if (!state.experiences.length) return '';
    const items = state.experiences.map(e => {
      const subParts = [e.organisation, e.lieu].filter(Boolean).join(', ');
      return `
        <div class="cv-pv-entry">
          <div class="cv-pv-entry-head">
            <strong>${escapeHtml(e.poste || '')}</strong>
            ${e.periode ? `<span class="cv-pv-period">${escapeHtml(e.periode)}</span>` : ''}
          </div>
          ${subParts ? `<div class="cv-pv-entry-sub">${escapeHtml(subParts)}</div>` : ''}
          ${missionsToList(e.missions)}
        </div>`;
    }).join('');
    return `<section class="cv-pv-section">${sectionTitle(SECTION_LABELS.experiences)}${items}</section>`;
  }

  function buildSectionProjets() {
    if (!state.projets.length) return '';
    const items = state.projets.map(p => {
      return `
        <div class="cv-pv-entry">
          <div class="cv-pv-entry-head"><strong>${escapeHtml(p.nom || '')}</strong></div>
          ${p.contexte ? `<div class="cv-pv-entry-sub">${escapeHtml(p.contexte)}</div>` : ''}
          ${p.outils ? `<div class="cv-pv-entry-detail"><em>Outils :</em> ${escapeHtml(p.outils)}</div>` : ''}
          ${p.resultats ? `<div class="cv-pv-entry-detail">${formatMultiline(p.resultats)}</div>` : ''}
        </div>`;
    }).join('');
    return `<section class="cv-pv-section">${sectionTitle(SECTION_LABELS.projets)}${items}</section>`;
  }

  function buildSectionCompetences() {
    const c = state.competences;
    const rows = [
      ['Logiciels', c.logiciels],
      ['Compétences techniques', c.techniques],
      ['Compétences relationnelles', c.relationnelles],
      ['Langues', c.langues]
    ].filter(([, v]) => v && v.trim());
    if (!rows.length) return '';
    const body = rows.map(([k, v]) => `<div class="cv-pv-skill-row"><strong>${escapeHtml(k)} :</strong> <span>${formatMultiline(v)}</span></div>`).join('');
    return `<section class="cv-pv-section">${sectionTitle(SECTION_LABELS.competences)}${body}</section>`;
  }

  function buildSectionCertifications() {
    if (!state.certifications.length) return '';
    const items = state.certifications.map(c => {
      const main = [c.nom, c.organisme].filter(Boolean).join(' — ');
      return `
        <div class="cv-pv-entry">
          <div class="cv-pv-entry-head">
            <strong>${escapeHtml(main)}</strong>
            ${c.annee ? `<span class="cv-pv-period">${escapeHtml(c.annee)}</span>` : ''}
          </div>
          ${c.lien ? `<div class="cv-pv-entry-detail"><a href="${escapeHtml(c.lien)}" rel="noopener">${escapeHtml(c.lien)}</a></div>` : ''}
        </div>`;
    }).join('');
    return `<section class="cv-pv-section">${sectionTitle(SECTION_LABELS.certifications)}${items}</section>`;
  }

  function buildSectionInterets() {
    if (!state.interets || !state.interets.trim()) return '';
    return `<section class="cv-pv-section">${sectionTitle(SECTION_LABELS.interets)}<p>${escapeHtml(state.interets)}</p></section>`;
  }

  const SECTION_BUILDERS = {
    profil: buildSectionProfil,
    formations: buildSectionFormations,
    experiences: buildSectionExperiences,
    projets: buildSectionProjets,
    competences: buildSectionCompetences,
    certifications: buildSectionCertifications,
    interets: buildSectionInterets
  };

  function renderPreview() {
    const target = $('#cvPreview');
    if (!target) return;
    const sections = state.order.map(k => (SECTION_BUILDERS[k] || (() => ''))()).join('');
    target.className = 'cv-preview cv-tpl-' + (state.template === 'moderne' ? 'moderne' : 'classique');
    target.style.setProperty('--cv-accent', state.color);
    target.innerHTML = `${buildHeaderBlock()}<div class="cv-pv-body">${sections}</div>`;
  }

  function renderAll() {
    renderAllRepeaters();
    renderOrderList();
    renderPreview();
  }

  // ----- Validation -----
  function setError(id, msg) {
    const err = document.getElementById('err_' + id);
    const input = document.getElementById(id);
    if (err) err.textContent = msg || '';
    if (input) {
      if (msg) input.setAttribute('aria-invalid', 'true');
      else input.removeAttribute('aria-invalid');
    }
  }

  function validateRequired() {
    let ok = true;
    const required = [
      ['cv_prenom', state.perso.prenom, 'Le prénom est obligatoire.'],
      ['cv_nom', state.perso.nom, 'Le nom est obligatoire.'],
      ['cv_email', state.perso.email, 'L’adresse email est obligatoire.']
    ];
    required.forEach(([id, val, msg]) => {
      if (!val || !val.trim()) { setError(id, msg); ok = false; }
      else setError(id, '');
    });
    if (state.perso.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.perso.email.trim())) {
      setError('cv_email', 'Format d’email invalide (ex. prenom.nom@domaine.com).');
      ok = false;
    }
    return ok;
  }

  // ----- Event wiring -----
  function onPersoChange(e) {
    const t = e.target;
    if (!t) return;

    // Radios sans id : template & couleur
    if (t.name === 'cv_template') {
      state.template = t.value;
      renderPreview();
      scheduleSave();
      return;
    }
    if (t.name === 'cv_color') {
      state.color = t.value;
      renderPreview();
      scheduleSave();
      return;
    }

    // Repeaters (data-attrs, pas besoin d'id)
    const type = t.getAttribute && t.getAttribute('data-cv-type');
    const dataId = t.getAttribute && t.getAttribute('data-cv-id');
    const key = t.getAttribute && t.getAttribute('data-cv-key');
    if (type && dataId && key) {
      const listKey = type === 'formation' ? 'formations' : type === 'experience' ? 'experiences' : type === 'projet' ? 'projets' : 'certifications';
      const item = state[listKey].find(x => x._id === dataId);
      if (item) {
        item[key] = t.value;
        renderPreview();
        scheduleSave();
      }
      return;
    }

    if (!t.id || !t.id.startsWith('cv_')) return;

    const mapping = {
      cv_prenom: ['perso', 'prenom'],
      cv_nom: ['perso', 'nom'],
      cv_ville: ['perso', 'ville'],
      cv_pays: ['perso', 'pays'],
      cv_telephone: ['perso', 'telephone'],
      cv_email: ['perso', 'email'],
      cv_linkedin: ['perso', 'linkedin'],
      cv_formation_titre: ['titre', 'formation'],
      cv_poste_recherche: ['titre', 'poste'],
      cv_profil: ['profil', 'presentation'],
      cv_objectif: ['profil', 'objectif'],
      cv_logiciels: ['competences', 'logiciels'],
      cv_techniques: ['competences', 'techniques'],
      cv_relationnelles: ['competences', 'relationnelles'],
      cv_langues: ['competences', 'langues']
    };

    if (mapping[t.id]) {
      const [group, key] = mapping[t.id];
      state[group][key] = t.value;
      // Effacer l'erreur dès que le champ requis est corrigé
      if (['cv_prenom', 'cv_nom', 'cv_email'].includes(t.id) && t.value && t.value.trim()) {
        setError(t.id, '');
      }
      renderPreview();
      scheduleSave();
      return;
    }

    if (t.id === 'cv_interets') {
      state.interets = t.value;
      renderPreview();
      scheduleSave();
      return;
    }

    if (t.id === 'cv_show_photo') {
      state.showPhoto = t.checked;
      renderPreview();
      scheduleSave();
      return;
    }
  }

  function addRepeaterItem(type) {
    const def = REPEATER_TEMPLATES[type];
    if (!def) return;
    const listKey = type === 'formation' ? 'formations' : type === 'experience' ? 'experiences' : type === 'projet' ? 'projets' : 'certifications';
    const item = { _id: genId() };
    def.fields.forEach(f => { item[f.key] = ''; });
    state[listKey].push(item);
    renderRepeater(type);
    renderPreview();
    saveState();
    // focus sur le premier champ ajouté
    const first = document.querySelector(`[data-cv-item="${item._id}"] input, [data-cv-item="${item._id}"] textarea`);
    if (first) first.focus();
  }

  function removeRepeaterItem(type, itemId) {
    const listKey = type === 'formation' ? 'formations' : type === 'experience' ? 'experiences' : type === 'projet' ? 'projets' : 'certifications';
    state[listKey] = state[listKey].filter(x => x._id !== itemId);
    renderRepeater(type);
    renderPreview();
    saveState();
  }

  function moveRepeaterItem(type, itemId, direction) {
    const listKey = type === 'formation' ? 'formations' : type === 'experience' ? 'experiences' : type === 'projet' ? 'projets' : 'certifications';
    const arr = state[listKey];
    const idx = arr.findIndex(x => x._id === itemId);
    if (idx < 0) return;
    const target = direction === 'up' ? idx - 1 : idx + 1;
    if (target < 0 || target >= arr.length) return;
    const tmp = arr[idx]; arr[idx] = arr[target]; arr[target] = tmp;
    renderRepeater(type);
    renderPreview();
    saveState();
  }

  function moveOrder(key, direction) {
    const idx = state.order.indexOf(key);
    if (idx < 0) return;
    const target = direction === 'up' ? idx - 1 : idx + 1;
    if (target < 0 || target >= state.order.length) return;
    const tmp = state.order[idx]; state.order[idx] = state.order[target]; state.order[target] = tmp;
    renderOrderList();
    renderPreview();
    saveState();
  }

  function handlePhotoInput(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!/^image\/(png|jpeg|webp)$/i.test(file.type)) {
      alert('Format de photo non pris en charge. Utilisez JPG, PNG ou WebP.');
      e.target.value = '';
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      alert('Photo trop lourde (max. 2 Mo). Compressez-la avant de la charger.');
      e.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      state.photo = String(reader.result || '');
      renderPhoto();
      renderPreview();
      saveState();
    };
    reader.readAsDataURL(file);
  }

  function removePhoto() {
    state.photo = null;
    const input = $('#cv_photo_input');
    if (input) input.value = '';
    renderPhoto();
    renderPreview();
    saveState();
  }

  function resetAll() {
    if (!confirm('Effacer définitivement toutes les données du CV sur cet appareil ? Cette action est irréversible.')) return;
    try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
    state = DEFAULT_STATE();
    fillStaticFields();
    renderAll();
    const emailErr = $('#err_cv_email'); if (emailErr) emailErr.textContent = '';
  }

  function printCV() {
    if (!validateRequired()) {
      const firstErr = document.querySelector('[aria-invalid="true"]');
      if (firstErr) firstErr.focus();
      alert('Merci de compléter les champs obligatoires (prénom, nom, email) avant d’imprimer.');
      return;
    }
    openPrintWindow();
  }

  function openPrintWindow() {
    const preview = $('#cvPreview');
    if (!preview) return;
    const html = preview.outerHTML;
    const accent = state.color;
    const win = window.open('', '_blank', 'width=900,height=1100');
    if (!win) { alert('Veuillez autoriser l’ouverture des fenêtres pour imprimer.'); return; }
    const css = buildPrintCSS(accent);
    win.document.open();
    win.document.write(`<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>CV — ${escapeHtml((state.perso.prenom + ' ' + state.perso.nom).trim() || 'export')}</title>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
      <style>${css}</style></head><body>${html}
      <script>window.addEventListener('load',function(){setTimeout(function(){window.focus();window.print();},200);});<\/script>
      </body></html>`);
    win.document.close();
  }

  function buildPrintCSS(accent) {
    return `
      @page { size: A4; margin: 14mm 14mm 16mm; }
      * { box-sizing: border-box; }
      html, body { margin: 0; padding: 0; background: #fff; color: #111827; font-family: 'Inter', -apple-system, Segoe UI, Roboto, sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      body { font-size: 10.5pt; line-height: 1.4; }
      .cv-preview { --cv-accent: ${accent}; max-width: 100%; margin: 0; padding: 0; }
      .cv-pv-header { display: flex; gap: 16px; align-items: center; border-bottom: 2px solid var(--cv-accent); padding-bottom: 10px; margin-bottom: 14px; }
      .cv-pv-photo { width: 78px; height: 78px; object-fit: cover; border-radius: 50%; border: 2px solid var(--cv-accent); }
      .cv-pv-name { font-size: 20pt; margin: 0 0 2px; color: var(--cv-accent); font-family: 'Plus Jakarta Sans', 'Inter', sans-serif; font-weight: 800; letter-spacing: 0.3px; }
      .cv-pv-title { margin: 0 0 6px; font-weight: 600; color: #374151; font-size: 11pt; }
      .cv-pv-contacts { display: flex; flex-wrap: wrap; gap: 10px 18px; font-size: 9.5pt; color: #4b5563; }
      .cv-pv-contacts i { color: var(--cv-accent); margin-right: 4px; }
      .cv-pv-section { margin-bottom: 10px; break-inside: avoid; }
      .cv-pv-section-title { font-size: 11pt; text-transform: uppercase; letter-spacing: 1px; color: var(--cv-accent); border-bottom: 1px solid #e5e7eb; padding-bottom: 3px; margin: 10px 0 6px; font-family: 'Plus Jakarta Sans','Inter',sans-serif; }
      .cv-pv-entry { margin-bottom: 7px; break-inside: avoid; }
      .cv-pv-entry-head { display: flex; justify-content: space-between; gap: 8px; align-items: baseline; }
      .cv-pv-entry-head strong { font-size: 10.5pt; }
      .cv-pv-period { color: #6b7280; font-size: 9.5pt; white-space: nowrap; }
      .cv-pv-entry-sub { color: #4b5563; font-style: italic; font-size: 10pt; }
      .cv-pv-entry-detail { font-size: 10pt; }
      .cv-pv-entry ul { margin: 3px 0 0 16px; padding: 0; }
      .cv-pv-entry li { margin-bottom: 2px; }
      .cv-pv-skill-row { font-size: 10pt; margin-bottom: 3px; }
      .cv-pv-objectif { background: #f9fafb; padding: 6px 8px; border-left: 3px solid var(--cv-accent); margin-top: 6px; }

      /* Variante Moderne */
      .cv-tpl-moderne .cv-pv-header { border-bottom: none; background: var(--cv-accent); color: #fff; padding: 14px 16px; margin: -4px -4px 14px; border-radius: 6px; }
      .cv-tpl-moderne .cv-pv-name { color: #fff; }
      .cv-tpl-moderne .cv-pv-title { color: rgba(255,255,255,0.9); }
      .cv-tpl-moderne .cv-pv-contacts { color: rgba(255,255,255,0.9); }
      .cv-tpl-moderne .cv-pv-contacts i { color: #fff; }
      .cv-tpl-moderne .cv-pv-section-title { background: #f3f4f6; padding: 3px 8px; border-radius: 3px; border-bottom: none; }
      .cv-tpl-moderne .cv-pv-photo { border-color: #fff; }
    `;
  }

  function bind() {
    const modal = $('#cvModal');
    if (!modal) return;

    // Saisie formulaire
    modal.addEventListener('input', onPersoChange);
    modal.addEventListener('change', onPersoChange);

    // Boutons repeaters
    modal.addEventListener('click', (ev) => {
      const addBtn = ev.target.closest('[data-cv-add]');
      if (addBtn) { addRepeaterItem(addBtn.getAttribute('data-cv-add')); return; }

      const removeBtn = ev.target.closest('[data-cv-remove]');
      if (removeBtn) {
        const type = removeBtn.getAttribute('data-cv-type');
        const id = removeBtn.getAttribute('data-cv-remove');
        if (confirm('Supprimer cet élément ?')) removeRepeaterItem(type, id);
        return;
      }

      const moveBtn = ev.target.closest('[data-cv-move]');
      if (moveBtn) {
        moveRepeaterItem(moveBtn.getAttribute('data-cv-type'), moveBtn.getAttribute('data-cv-id'), moveBtn.getAttribute('data-cv-move'));
        return;
      }

      const orderBtn = ev.target.closest('[data-cv-order-move]');
      if (orderBtn) {
        moveOrder(orderBtn.getAttribute('data-cv-order-key'), orderBtn.getAttribute('data-cv-order-move'));
        return;
      }
    });

    const photoInput = $('#cv_photo_input');
    if (photoInput) photoInput.addEventListener('change', handlePhotoInput);

    const photoRemove = $('#cv_photo_remove');
    if (photoRemove) photoRemove.addEventListener('click', removePhoto);

    const resetBtn = $('#cv_btn_reset');
    if (resetBtn) resetBtn.addEventListener('click', resetAll);

    const printBtn = $('#cv_btn_print');
    if (printBtn) printBtn.addEventListener('click', printCV);
  }

  function ensureSeedData() {
    // Si le CV n'a jamais été utilisé, ajouter des entrées vides pour amorcer l'UI.
    if (!state.formations.length) addRepeaterItemSilent('formation');
    if (!state.experiences.length) addRepeaterItemSilent('experience');
    if (!state.projets.length) addRepeaterItemSilent('projet');
    if (!state.certifications.length) addRepeaterItemSilent('certification');
  }

  function addRepeaterItemSilent(type) {
    const def = REPEATER_TEMPLATES[type];
    if (!def) return;
    const listKey = type === 'formation' ? 'formations' : type === 'experience' ? 'experiences' : type === 'projet' ? 'projets' : 'certifications';
    const item = { _id: genId() };
    def.fields.forEach(f => { item[f.key] = ''; });
    state[listKey].push(item);
  }

  function init() {
    if (initialized) return;
    initialized = true;
    loadState();
    ensureSeedData();
    fillStaticFields();
    renderAll();
    bind();
  }

  // Expose un hook public pour le bouton « Créer mon CV »
  const _origOpenCV = typeof window.openCVModal === 'function' ? window.openCVModal : null;
  window.openCVModal = function () {
    init();
    if (typeof window.openModal === 'function') window.openModal('cvModal');
    else if (_origOpenCV) _origOpenCV();
  };

  // Les anciens handlers globaux ne doivent plus bloquer le formulaire
  window.generateCVPreview = function () { init(); renderPreview(); };
  window.exportCVtoPDF = function () { init(); printCV(); };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
