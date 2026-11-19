/**
 * Hub Digital CESAG - Application Core Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

const App = {
  activeCategory: 'all',
  theme: 'light',

  init() {
    this.initTheme();
    this.renderAnnouncements();
    this.renderCategoryPills();
    this.renderServices('all');
    this.renderOnboarding();
    this.renderTroubleshooting();
    this.renderTutorials();
    this.renderEmailTemplatesGrid();
    this.renderCyberChecklist();
    this.initPasswordTools();
    this.initConverter();
    this.initCampusLive();
    this.initPanafricanClocks();
    this.initQrCode();
    this.initBackToTop();
    this.initMobileMenu();
    this.initScrollSpy();

    if (window.FavoritesManager) {
      window.FavoritesManager.init();
    }
    if (window.SearchEngine) {
      window.SearchEngine.init();
    }

    this.registerServiceWorker();
  },

  /* ==========================================================================
     Thème (Clair / Sombre)
     ========================================================================== */
  initTheme() {
    const savedTheme = localStorage.getItem('cesag_hub_theme');
    if (savedTheme) {
      this.theme = savedTheme;
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.theme = 'dark';
    } else {
      this.theme = 'light';
    }
    this.applyTheme(this.theme);

    const toggleBtn = document.getElementById('themeToggleBtn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('cesag_hub_theme', this.theme);
        this.applyTheme(this.theme);
        showToast(this.theme === 'dark' ? '🌙 Mode sombre activé' : '☀️ Mode clair activé');
      });
    }
  },

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const toggleBtn = document.getElementById('themeToggleBtn');
    if (toggleBtn) {
      toggleBtn.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
      toggleBtn.setAttribute('aria-label', theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre');
    }
  },

  /* ==========================================================================
     Bandeau d'Annonces
     ========================================================================== */
  renderAnnouncements() {
    const banner = document.getElementById('announcementBar');
    if (!banner || !window.CESAG_DATA || !window.CESAG_DATA.announcements.length) return;

    const ann = window.CESAG_DATA.announcements[0];
    const isDismissed = localStorage.getItem(`cesag_ann_dismissed_${ann.id}`);
    if (isDismissed) {
      banner.style.display = 'none';
      return;
    }

    banner.innerHTML = `
      <div class="announcement-container">
        <span class="announcement-badge">${ann.badge}</span>
        <span class="announcement-msg">${ann.message}</span>
        ${ann.ctaTarget ? `<a href="${ann.ctaTarget}" class="announcement-link">${ann.ctaText} <i class="fas fa-arrow-right"></i></a>` : ''}
        ${ann.ctaLink ? `<a href="${ann.ctaLink}" target="_blank" rel="noopener noreferrer" class="announcement-link">${ann.ctaText} <i class="fas fa-arrow-right"></i></a>` : ''}
        <button class="announcement-close" onclick="App.dismissAnnouncement('${ann.id}')" aria-label="Fermer l'alerte">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;
    banner.style.display = 'block';
  },

  dismissAnnouncement(id) {
    const banner = document.getElementById('announcementBar');
    if (banner) banner.style.display = 'none';
    localStorage.setItem(`cesag_ann_dismissed_${id}`, 'true');
  },

  /* ==========================================================================
     Filtres & Services
     ========================================================================== */
  renderCategoryPills() {
    const container = document.getElementById('categoryPills');
    if (!container || !window.CESAG_DATA) return;

    container.innerHTML = window.CESAG_DATA.categories.map(cat => `
      <button class="category-pill ${cat.id === this.activeCategory ? 'active' : ''}" onclick="App.setCategory('${cat.id}')">
        <i class="fas ${cat.icon}"></i>
        <span>${cat.label}</span>
      </button>
    `).join('');
  },

  setCategory(categoryId) {
    this.activeCategory = categoryId;
    this.renderCategoryPills();
    this.renderServices(categoryId);
  },

  renderServices(categoryId = 'all') {
    const grid = document.getElementById('servicesGrid');
    if (!grid || !window.CESAG_DATA) return;

    let filtered = window.CESAG_DATA.services;
    if (categoryId !== 'all') {
      filtered = filtered.filter(s => s.category === categoryId);
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-muted);">
          <i class="fas fa-info-circle" style="font-size: 2rem; color: var(--cesag-green-600); margin-bottom: 0.5rem;"></i>
          <p>Aucun service dans cette catégorie pour le moment.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(service => {
      const isFav = window.FavoritesManager ? window.FavoritesManager.isFavorite(service.id) : false;
      const primaryAction = service.actions && service.actions.find(a => a.isPrimary);
      const secondaryAction = service.actions && service.actions.find(a => !a.isPrimary);

      return `
        <article class="service-card" data-service-id="${service.id}">
          <div class="service-card-header">
            <div class="service-icon-wrapper" style="color: ${service.iconColor || 'var(--cesag-green-600)'}">
              <i class="${service.icon}"></i>
            </div>
            <div class="service-actions-top">
              <span class="badge ${service.tagClass || 'tag-essential'}">${service.tag}</span>
              <button class="btn-pin-favorite ${isFav ? 'is-pinned' : ''}" data-service-id="${service.id}" onclick="FavoritesManager.toggleFavorite('${service.id}')" title="Épingler dans mes raccourcis" aria-label="Épingler">
                <i class="${isFav ? 'fas' : 'far'} fa-star"></i>
              </button>
            </div>
          </div>
          <div class="service-card-body">
            <h3 class="service-card-title">${service.name}</h3>
            <p class="service-card-desc">${service.shortDesc}</p>
          </div>
          <div class="service-card-footer">
            ${primaryAction ? `
              <a href="${primaryAction.url}" ${primaryAction.url && primaryAction.url.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : ''} class="btn btn-primary btn-sm btn-block">
                ${primaryAction.label} <i class="fas fa-arrow-right" style="font-size: 0.75rem;"></i>
              </a>
            ` : ''}
            ${secondaryAction ? `
              <button onclick="${secondaryAction.action}" class="btn btn-outline btn-sm" title="${secondaryAction.label}">
                <i class="fas fa-question-circle"></i>
              </button>
            ` : ''}
          </div>
        </article>
      `;
    }).join('');
  },

  /* ==========================================================================
     Parcours "Nouveau au CESAG ? Commencez ici"
     ========================================================================== */
  renderOnboarding() {
    const container = document.getElementById('onboardingStepper');
    if (!container || !window.CESAG_DATA) return;

    container.innerHTML = window.CESAG_DATA.onboardingSteps.map(step => `
      <div class="onboarding-card">
        <div class="step-indicator">
          <div class="step-number">${step.step}</div>
        </div>
        <div class="onboarding-content">
          <div class="onboarding-top">
            <h3 class="onboarding-step-title">${step.title}</h3>
            <span class="badge tag-essential">${step.badge}</span>
          </div>
          <p class="onboarding-details">${step.details}</p>
          <ul class="onboarding-checklist">
            ${step.checklist.map(item => `
              <li><i class="fas fa-check-circle"></i> <span>${item}</span></li>
            `).join('')}
          </ul>
          <div>
            <a href="${step.action.url}" ${step.action.url.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : ''} class="btn btn-primary btn-sm">
              ${step.action.label} <i class="fas fa-external-link-alt" style="font-size: 0.75rem;"></i>
            </a>
          </div>
        </div>
      </div>
    `).join('');
  },

  /* ==========================================================================
     Dépannage & Support ("J'ai un problème")
     ========================================================================== */
  renderTroubleshooting() {
    const container = document.getElementById('troubleshootingGrid');
    if (!container || !window.CESAG_DATA) return;

    container.innerHTML = window.CESAG_DATA.troubleshooting.map(item => `
      <div class="trouble-card trouble-${item.severity || 'info'}">
        <div class="trouble-header">
          <i class="${item.icon}"></i>
          <h3 class="trouble-title">${item.title}</h3>
        </div>
        <p style="font-size: 0.875rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.75rem;">${item.summary}</p>
        <ul class="trouble-steps">
          ${item.steps.map(step => `<li>${step}</li>`).join('')}
        </ul>
        <div>
          ${item.ctaUrl ? `
            <a href="${item.ctaUrl}" ${item.ctaUrl.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : ''} class="btn btn-secondary btn-sm btn-block">
              ${item.ctaText} <i class="fas fa-arrow-right" style="font-size: 0.75rem;"></i>
            </a>
          ` : ''}
          ${item.ctaAction ? `
            <button onclick="${item.ctaAction}" class="btn btn-secondary btn-sm btn-block">
              ${item.ctaText} <i class="fas fa-envelope" style="font-size: 0.75rem;"></i>
            </button>
          ` : ''}
        </div>
      </div>
    `).join('');
  },

  /* ==========================================================================
     Tutoriels & Guides
     ========================================================================== */
  renderTutorials() {
    const container = document.getElementById('tutorialsGrid');
    if (!container || !window.CESAG_DATA) return;

    container.innerHTML = window.CESAG_DATA.tutorials.map(tuto => `
      <div class="tuto-card">
        <div class="tuto-meta">
          <span class="badge tag-essential">${tuto.tool}</span>
          <span class="tuto-pill"><i class="fas fa-clock"></i> ${tuto.duration}</span>
          <span class="tuto-pill"><i class="fas fa-layer-group"></i> ${tuto.level}</span>
        </div>
        <h3 class="tuto-title">${tuto.title}</h3>
        <p class="tuto-summary">${tuto.summary}</p>
        <div>
          <button onclick="openTutorial('${tuto.id}')" class="btn btn-outline btn-sm btn-block">
            Consulter le guide <i class="fas fa-book-open" style="font-size: 0.75rem;"></i>
          </button>
        </div>
      </div>
    `).join('');
  },

  /* ==========================================================================
     Modèles d'Emails
     ========================================================================== */
  renderEmailTemplatesGrid() {
    const container = document.getElementById('emailTemplatesGrid');
    if (!container || !window.CESAG_DATA) return;

    const templates = Object.values(window.CESAG_DATA.emailTemplates);
    container.innerHTML = templates.map(tpl => `
      <div class="trouble-card" style="border-left-color: var(--cesag-gold-500); cursor: pointer;" onclick="openEmailModal('${tpl.id}')">
        <div class="trouble-header">
          <i class="${tpl.icon}" style="color: var(--cesag-gold-600);"></i>
          <h3 class="trouble-title">${tpl.title}</h3>
        </div>
        <span class="badge tag-mandatory" style="align-self: flex-start; margin-bottom: 0.75rem;">${tpl.badge}</span>
        <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 1.25rem; flex: 1;">${tpl.description}</p>
        <button class="btn btn-outline btn-sm btn-block">
          Voir le modèle <i class="fas fa-copy" style="font-size: 0.75rem;"></i>
        </button>
      </div>
    `).join('');
  },

  /* ==========================================================================
     Cybersécurité & Mots de passe
     ========================================================================== */
  renderCyberChecklist() {
    const container = document.getElementById('cyberChecklist');
    if (!container || !window.CESAG_DATA) return;

    container.innerHTML = window.CESAG_DATA.cyberRules.map(rule => `
      <label style="display: flex; align-items: flex-start; gap: 0.75rem; padding: 0.65rem 0.85rem; border-radius: var(--radius-md); background-color: var(--bg-surface-alt); margin-bottom: 0.5rem; cursor: pointer;">
        <input type="checkbox" onchange="App.updateCyberProgress()" style="width: 18px; height: 18px; margin-top: 0.2rem; accent-color: var(--cesag-green-600);">
        <span style="font-size: 0.9375rem; color: var(--text-primary); line-height: 1.5;">${rule.text}</span>
      </label>
    `).join('');
  },

  updateCyberProgress() {
    const checkboxes = document.querySelectorAll('#cyberChecklist input[type="checkbox"]');
    const checked = Array.from(checkboxes).filter(c => c.checked).length;
    const counter = document.getElementById('cyberProgressCounter');
    if (counter) {
      counter.textContent = `${checked} / ${checkboxes.length} commandements validés`;
    }
  },

  initPasswordTools() {
    const pwdInput = document.getElementById('passwordInput');
    if (pwdInput) {
      pwdInput.addEventListener('input', (e) => this.checkPasswordStrength(e.target.value));
    }
    this.generatePassword();
  },

  checkPasswordStrength(password) {
    const strengthFill = document.getElementById('passwordStrengthFill');
    const strengthText = document.getElementById('passwordStrengthText');
    if (!strengthFill || !strengthText) return;

    if (!password) {
      strengthFill.className = 'strength-meter-fill';
      strengthFill.style.width = '0%';
      strengthText.textContent = 'Saisissez un mot de passe pour tester sa robustesse.';
      return;
    }

    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    let level = 0;
    let label = 'Très faible (Trop court ou trop prévisible)';
    if (score <= 2) {
      level = 0;
      label = 'Faible : Ajoutez des majuscules, chiffres et symboles.';
    } else if (score <= 4) {
      level = 1;
      label = 'Moyen : Bonne longueur, renforcez la diversité des caractères.';
    } else if (score <= 5) {
      level = 2;
      label = 'Fort : Très bonne protection pour vos comptes académiques !';
    } else {
      level = 3;
      label = 'Excellente robustesse (Inviolable par force brute) !';
    }

    strengthFill.className = `strength-meter-fill strength-${level}`;
    strengthText.textContent = label;
  },

  generatePassword() {
    const lengthInput = document.getElementById('pwdLength');
    const length = lengthInput ? parseInt(lengthInput.value, 10) : 14;
    const useUpper = document.getElementById('pwdUpper') ? document.getElementById('pwdUpper').checked : true;
    const useLower = document.getElementById('pwdLower') ? document.getElementById('pwdLower').checked : true;
    const useNum = document.getElementById('pwdNum') ? document.getElementById('pwdNum').checked : true;
    const useSym = document.getElementById('pwdSym') ? document.getElementById('pwdSym').checked : true;

    let charset = '';
    if (useUpper) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useLower) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (useNum) charset += '0123456789';
    if (useSym) charset += '!@#$%^&*()-_+=<>?';

    if (!charset) charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    let password = '';
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      password += charset[array[i] % charset.length];
    }

    const output = document.getElementById('generatedPasswordOutput');
    if (output) {
      output.textContent = password;
    }
  },

  copyGeneratedPassword() {
    const output = document.getElementById('generatedPasswordOutput');
    if (!output) return;
    const text = output.textContent;
    navigator.clipboard.writeText(text).then(() => {
      showToast('✅ Mot de passe copié dans le presse-papier !');
    });
  },

  /* ==========================================================================
     Bandeau Campus CESAG : Heure de Dakar, Météo en direct & Citations
     ========================================================================== */
  campusQuotes: [
    {
      text: "Le meilleur moyen de prévoir le futur, c'est de le créer.",
      author: "Peter Drucker",
      role: "Père du management moderne",
      context: "Rappelle aux futurs gestionnaires et leaders du CESAG que l'action proactive, la planification stratégique et l'innovation priment toujours sur l'attentisme."
    },
    {
      text: "L'éducation est l'arme la plus puissante pour changer le monde.",
      author: "Nelson Mandela",
      role: "Prix Nobel de la Paix & Homme d'État",
      context: "Souligne la mission fondamentale du CESAG : former le capital humain d'excellence pour bâtir la prospérité économique et institutionnelle de l'Afrique."
    },
    {
      text: "La gestion consiste à faire les choses comme il faut ; le leadership consiste à faire les bonnes choses.",
      author: "Peter Drucker",
      role: "Théoricien du management",
      context: "Distingue l'efficacité opérationnelle de la vision stratégique. Un manager compétent optimise les processus, un leader trace la voie vers l'impact durable."
    },
    {
      text: "En Afrique, un vieillard qui meurt est une bibliothèque qui brûle.",
      author: "Amadou Hampâté Bâ",
      role: "Écrivain & Penseur malien",
      context: "Met en lumière l'importance vitale de la transmission des savoirs, de la mémoire organisationnelle et du respect des mentors dans la gouvernance africaine."
    },
    {
      text: "Les grandes réalisations sont toujours le résultat d'un travail d'équipe.",
      author: "John C. Maxwell",
      role: "Expert mondial en leadership",
      context: "Les projets d'envergure en entreprise ou dans l'administration publique ne réussissent jamais seuls : la cohésion d'équipe et la confiance en sont les piliers."
    },
    {
      text: "Armez-vous de science jusqu'aux dents et arrachez votre patrimoine culturel.",
      author: "Cheikh Anta Diop",
      role: "Savant, historien & anthropologue sénégalais",
      context: "Appel vibrant à la rigueur scientifique, à la recherche académique exigeante et à l'émancipation intellectuelle pour la jeunesse africaine."
    },
    {
      text: "Innover, c'est savoir abandonner hier pour conquérir demain.",
      author: "Peter Drucker",
      role: "Consultant & Professeur",
      context: "Invite à l'agilité organisationnelle et à l'adoption résolue de la transformation digitale et des technologies émergentes."
    },
    {
      text: "L'excellence n'est pas un acte, mais une habitude.",
      author: "Aristote",
      role: "Philosophe",
      context: "La réputation d'un diplômé du CESAG se forge dans la constance, la discipline quotidienne et la recherche permanente de la qualité irréprochable."
    }
  ],
  currentQuoteIdx: 0,

  openQuoteModal() {
    const q = this.campusQuotes[this.currentQuoteIdx] || this.campusQuotes[0];
    const bodyEl = document.getElementById('modalQuoteBody');
    const authorEl = document.getElementById('modalQuoteAuthor');
    const roleEl = document.getElementById('modalQuoteRole');
    const contextEl = document.getElementById('modalQuoteContext');
    if (bodyEl) bodyEl.textContent = `« ${q.text} »`;
    if (authorEl) authorEl.textContent = q.author;
    if (roleEl) roleEl.textContent = `— ${q.role || 'Leader & Penseur'}`;
    if (contextEl) contextEl.textContent = q.context || '';
    if (typeof openModal === 'function') openModal('quoteModal');
  },

  copyQuote() {
    const q = this.campusQuotes[this.currentQuoteIdx] || this.campusQuotes[0];
    const textToCopy = `« ${q.text} » — ${q.author} (${q.role || ''})`;
    const updateLabel = () => {
      const label = document.getElementById('copyQuoteLabel');
      if (label) {
        const old = label.textContent;
        label.textContent = 'Copié !';
        setTimeout(() => { label.textContent = old; }, 2000);
      }
    };

    const fallbackCopy = () => {
      const ta = document.createElement('textarea');
      ta.value = textToCopy;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try {
        document.execCommand('copy');
        updateLabel();
      } catch (e) {}
      document.body.removeChild(ta);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy).then(updateLabel).catch(fallbackCopy);
    } else {
      fallbackCopy();
    }
  },

  refreshQuote() {
    if (!this.campusQuotes || !this.campusQuotes.length) return;
    this.currentQuoteIdx = (this.currentQuoteIdx + 1) % this.campusQuotes.length;
    const q = this.campusQuotes[this.currentQuoteIdx];
    const textEl = document.getElementById('campusQuoteBody');
    const authorEl = document.getElementById('campusQuoteAuthor');
    if (textEl && authorEl) {
      textEl.textContent = `« ${q.text} »`;
      authorEl.textContent = `— ${q.author}`;
    }
    const modalBody = document.getElementById('modalQuoteBody');
    const modalAuthor = document.getElementById('modalQuoteAuthor');
    const modalRole = document.getElementById('modalQuoteRole');
    const modalContext = document.getElementById('modalQuoteContext');
    if (modalBody) modalBody.textContent = `« ${q.text} »`;
    if (modalAuthor) modalAuthor.textContent = q.author;
    if (modalRole) modalRole.textContent = `— ${q.role || ''}`;
    if (modalContext) modalContext.textContent = q.context || '';
  },

  initCampusLive() {
    const timeEl = document.getElementById('campusDakarTime');
    const dateEl = document.getElementById('campusDakarDate');
    const tempEl = document.getElementById('campusWeatherTemp');
    const descEl = document.getElementById('campusWeatherDesc');

    // 1. Horloge et Date officielle du Campus Dakar (GMT)
    const updateTime = () => {
      const now = new Date();
      if (timeEl) {
        timeEl.textContent = `${now.toLocaleTimeString('fr-FR', {
          timeZone: 'Africa/Dakar',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })} GMT`;
      }
      if (dateEl) {
        const dateStr = now.toLocaleDateString('fr-FR', {
          timeZone: 'Africa/Dakar',
          weekday: 'short',
          day: 'numeric',
          month: 'short'
        });
        dateEl.textContent = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
      }
    };
    updateTime();
    setInterval(updateTime, 1000);

    // 2. Météo Campus CESAG Dakar en direct (API wttr.in)
    const fetchWeather = async () => {
      if (!tempEl || !descEl) return;
      try {
        const res = await fetch('https://wttr.in/Dakar?format=j1', { cache: 'no-cache' });
        if (!res.ok) throw new Error('Weather API status ' + res.status);
        const data = await res.json();
        const current = data.current_condition && data.current_condition[0];
        if (current) {
          const temp = current.temp_C;
          let desc = (current.lang_fr && current.lang_fr[0] && current.lang_fr[0].value) 
                     || (current.weatherDesc && current.weatherDesc[0] && current.weatherDesc[0].value) 
                     || 'Ensoleillé';
          desc = desc.trim();
          const translations = {
            'Sunny': 'Ensoleillé',
            'Clear': 'Ciel dégagé',
            'Partly cloudy': 'Éclaircies',
            'Cloudy': 'Nuageux',
            'Overcast': 'Couvert',
            'Mist': 'Brume',
            'Patchy rain possible': 'Ondées',
            'Light rain': 'Pluie fine',
            'Moderate rain': 'Pluie modérée'
          };
          if (translations[desc]) desc = translations[desc];

          tempEl.textContent = `${temp}°C`;
          descEl.textContent = `Dakar • ${desc}`;
        }
      } catch (err) {
        tempEl.textContent = '26°C';
        descEl.textContent = 'Dakar • Ensoleillé';
      }
    };
    fetchWeather();
    setInterval(fetchWeather, 30 * 60 * 1000);

    // 3. Charger une première citation
    this.refreshQuote();
  },

  /* ==========================================================================
     Horloge Panafricaine des Capitales CESAG
     ========================================================================== */
  panafricanCities: [
    { name: "Dakar (Siège)", flag: "🇸🇳", timeZone: "Africa/Dakar", isSiege: true },
    { name: "Abidjan", flag: "🇨🇮", timeZone: "Africa/Abidjan" },
    { name: "Lomé", flag: "🇹🇬", timeZone: "Africa/Lome" },
    { name: "Ouaga", flag: "🇧🇫", timeZone: "Africa/Ouagadougou" },
    { name: "Bamako", flag: "🇲🇱", timeZone: "Africa/Bamako" },
    { name: "Conakry", flag: "🇬🇳", timeZone: "Africa/Conakry" },
    { name: "Cotonou", flag: "🇧🇯", timeZone: "Africa/Porto-Novo" },
    { name: "Niamey", flag: "🇳🇪", timeZone: "Africa/Niamey" },
    { name: "Yaoundé", flag: "🇨🇲", timeZone: "Africa/Douala" },
    { name: "Libreville", flag: "🇬🇦", timeZone: "Africa/Libreville" },
    { name: "Paris", flag: "🇫🇷", timeZone: "Europe/Paris" }
  ],

  initPanafricanClocks() {
    const track = document.getElementById('panafricanZonesTrack');
    if (!track) return;

    const render = () => {
      const now = new Date();
      track.innerHTML = this.panafricanCities.map(c => {
        const timeStr = now.toLocaleTimeString('fr-FR', {
          timeZone: c.timeZone,
          hour: '2-digit',
          minute: '2-digit'
        });
        return `<span class="panafrican-pill ${c.isSiege ? 'is-siege' : ''}">
          <span>${c.flag}</span>
          <span>${c.name} :</span>
          <strong>${timeStr}</strong>
        </span>`;
      }).join('');
    };

    render();
    setInterval(render, 15000);
  },

  /* ==========================================================================
     Lexique & Dictionnaire Business English (Free Dictionary API)
     ========================================================================== */
  lookupWord(word) {
    const input = document.getElementById('dictInput');
    if (input) input.value = word;
    this.searchDictionary(word);
  },

  async searchDictionary(wordParam) {
    const input = document.getElementById('dictInput');
    const box = document.getElementById('dictResultBox');
    const btn = document.getElementById('dictSearchBtn');
    if (!box) return;

    const word = (wordParam || (input && input.value) || '').trim().toLowerCase();
    if (!word) {
      box.innerHTML = '<p style="color: var(--text-muted); text-align: center;">Veuillez entrer un mot à rechercher.</p>';
      return;
    }

    if (btn) btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    box.innerHTML = '<div style="text-align: center; padding: 1.5rem; color: var(--text-muted);"><i class="fas fa-spinner fa-spin" style="font-size: 1.5rem;"></i><p style="margin-top: 0.5rem;">Interrogation du dictionnaire académique...</p></div>';

    try {
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
      if (!res.ok) {
        throw new Error('Terme non trouvé');
      }
      const data = await res.json();
      const entry = data[0];
      const phonetic = entry.phonetic || (entry.phonetics && entry.phonetics.find(p => p.text)?.text) || '';
      const audioUrl = (entry.phonetics && entry.phonetics.find(p => p.audio && p.audio.length > 0)?.audio) || '';

      let meaningsHtml = '';
      if (entry.meanings && entry.meanings.length) {
        meaningsHtml = entry.meanings.slice(0, 3).map(m => {
          const defs = m.definitions.slice(0, 2).map(d => `
            <li style="margin-bottom: 0.45rem; line-height: 1.45;">
              <span style="color: var(--text-primary);">${d.definition}</span>
              ${d.example ? `<span style="display: block; font-style: italic; color: var(--text-muted); font-size: 0.8rem; margin-top: 0.15rem;">« ${d.example} »</span>` : ''}
            </li>
          `).join('');
          return `
            <div style="margin-top: 0.75rem;">
              <span style="display: inline-block; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; background: rgba(139, 92, 246, 0.15); color: #7C3AED; padding: 0.1rem 0.5rem; border-radius: 4px;">${m.partOfSpeech}</span>
              <ul style="margin: 0.4rem 0 0 1.25rem; font-size: 0.85rem;">${defs}</ul>
            </div>
          `;
        }).join('');
      }

      box.innerHTML = `
        <div>
          <div style="display: flex; align-items: baseline; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.5rem;">
            <div>
              <strong style="font-family: var(--font-heading); font-size: 1.35rem; color: var(--cesag-green-600);">${entry.word}</strong>
              ${phonetic ? `<span style="font-size: 0.85rem; color: var(--text-muted); margin-left: 0.5rem;">${phonetic}</span>` : ''}
            </div>
            ${audioUrl ? `
              <button type="button" class="btn btn-outline btn-sm" onclick="new Audio('${audioUrl}').play();" title="Écouter la prononciation" style="padding: 0.2rem 0.6rem; font-size: 0.75rem;">
                <i class="fas fa-volume-up"></i> Prononciation
              </button>
            ` : ''}
          </div>
          ${meaningsHtml}
          <div style="font-size: 0.72rem; color: var(--text-muted); text-align: right; margin-top: 0.75rem;">
            Source : Free Dictionary API & Wiktionary
          </div>
        </div>
      `;
    } catch (err) {
      box.innerHTML = `
        <div style="text-align: center; padding: 1rem; color: var(--text-muted);">
          <i class="fas fa-info-circle" style="color: var(--cesag-gold-600); font-size: 1.3rem; margin-bottom: 0.4rem; display: block;"></i>
          <p style="font-weight: 600; color: var(--text-primary);">Mot « ${word} » non répertorié ou orthographe à vérifier.</p>
          <p style="font-size: 0.8rem; margin-top: 0.25rem;">Conseil : Entrez des termes en anglais tels que <em>management</em>, <em>audit</em>, <em>procurement</em>, <em>logistics</em> ou <em>strategy</em>.</p>
        </div>
      `;
    } finally {
      if (btn) btn.innerHTML = '<i class="fas fa-search"></i> Définir';
    }
  },

  /* ==========================================================================
     Générateur de QR Code Académique (API QRServer)
     ========================================================================== */
  initQrCode() {
    const textInput = document.getElementById('qrTextInput');
    const sizeSelect = document.getElementById('qrSizeSelect');
    const colorSelect = document.getElementById('qrColorSelect');
    if (!textInput || !sizeSelect || !colorSelect) return;

    const handler = () => this.generateQrCode();
    textInput.addEventListener('input', handler);
    sizeSelect.addEventListener('change', handler);
    colorSelect.addEventListener('change', handler);

    this.generateQrCode();
  },

  generateQrCode() {
    const textInput = document.getElementById('qrTextInput');
    const sizeSelect = document.getElementById('qrSizeSelect');
    const colorSelect = document.getElementById('qrColorSelect');
    const imgPreview = document.getElementById('qrImagePreview');
    const downloadLink = document.getElementById('qrDownloadLink');
    if (!textInput || !sizeSelect || !colorSelect || !imgPreview) return;

    const text = textInput.value.trim() || 'https://oscarkakpo-create.github.io/hubdigitalcesag/';
    const size = sizeSelect.value || '300x300';
    const color = colorSelect.value || '006747';

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}&color=${color}&data=${encodeURIComponent(text)}`;
    imgPreview.src = qrUrl;
    if (downloadLink) {
      downloadLink.href = qrUrl;
    }
  },

  /* ==========================================================================
     Convertisseur de Devises Dynamique (API Open Exchange Rates)
     ========================================================================== */
  liveRates: {
    EUR: 1,
    XOF: 655.957,
    USD: 1.09,
    CAD: 1.57,
    GBP: 0.83,
    MAD: 10.93
  },

  initConverter() {
    const amountInput = document.getElementById('convAmount');
    const srcSelect = document.getElementById('convSource');
    const tgtSelect = document.getElementById('convTarget');

    if (amountInput && srcSelect && tgtSelect) {
      amountInput.addEventListener('input', () => this.runConversion());
      srcSelect.addEventListener('change', () => this.runConversion());
      tgtSelect.addEventListener('change', () => this.runConversion());
      this.fetchLiveRates();
      this.runConversion();
    }
  },

  async fetchLiveRates() {
    try {
      const cached = localStorage.getItem('cesag_live_rates');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < 1000 * 60 * 60 * 12) {
          this.liveRates = { ...this.liveRates, ...parsed.rates };
          this.updateLiveRatesBadge('Taux en direct (BCEAO / Marchés)');
          this.runConversion();
          return;
        }
      }

      const res = await fetch('https://open.er-api.com/v6/latest/EUR');
      if (!res.ok) throw new Error('API offline');
      const data = await res.json();
      if (data && data.rates) {
        this.liveRates.USD = data.rates.USD || this.liveRates.USD;
        this.liveRates.CAD = data.rates.CAD || this.liveRates.CAD;
        this.liveRates.GBP = data.rates.GBP || this.liveRates.GBP;
        this.liveRates.MAD = data.rates.MAD || this.liveRates.MAD;
        this.liveRates.XOF = 655.957;

        localStorage.setItem('cesag_live_rates', JSON.stringify({
          rates: this.liveRates,
          timestamp: Date.now()
        }));

        this.updateLiveRatesBadge(`Taux en direct connectés (${new Date().toLocaleDateString('fr-FR')})`);
        this.runConversion();
      }
    } catch (e) {
      this.updateLiveRatesBadge('Taux de référence (BCEAO / Marchés)');
    }
  },

  updateLiveRatesBadge(msg) {
    const badge = document.getElementById('convLiveStatus');
    if (badge) badge.textContent = msg;
  },

  runConversion() {
    const amount = parseFloat(document.getElementById('convAmount').value);
    const src = document.getElementById('convSource').value;
    const tgt = document.getElementById('convTarget').value;
    const resultBox = document.getElementById('convResult');
    if (!resultBox) return;

    if (isNaN(amount) || amount < 0) {
      resultBox.textContent = 'Veuillez saisir un montant valide.';
      return;
    }

    const amountInEUR = src === 'EUR' ? amount : (src === 'XOF' ? amount / 655.957 : amount / (this.liveRates[src] || 1));
    const converted = tgt === 'EUR' ? amountInEUR : (tgt === 'XOF' ? amountInEUR * 655.957 : amountInEUR * (this.liveRates[tgt] || 1));

    const symbols = {
      EUR: '€',
      USD: '$',
      XOF: 'FCFA',
      CAD: 'CAD$',
      GBP: '£',
      MAD: 'MAD'
    };

    const formatted = converted.toLocaleString('fr-FR', {
      maximumFractionDigits: tgt === 'XOF' ? 0 : 2
    });

    resultBox.innerHTML = `<strong>${amount.toLocaleString('fr-FR')} ${symbols[src]}</strong> = <span style="color: var(--cesag-green-600); font-weight: 800;">${formatted} ${symbols[tgt]}</span>`;
  },

  swapConverter() {
    const srcSelect = document.getElementById('convSource');
    const tgtSelect = document.getElementById('convTarget');
    if (!srcSelect || !tgtSelect) return;
    const temp = srcSelect.value;
    srcSelect.value = tgtSelect.value;
    tgtSelect.value = temp;
    this.runConversion();
  },

  /* ==========================================================================
     Recherche Académique & Publications Open Access (OpenAlex API)
     ========================================================================== */
  searchAcademicQuick(query) {
    const input = document.getElementById('academicSearchInput');
    if (input) {
      input.value = query;
      this.searchAcademicWorks();
    }
  },

  async searchAcademicWorks() {
    const input = document.getElementById('academicSearchInput');
    const resultsContainer = document.getElementById('academicSearchResults');
    if (!input || !resultsContainer) return;

    const query = input.value.trim();
    if (!query) {
      input.focus();
      return;
    }

    resultsContainer.style.display = 'grid';
    resultsContainer.innerHTML = `
      <div style="text-align: center; padding: 2.5rem; background: var(--bg-surface-alt); border-radius: var(--radius-lg);">
        <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: var(--cesag-green-600); margin-bottom: 0.75rem;"></i>
        <p style="color: var(--text-primary); font-weight: 700;">Interrogation des bases scientifiques (OpenAlex / CrossRef)...</p>
        <p style="color: var(--text-muted); font-size: 0.85rem;">Recherche d'articles, thèses et mémoires en libre accès...</p>
      </div>
    `;

    try {
      let works = [];
      let sourceName = 'OpenAlex';

      // 1. Essai OpenAlex
      try {
        const alexUrl = `https://api.openalex.org/works?search=${encodeURIComponent(query)}&filter=is_oa:true&per_page=4&mailto=contact@cesagonline.com`;
        const alexRes = await fetch(alexUrl);
        if (alexRes.ok) {
          const alexData = await alexRes.json();
          if (alexData.results && alexData.results.length) {
            works = alexData.results.map(w => ({
              title: w.title || 'Publication sans titre',
              year: w.publication_year || 'N/A',
              journal: (w.primary_location && w.primary_location.source && w.primary_location.source.display_name) ||
                       (w.host_venue && w.host_venue.display_name) || 'Revue scientifique',
              authors: (w.authorships || [])
                .slice(0, 3)
                .map(a => a.author ? a.author.display_name : '')
                .filter(Boolean)
                .join(', ') || 'Auteurs académiques',
              url: (w.open_access && w.open_access.oa_url) ||
                   (w.best_oa_location && w.best_oa_location.pdf_url) ||
                   (w.best_oa_location && w.best_oa_location.landing_page_url) ||
                   w.doi || '#',
              firstAuthor: (w.authorships && w.authorships[0] && w.authorships[0].author) ? w.authorships[0].author.display_name : 'Auteur'
            }));
          }
        }
      } catch (_) {}

      // 2. Relais CrossRef si nécessaire
      if (!works.length) {
        sourceName = 'CrossRef (Registre International DOI)';
        const crossUrl = `https://api.crossref.org/works?query=${encodeURIComponent(query)}&rows=4&mailto=contact@cesagonline.com`;
        const crossRes = await fetch(crossUrl);
        if (crossRes.ok) {
          const crossData = await crossRes.json();
          const items = (crossData.message && crossData.message.items) || [];
          works = items.map(it => {
            const rawTitle = it.title ? (Array.isArray(it.title) ? it.title[0] : it.title) : 'Publication sans titre';
            const year = (it.issued && it.issued['date-parts'] && it.issued['date-parts'][0] && it.issued['date-parts'][0][0]) || 'N/A';
            const journal = (it['container-title'] && it['container-title'][0]) || it.publisher || 'Éditeur académique';
            const authorList = (it.author || [])
              .slice(0, 3)
              .map(a => [a.given, a.family].filter(Boolean).join(' '))
              .filter(Boolean)
              .join(', ') || 'Auteur académique';
            const firstA = (it.author && it.author[0] && (it.author[0].family || it.author[0].name)) || 'Auteur';
            const url = it.URL || (it.DOI ? `https://doi.org/${it.DOI}` : '#');
            return {
              title: rawTitle,
              year,
              journal,
              authors: authorList,
              url,
              firstAuthor: firstA
            };
          });
        }
      }

      if (!works.length) {
        resultsContainer.innerHTML = `
          <div style="text-align: center; padding: 2.5rem; background: var(--bg-surface-alt); border-radius: var(--radius-lg); border: 1px dashed var(--border-default);">
            <i class="fas fa-info-circle" style="font-size: 2rem; color: var(--cesag-gold-500); margin-bottom: 0.75rem;"></i>
            <h4 style="font-size: 1.05rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.35rem;">Aucune publication trouvée pour « ${query} »</h4>
            <p style="color: var(--text-muted); font-size: 0.875rem;">Essayez avec des termes plus généraux (ex. « microfinance », « audit bancaire », « logistique »).</p>
          </div>
        `;
        return;
      }

      resultsContainer.innerHTML = works.map((w) => {
        const apaCitation = `${w.firstAuthor} et al. (${w.year}). ${w.title}. ${w.journal}. ${w.url !== '#' ? w.url : ''}`.trim();

        return `
          <article class="academic-card">
            <div class="academic-card-top">
              <span class="academic-card-year"><i class="fas fa-calendar-alt"></i> ${w.year}</span>
              <span class="academic-card-journal">${w.journal}</span>
            </div>
            <h4 class="academic-card-title">${w.title}</h4>
            <p class="academic-card-authors"><i class="fas fa-user-edit" style="color: var(--cesag-gold-600); margin-right: 0.35rem;"></i> ${w.authors}</p>
            <div class="academic-card-actions">
              <a href="${w.url}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
                <i class="fas fa-file-pdf"></i> Consulter la publication
              </a>
              <button type="button" class="btn btn-outline btn-sm" onclick="App.copyCitation('${encodeURIComponent(apaCitation)}')">
                <i class="fas fa-quote-right"></i> Copier citation APA
              </button>
            </div>
          </article>
        `;
      }).join('');

    } catch (e) {
      resultsContainer.innerHTML = `
        <div style="text-align: center; padding: 2rem; background: var(--bg-surface-alt); border-radius: var(--radius-lg); border: 1px dashed var(--border-default);">
          <i class="fas fa-wifi" style="font-size: 1.8rem; color: var(--cesag-gold-500); margin-bottom: 0.75rem;"></i>
          <h4 style="font-size: 1rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.25rem;">Connexion momentanément indisponible</h4>
          <p style="color: var(--text-muted); font-size: 0.85rem;">Vérifiez votre connexion Internet ou réessayez dans un instant.</p>
        </div>
      `;
    }
  },

  copyCitation(encodedText) {
    const text = decodeURIComponent(encodedText);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast('Citation APA copiée dans le presse-papier !');
      }).catch(() => {
        showToast('Citation APA : ' + text.substring(0, 50) + '...');
      });
    } else {
      showToast('Citation APA : ' + text.substring(0, 50) + '...');
    }
  },

  /* ==========================================================================
     Utilitaires UI & Mobile Menu
     ========================================================================== */
  initMobileMenu() {
    const toggle = document.getElementById('mobileMenuToggle');
    const wrapper = document.getElementById('navMenuWrapper');
    const backdrop = document.getElementById('mobileNavBackdrop');
    const closeBtn = document.getElementById('mobileMenuClose');
    if (!toggle || !wrapper) return;

    const openMenu = () => {
      wrapper.classList.add('active');
      if (backdrop) backdrop.classList.add('active');
      toggle.classList.add('active');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Fermer le menu de navigation');
      toggle.innerHTML = '<i class="fas fa-times" aria-hidden="true"></i>';
      document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
      wrapper.classList.remove('active');
      if (backdrop) backdrop.classList.remove('active');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Ouvrir le menu de navigation');
      toggle.innerHTML = '<i class="fas fa-bars" aria-hidden="true"></i>';
      document.body.style.overflow = '';
    };

    const toggleMenu = () => {
      if (wrapper.classList.contains('active')) {
        closeMenu();
      } else {
        openMenu();
      }
    };

    this.openMobileMenu = openMenu;
    this.closeMobileMenu = closeMenu;
    this.toggleMobileMenu = toggleMenu;

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeMenu();
      });
    }

    if (backdrop) {
      backdrop.addEventListener('click', () => {
        closeMenu();
      });
    }

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && wrapper.classList.contains('active')) {
        closeMenu();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 1080 && wrapper.classList.contains('active')) {
        closeMenu();
      }
    });
  },

  initScrollSpy() {
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    if (!sections.length || !navLinks.length) return;

    window.addEventListener('scroll', () => {
      let currentId = '';
      const scrollPos = window.scrollY + 140;

      sections.forEach(sec => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          currentId = sec.getAttribute('id');
        }
      });

      if (currentId) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${currentId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    }, { passive: true });
  },

  initBackToTop() {
    const btn = document.getElementById('backToTopBtn');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        btn.classList.add('is-visible');
      } else {
        btn.classList.remove('is-visible');
      }
    });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  },

  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').catch(err => {
          console.log('SW registration notice:', err);
        });
      });
    }
  }
};

