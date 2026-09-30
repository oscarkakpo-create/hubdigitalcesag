/**
 * Hub Digital CESAG - Moteur de Recherche Intelligent
 */

const SearchEngine = {
  selectedIndex: 0,
  currentResults: [],

  normalize(str) {
    return (str || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  },

  search(query) {
    if (!window.CESAG_DATA) return [];
    const q = this.normalize(query);
    if (!q) return [];

    const results = [];

    // 1. Recherche dans les services
    window.CESAG_DATA.services.forEach(service => {
      const nameNorm = this.normalize(service.name);
      const descNorm = this.normalize(service.shortDesc);
      const keywords = (service.keywords || []).map(k => this.normalize(k));

      let score = 0;
      if (nameNorm === q) score += 100;
      else if (nameNorm.startsWith(q)) score += 50;
      else if (nameNorm.includes(q)) score += 30;

      if (keywords.some(k => k === q)) score += 40;
      else if (keywords.some(k => k.includes(q))) score += 20;

      if (descNorm.includes(q)) score += 10;

      if (score > 0) {
        results.push({
          type: 'service',
          category: 'Service / Outil',
          title: service.name,
          description: service.shortDesc,
          icon: service.icon,
          iconColor: service.iconColor,
          url: service.url,
          score: score
        });
      }
    });

    // 2. Recherche dans les dépannages (J'ai un problème)
    (window.CESAG_DATA.troubleshooting || []).forEach(item => {
      const titleNorm = this.normalize(item.title);
      const summaryNorm = this.normalize(item.summary);
      const stepsText = this.normalize(item.steps.join(' '));

      let score = 0;
      if (titleNorm.includes(q)) score += 45;
      if (summaryNorm.includes(q)) score += 25;
      if (stepsText.includes(q)) score += 15;

      if (score > 0) {
        results.push({
          type: 'troubleshooting',
          category: 'Aide & Dépannage',
          title: item.title,
          description: item.summary,
          icon: item.icon || 'fas fa-wrench',
          iconColor: 'var(--cesag-gold-600)',
          action: item.ctaAction || `openProblem('${item.id}')`,
          url: item.ctaUrl,
          score: score
        });
      }
    });

    // 3. Recherche dans les tutoriels
    (window.CESAG_DATA.tutorials || []).forEach(tuto => {
      const titleNorm = this.normalize(tuto.title);
      const toolNorm = this.normalize(tuto.tool);
      const summaryNorm = this.normalize(tuto.summary);

      let score = 0;
      if (titleNorm.includes(q)) score += 40;
      if (toolNorm.includes(q)) score += 30;
      if (summaryNorm.includes(q)) score += 15;

      if (score > 0) {
        results.push({
          type: 'tutorial',
          category: `Guide ${tuto.tool}`,
          title: tuto.title,
          description: `${tuto.duration} • ${tuto.level} — ${tuto.summary}`,
          icon: tuto.icon || 'fas fa-book-open',
          iconColor: 'var(--cesag-green-600)',
          action: `openTutorial('${tuto.id}')`,
          score: score
        });
      }
    });

    // 4. Recherche dans les modèles d'emails
    Object.values(window.CESAG_DATA.emailTemplates || {}).forEach(tpl => {
      const titleNorm = this.normalize(tpl.title);
      const descNorm = this.normalize(tpl.description);

      let score = 0;
      if (titleNorm.includes(q)) score += 35;
      if (descNorm.includes(q)) score += 15;

      if (score > 0) {
        results.push({
          type: 'template',
          category: "Modèle d'Email",
          title: tpl.title,
          description: tpl.description,
          icon: tpl.icon || 'fas fa-envelope',
          iconColor: 'var(--cesag-gold-600)',
          action: `openEmailModal('${tpl.id}')`,
          score: score
        });
      }
    });

    // Trier par score décroissant
    return results.sort((a, b) => b.score - a.score);
  },

  openSearchModal(initialQuery = '') {
    const modal = document.getElementById('searchModal');
    const input = document.getElementById('searchModalInput');
    if (!modal || !input) return;

    modal.classList.add('is-active');
    document.body.style.overflow = 'hidden';

    if (initialQuery) {
      input.value = initialQuery;
    }
    input.focus();
    this.handleSearchInput(input.value);
  },

  closeSearchModal() {
    const modal = document.getElementById('searchModal');
    if (!modal) return;
    modal.classList.remove('is-active');
    document.body.style.overflow = '';
  },

  handleSearchInput(query) {
    const resultsContainer = document.getElementById('searchResultsList');
    if (!resultsContainer) return;

    if (!query.trim()) {
      resultsContainer.innerHTML = `
        <div class="search-zero-state">
          <p><i class="fas fa-search" style="font-size: 1.5rem; color: var(--cesag-green-600); margin-bottom: 0.5rem;"></i></p>
          <p style="font-weight: 600;">Tapez un mot-clé pour lancer la recherche...</p>
          <p style="font-size: 0.8125rem; margin-top: 0.25rem;">Exemples : <em>Moodle, mot de passe, Teams, Office 365, Wi-Fi, CV, Support</em></p>
        </div>
      `;
      this.currentResults = [];
      this.selectedIndex = 0;
      return;
    }

    const results = this.search(query);
    this.currentResults = results;
    this.selectedIndex = 0;

    if (results.length === 0) {
      resultsContainer.innerHTML = `
        <div class="search-zero-state">
          <p><i class="fas fa-search-minus" style="font-size: 1.5rem; color: var(--text-muted); margin-bottom: 0.5rem;"></i></p>
          <p style="font-weight: 600; color: var(--text-primary);">Aucun résultat trouvé pour "${query}"</p>
          <p style="font-size: 0.8125rem; margin-top: 0.5rem;">Essayez avec un autre terme ou contactez le support informatique.</p>
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = results.slice(0, 10).map((res, index) => `
      <li class="search-result-item ${index === 0 ? 'is-selected' : ''}" data-index="${index}" onclick="SearchEngine.selectResult(${index})">
        <div class="search-result-icon" style="color: ${res.iconColor}">
          <i class="${res.icon}"></i>
        </div>
        <div class="search-result-info">
          <div class="search-result-name">
            ${res.title}
            <span class="badge ${res.type === 'service' ? 'tag-essential' : 'tag-free'}" style="font-size: 0.65rem;">${res.category}</span>
          </div>
          <div class="search-result-desc">${res.description}</div>
        </div>
        <div class="search-result-action">
          Ouvrir <i class="fas fa-arrow-right" style="font-size: 0.75rem;"></i>
        </div>
      </li>
    `).join('');
  },

  selectResult(index) {
    const res = this.currentResults[index];
    if (!res) return;

    this.closeSearchModal();

    if (res.action) {
      eval(res.action);
    } else if (res.url) {
      if (res.url.startsWith('#')) {
        const el = document.querySelector(res.url);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.open(res.url, '_blank', 'noopener,noreferrer');
      }
    }
  },

  init() {
    // Écouteur global de raccourci clavier : Ctrl+K, Cmd+K, ou '/'
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        this.openSearchModal();
      } else if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        this.openSearchModal();
      } else if (e.key === 'Escape') {
        this.closeSearchModal();
      }
    });

    // Navigation clavier dans les résultats
    const input = document.getElementById('searchModalInput');
    if (input) {
      input.addEventListener('input', (e) => this.handleSearchInput(e.target.value));
      input.addEventListener('keydown', (e) => {
        if (this.currentResults.length === 0) return;

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          this.selectedIndex = (this.selectedIndex + 1) % Math.min(this.currentResults.length, 10);
          this.updateVisualSelection();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          this.selectedIndex = (this.selectedIndex - 1 + Math.min(this.currentResults.length, 10)) % Math.min(this.currentResults.length, 10);
          this.updateVisualSelection();
        } else if (e.key === 'Enter') {
          e.preventDefault();
          this.selectResult(this.selectedIndex);
        }
      });
    }

    // Recherche depuis l'input du Hero
    const heroInput = document.getElementById('heroSearchInput');
    if (heroInput) {
      heroInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.openSearchModal(heroInput.value);
        }
      });
      heroInput.addEventListener('click', () => {
        this.openSearchModal(heroInput.value);
      });
    }
  },

  updateVisualSelection() {
    const items = document.querySelectorAll('.search-result-item');
    items.forEach((item, idx) => {
      if (idx === this.selectedIndex) {
        item.classList.add('is-selected');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove('is-selected');
      }
    });
  }
};

window.SearchEngine = SearchEngine;
