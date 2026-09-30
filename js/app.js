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
    this.initBackToTop();
    this.initMobileMenu();

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
        <span><strong>${ann.title}</strong> — ${ann.message}</span>
        ${ann.ctaLink ? `<a href="${ann.ctaLink}" target="_blank" rel="noopener noreferrer" class="announcement-link">${ann.ctaText} <i class="fas fa-arrow-right"></i></a>` : ''}
        ${ann.ctaTarget ? `<a href="${ann.ctaTarget}" class="announcement-link">${ann.ctaText} <i class="fas fa-arrow-right"></i></a>` : ''}
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
     Convertisseur de Devises XOF
     ========================================================================== */
  initConverter() {
    const amountInput = document.getElementById('convAmount');
    const srcSelect = document.getElementById('convSource');
    const tgtSelect = document.getElementById('convTarget');

    if (amountInput && srcSelect && tgtSelect) {
      amountInput.addEventListener('input', () => this.runConversion());
      srcSelect.addEventListener('change', () => this.runConversion());
      tgtSelect.addEventListener('change', () => this.runConversion());
      this.runConversion();
    }
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

    const ratesInXOF = {
      EUR: 655.957,
      USD: 605.00,
      XOF: 1
    };

    const amountInXOF = amount * ratesInXOF[src];
    const converted = amountInXOF / ratesInXOF[tgt];

    const symbols = { EUR: '€', USD: '$', XOF: 'FCFA' };
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
     Utilitaires UI & Mobile
     ========================================================================== */
  initMobileMenu() {
    const toggle = document.getElementById('mobileMenuToggle');
    const nav = document.getElementById('navMenu');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
      nav.classList.toggle('active');
      toggle.innerHTML = nav.classList.contains('active') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 992) {
          nav.classList.remove('active');
          toggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
      });
    });
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