/* ==========================================================================
   Modals & Actions Globales
   ========================================================================== */

function showToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fas fa-info-circle"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => toast.classList.add('is-visible'), 10);

  setTimeout(() => {
    toast.classList.remove('is-visible');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function openModal(modalId) {
  if (window.App && typeof window.App.closeMobileMenu === 'function') {
    window.App.closeMobileMenu();
  }
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.add('is-active');
  document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.remove('is-active');
  document.body.style.overflow = '';
}

function openProblem(problemId) {
  const problemSection = document.getElementById('depannage');
  if (problemSection) {
    problemSection.scrollIntoView({ behavior: 'smooth' });
  }
}

function openTutorial(tutoId) {
  const tuto = (window.CESAG_DATA.tutorials || []).find(t => t.id === tutoId);
  if (!tuto) return;

  const modal = document.getElementById('tutoModal');
  const title = document.getElementById('tutoModalTitle');
  const body = document.getElementById('tutoModalBody');
  if (!modal || !title || !body) return;

  title.innerHTML = `<i class="${tuto.icon}" style="color: var(--cesag-green-600);"></i> ${tuto.title}`;
  body.innerHTML = `
    <div style="display: flex; gap: 0.5rem; margin-bottom: 1.25rem;">
      <span class="badge tag-essential">${tuto.tool}</span>
      <span class="badge tag-free">${tuto.duration}</span>
      <span class="badge tag-mandatory">${tuto.level}</span>
    </div>
    <p style="font-size: 1rem; color: var(--text-secondary); margin-bottom: 1.5rem; line-height: 1.6;">${tuto.summary}</p>
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      ${tuto.steps.map((s, idx) => `
        <div style="background-color: var(--bg-surface-alt); padding: 1rem 1.25rem; border-radius: var(--radius-md); border-left: 3px solid var(--cesag-green-600);">
          <h4 style="font-family: var(--font-heading); font-size: 1rem; color: var(--text-primary); margin-bottom: 0.35rem;">Étape ${idx + 1} : ${s.title}</h4>
          <p style="font-size: 0.875rem; color: var(--text-secondary); line-height: 1.5;">${s.desc}</p>
        </div>
      `).join('')}
    </div>
  `;

  openModal('tutoModal');
}

function openEmailModal(emailId) {
  const tpl = window.CESAG_DATA.emailTemplates[emailId];
  if (!tpl) return;

  const modal = document.getElementById('emailModal');
  const title = document.getElementById('emailModalTitle');
  const body = document.getElementById('emailModalBody');
  if (!modal || !title || !body) return;

  title.innerHTML = `<i class="${tpl.icon}" style="color: var(--cesag-gold-600);"></i> ${tpl.title}`;
  body.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
      <span class="badge tag-mandatory">${tpl.badge}</span>
      <span style="font-size: 0.8125rem; color: var(--text-muted);">Destinataire suggéré : <strong>${tpl.recipient}</strong></span>
    </div>
    <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 1rem;">${tpl.description}</p>
    <pre class="email-template-box" id="emailTemplateContent">${tpl.body}</pre>
    <div style="margin-top: 1.25rem; display: flex; gap: 0.75rem;">
      <button class="btn btn-primary btn-block" onclick="copyEmailContent()">
        <i class="fas fa-copy"></i> Copier l'intégralité du modèle
      </button>
      ${tpl.recipient.includes('@') ? `
        <a href="mailto:${tpl.recipient}?subject=${encodeURIComponent(tpl.subject)}" class="btn btn-outline" style="flex-shrink: 0;" title="Ouvrir votre messagerie">
          <i class="fas fa-paper-plane"></i>
        </a>
      ` : ''}
    </div>
  `;

  openModal('emailModal');
}

function copyEmailContent() {
  const pre = document.getElementById('emailTemplateContent');
  if (!pre) return;
  navigator.clipboard.writeText(pre.innerText).then(() => {
    showToast('✅ Modèle copié ! Collez-le dans votre messagerie Outlook.');
  });
}

/* ==========================================================================
   Générateur de CV Standardisé CESAG
   ========================================================================== */

function openCVModal() {
  openModal('cvModal');
}

function generateCVPreview() {
  const nom = document.getElementById('cv_nom').value || 'PRÉNOM NOM';
  const titre = document.getElementById('cv_titre').value || 'Étudiant(e) au CESAG';
  const contact = document.getElementById('cv_contact').value || '+221 XX XXX XX XX | prenom.nom@cesag.edu.sn | Dakar, Sénégal';
  const profil = document.getElementById('cv_profil').value || '';
  const formation = document.getElementById('cv_formation').value || '';
  const experience = document.getElementById('cv_experience').value || '';
  const competences = document.getElementById('cv_competences').value || '';
  const interets = document.getElementById('cv_interets').value || '';

  const formatList = (text) => {
    return text.split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0)
      .map(l => l.startsWith('-') ? `<li>${l.substring(1).trim()}</li>` : `<p style="margin-bottom: 0.35rem;">${l}</p>`)
      .join('');
  };

  const cvHTML = `
    <div style="font-family: 'Inter', sans-serif; color: #1F2937; padding: 1.5rem; background: #FFFFFF; border-radius: 8px; border: 1px solid #E2E8F0;">
      <header style="text-align: center; border-bottom: 2px solid #006747; padding-bottom: 1rem; margin-bottom: 1.25rem;">
        <h1 style="color: #006747; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.6rem; font-weight: 800; margin-bottom: 0.25rem;">${nom.toUpperCase()}</h1>
        <p style="font-size: 1.05rem; font-weight: 600; color: #D97706; margin-bottom: 0.5rem;">${titre}</p>
        <p style="font-size: 0.85rem; color: #4B5563;">${contact}</p>
      </header>

      ${profil ? `
        <section style="margin-bottom: 1.25rem;">
          <h2 style="color: #006747; font-size: 0.95rem; font-weight: 700; text-transform: uppercase; border-bottom: 1px solid #E5E7EB; padding-bottom: 0.25rem; margin-bottom: 0.5rem;">Profil Professionnel</h2>
          <p style="font-size: 0.875rem; line-height: 1.5;">${profil}</p>
        </section>
      ` : ''}

      ${formation ? `
        <section style="margin-bottom: 1.25rem;">
          <h2 style="color: #006747; font-size: 0.95rem; font-weight: 700; text-transform: uppercase; border-bottom: 1px solid #E5E7EB; padding-bottom: 0.25rem; margin-bottom: 0.5rem;">Formation & Diplômes</h2>
          <div style="font-size: 0.875rem; line-height: 1.5;">${formatList(formation)}</div>
        </section>
      ` : ''}

      ${experience ? `
        <section style="margin-bottom: 1.25rem;">
          <h2 style="color: #006747; font-size: 0.95rem; font-weight: 700; text-transform: uppercase; border-bottom: 1px solid #E5E7EB; padding-bottom: 0.25rem; margin-bottom: 0.5rem;">Expériences & Projets</h2>
          <ul style="font-size: 0.875rem; line-height: 1.5; padding-left: 1.25rem;">${formatList(experience)}</ul>
        </section>
      ` : ''}

      ${competences ? `
        <section style="margin-bottom: 1.25rem;">
          <h2 style="color: #006747; font-size: 0.95rem; font-weight: 700; text-transform: uppercase; border-bottom: 1px solid #E5E7EB; padding-bottom: 0.25rem; margin-bottom: 0.5rem;">Compétences Clés</h2>
          <div style="font-size: 0.875rem; line-height: 1.5;">${formatList(competences)}</div>
        </section>
      ` : ''}

      ${interets ? `
        <section>
          <h2 style="color: #006747; font-size: 0.95rem; font-weight: 700; text-transform: uppercase; border-bottom: 1px solid #E5E7EB; padding-bottom: 0.25rem; margin-bottom: 0.5rem;">Centres d'Intérêt</h2>
          <p style="font-size: 0.875rem;">${interets}</p>
        </section>
      ` : ''}
    </div>
  `;

  const outputContainer = document.getElementById('cvPreviewOutput');
  if (outputContainer) {
    outputContainer.innerHTML = cvHTML;
    outputContainer.style.display = 'block';
  }
}

function exportCVtoPDF() {
  generateCVPreview();
  const output = document.getElementById('cvPreviewOutput');
  if (!output) return;

  const printWindow = window.open('', '', 'height=750,width=900');
  printWindow.document.write('<html><head><title>Curriculum Vitae - CESAG</title>');
  printWindow.document.write('<style>');
  printWindow.document.write(`
    body { font-family: 'Inter', -apple-system, sans-serif; margin: 0; padding: 25px; color: #1F2937; line-height: 1.4; }
    h1 { color: #006747; font-size: 20pt; text-align: center; margin-bottom: 4px; font-weight: 800; }
    h2 { color: #006747; font-size: 11pt; border-bottom: 1px solid #CBD5E1; padding-bottom: 3px; margin-top: 14px; margin-bottom: 6px; text-transform: uppercase; }
    p, li { font-size: 10pt; }
    ul { margin: 0; padding-left: 18px; }
    li { margin-bottom: 4px; }
    @media print { @page { margin: 1.5cm; } }
  `);
  printWindow.document.write('</style></head><body>');
  printWindow.document.write(output.innerHTML);
  printWindow.document.write('</body></html>');
  printWindow.document.close();

  printWindow.onload = function() {
    printWindow.focus();
    printWindow.print();
  };
}

/* ==========================================================================
   Quiz Digital CESAG
   ========================================================================== */
let currentQuizState = {
  questions: [],
  currentIndex: 0,
  score: 0,
  selectedAnswer: null,
  isAnswered: false
};

function openQuizModal() {
  const allQ = window.CESAG_DATA.quizQuestions || [];
  currentQuizState.questions = [...allQ].sort(() => 0.5 - Math.random()).slice(0, 5);
  currentQuizState.currentIndex = 0;
  currentQuizState.score = 0;
  currentQuizState.selectedAnswer = null;
  currentQuizState.isAnswered = false;

  renderQuizStep();
  openModal('quizModal');
}

function renderQuizStep() {
  const body = document.getElementById('quizModalBody');
  const footer = document.getElementById('quizModalFooter');
  if (!body || !footer) return;

  const q = currentQuizState.questions[currentQuizState.currentIndex];
  if (!q) {
    renderQuizFinalResult();
    return;
  }

  currentQuizState.selectedAnswer = null;
  currentQuizState.isAnswered = false;

  body.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
      <span class="badge tag-essential">Question ${currentQuizState.currentIndex + 1} sur ${currentQuizState.questions.length}</span>
      <span style="font-size: 0.8125rem; font-weight: 600; color: var(--text-muted);">Score : ${currentQuizState.score}</span>
    </div>
    <h3 style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin-bottom: 1.25rem;">
      ${q.question}
    </h3>
    <div class="quiz-options-list" id="quizOptionsList">
      ${q.options.map((opt, idx) => `
        <button class="quiz-option-btn" data-index="${idx}" onclick="selectQuizOption(this, '${opt.replace(/'/g, "\\'")}')">
          ${opt}
        </button>
      `).join('')}
    </div>
    <div id="quizFeedbackBox" style="display: none; margin-top: 1.25rem; padding: 1rem; border-radius: var(--radius-md); font-size: 0.875rem; line-height: 1.5;"></div>
  `;

  footer.innerHTML = `
    <button id="quizSubmitBtn" class="btn btn-primary" style="width: 100%;" disabled onclick="validateQuizAnswer()">
      Valider ma réponse
    </button>
  `;
}

function selectQuizOption(btn, answer) {
  if (currentQuizState.isAnswered) return;
  document.querySelectorAll('.quiz-option-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  currentQuizState.selectedAnswer = answer;
  const submitBtn = document.getElementById('quizSubmitBtn');
  if (submitBtn) submitBtn.disabled = false;
}

function validateQuizAnswer() {
  if (currentQuizState.isAnswered || !currentQuizState.selectedAnswer) return;
  currentQuizState.isAnswered = true;

  const q = currentQuizState.questions[currentQuizState.currentIndex];
  const isCorrect = currentQuizState.selectedAnswer === q.answer;

  if (isCorrect) currentQuizState.score++;

  document.querySelectorAll('.quiz-option-btn').forEach(btn => {
    btn.disabled = true;
    if (btn.textContent.trim() === q.answer.trim()) {
      btn.classList.add('correct');
    } else if (btn.classList.contains('selected') && !isCorrect) {
      btn.classList.add('incorrect');
    }
  });

  const feedback = document.getElementById('quizFeedbackBox');
  if (feedback) {
    feedback.style.display = 'block';
    if (isCorrect) {
      feedback.style.backgroundColor = 'var(--color-success-bg)';
      feedback.style.color = 'var(--color-success-text)';
      feedback.innerHTML = `<strong><i class="fas fa-check-circle"></i> Excellente réponse !</strong><br>${q.explanation}`;
    } else {
      feedback.style.backgroundColor = 'var(--color-danger-bg)';
      feedback.style.color = 'var(--color-danger-text)';
      feedback.innerHTML = `<strong><i class="fas fa-times-circle"></i> Réponse incorrecte.</strong><br>${q.explanation}`;
    }
  }

  const footer = document.getElementById('quizModalFooter');
  if (footer) {
    const isLast = currentQuizState.currentIndex >= currentQuizState.questions.length - 1;
    footer.innerHTML = `
      <button class="btn btn-primary" style="width: 100%;" onclick="nextQuizQuestion()">
        ${isLast ? 'Voir mes résultats complets' : 'Question suivante →'}
      </button>
    `;
  }
}

function nextQuizQuestion() {
  currentQuizState.currentIndex++;
  renderQuizStep();
}

function renderQuizFinalResult() {
  const body = document.getElementById('quizModalBody');
  const footer = document.getElementById('quizModalFooter');
  if (!body || !footer) return;

  const total = currentQuizState.questions.length;
  const score = currentQuizState.score;
  const percent = (score / total) * 100;

  let medalIcon = 'fa-medal';
  let medalTitle = "Médaille d'Or 🥇";
  let medalColor = '#F59E0B';
  let message = "Impressionnant ! Vous maîtrisez parfaitement l'écosystème numérique du CESAG. Vous êtes fin prêt(e) pour une année d'excellence !";

  if (percent < 50) {
    medalIcon = 'fa-certificate';
    medalTitle = "Médaille de Bronze 🥉";
    medalColor = '#CD7F32';
    message = "Prenez quelques minutes pour explorer les rubriques 'Nouveau au CESAG' et 'Dépannage' pour vous familiariser avec vos outils essentiels.";
  } else if (percent < 80) {
    medalIcon = 'fa-award';
    medalTitle = "Médaille d'Argent 🥈";
    medalColor = '#94A3B8';
    message = "Très bon score ! Quelques révisions sur la charte IA et la réinitialisation des mots de passe et vous serez au sommet.";
  }

  body.innerHTML = `
    <div style="text-align: center; padding: 1.5rem 0;">
      <i class="fas ${medalIcon}" style="font-size: 3.5rem; color: ${medalColor}; margin-bottom: 1rem;"></i>
      <h3 style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.5rem;">${medalTitle}</h3>
      <p style="font-size: 1.25rem; font-weight: 700; color: var(--cesag-green-600); margin-bottom: 1rem;">Votre score : ${score} / ${total} (${percent}%)</p>
      <p style="font-size: 0.9375rem; color: var(--text-secondary); max-width: 460px; margin: 0 auto 1.5rem; line-height: 1.6;">${message}</p>
    </div>
  `;

  footer.innerHTML = `
    <button class="btn btn-secondary" style="flex: 1;" onclick="openQuizModal()">
      <i class="fas fa-redo"></i> Recommencer le quiz
    </button>
    <button class="btn btn-outline" style="flex: 1;" onclick="closeModal('quizModal')">
      Fermer
    </button>
  `;
}

// Global window exposure
window.App = App;
window.showToast = showToast;
window.openModal = openModal;
window.closeModal = closeModal;
window.openProblem = openProblem;
window.openTutorial = openTutorial;
window.openEmailModal = openEmailModal;
window.copyEmailContent = copyEmailContent;
window.openCVModal = openCVModal;
window.generateCVPreview = generateCVPreview;
window.exportCVtoPDF = exportCVtoPDF;
window.openQuizModal = openQuizModal;
window.selectQuizOption = selectQuizOption;
window.validateQuizAnswer = validateQuizAnswer;
window.nextQuizQuestion = nextQuizQuestion;
