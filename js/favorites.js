/**
 * Hub Digital CESAG - Gestion des Favoris Locaux (localStorage)
 */

const FavoritesManager = {
  STORAGE_KEY: 'cesag_hub_favorites',

  getFavorites() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : ['moodle', 'office365', 'teams'];
    } catch (e) {
      console.warn('Erreur de lecture des favoris:', e);
      return ['moodle', 'office365', 'teams'];
    }
  },

  isFavorite(serviceId) {
    const favorites = this.getFavorites();
    return favorites.includes(serviceId);
  },

  toggleFavorite(serviceId) {
    let favorites = this.getFavorites();
    let added = false;

    if (favorites.includes(serviceId)) {
      favorites = favorites.filter(id => id !== serviceId);
      added = false;
    } else {
      favorites.push(serviceId);
      added = true;
    }

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.warn('Erreur de sauvegarde des favoris:', e);
    }

    this.renderFavoritesSection();
    this.updatePinButtons();

    if (typeof showToast === 'function') {
      showToast(added ? '★ Ajouté à vos raccourcis favoris' : 'Retiré de vos raccourcis');
    }

    return added;
  },

  removeFavorite(serviceId) {
    let favorites = this.getFavorites().filter(id => id !== serviceId);
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.warn(e);
    }
    this.renderFavoritesSection();
    this.updatePinButtons();
    if (typeof showToast === 'function') {
      showToast('Raccourci retiré');
    }
  },

  updatePinButtons() {
    const favorites = this.getFavorites();
    document.querySelectorAll('.btn-pin-favorite').forEach(btn => {
      const serviceId = btn.getAttribute('data-service-id');
      if (favorites.includes(serviceId)) {
        btn.classList.add('is-pinned');
        btn.setAttribute('aria-label', 'Retirer des favoris');
        btn.innerHTML = '<i class="fas fa-star"></i>';
      } else {
        btn.classList.remove('is-pinned');
        btn.setAttribute('aria-label', 'Ajouter aux favoris');
        btn.innerHTML = '<i class="far fa-star"></i>';
      }
    });
  },

  renderFavoritesSection() {
    const section = document.getElementById('favoritesSection');
    const container = document.getElementById('favoritesGrid');
    if (!section || !container || !window.CESAG_DATA) return;

    const favoriteIds = this.getFavorites();
    const favoriteServices = window.CESAG_DATA.services.filter(s => favoriteIds.includes(s.id));

    if (favoriteServices.length === 0) {
      section.style.display = 'none';
      return;
    }

    section.style.display = 'block';
    container.innerHTML = favoriteServices.map(service => `
      <div class="favorite-card">
        <div class="favorite-card-icon" style="color: ${service.iconColor || 'var(--cesag-green-600)'}">
          <i class="${service.icon}"></i>
        </div>
        <a href="${service.url}" ${service.url.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : ''} class="favorite-card-name">
          ${service.name}
        </a>
        <button class="favorite-remove-btn" onclick="FavoritesManager.removeFavorite('${service.id}')" title="Retirer" aria-label="Retirer des raccourcis">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `).join('');
  },

  init() {
    this.renderFavoritesSection();
    this.updatePinButtons();
  }
};

window.FavoritesManager = FavoritesManager;
