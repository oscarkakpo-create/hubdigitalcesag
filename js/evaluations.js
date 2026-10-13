/**
 * Espaces d'évaluation — données maintenues dans data/evaluations.json.
 * Aucune URL n'est inventée : seules les entrées actives avec une URL HTTPS sont affichées.
 */
(function () {
  'use strict';

  const state = { items: [], notice: '', filters: { cycle: 'all', level: 'all', session: 'all' } };
  const byId = id => document.getElementById(id);

  function isSafeEntry(item) {
    if (!item || item.active !== true || typeof item.url !== 'string') return false;
    try { return new URL(item.url).protocol === 'https:'; } catch (_) { return false; }
  }

  function matches(item) {
    const cycle = String(item.cycle || '').toLowerCase();
    const level = String(item.niveau || '').toLowerCase();
    const session = String(item.session || '').toLowerCase();
    return (state.filters.cycle === 'all' || cycle === state.filters.cycle.toLowerCase()) &&
      (state.filters.level === 'all' || level === state.filters.level.toLowerCase()) &&
      (state.filters.session === 'all' || session === state.filters.session.toLowerCase());
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);
  }

  function render() {
    const grid = byId('evaluationGrid');
    const count = byId('evaluationCount');
    if (!grid || !count) return;
    const filtered = state.items.filter(isSafeEntry).filter(matches);
    grid.setAttribute('aria-busy', 'false');
    count.textContent = filtered.length ? `${filtered.length} espace${filtered.length > 1 ? 's' : ''} disponible${filtered.length > 1 ? 's' : ''}` : '';

    if (!filtered.length) {
      grid.innerHTML = `<div class="evaluation-empty"><i class="fas fa-circle-info" aria-hidden="true"></i><h3>Aucun espace disponible pour le moment</h3><p>${escapeHtml(state.notice || 'Les liens seront publiés après validation par les services compétents.')}</p></div>`;
      return;
    }

    grid.innerHTML = filtered.map(item => `
      <article class="evaluation-card">
        <div class="evaluation-card__meta">
          <span>${escapeHtml(item.cycle)}</span><span>${escapeHtml(item.niveau)}</span><span>${escapeHtml(item.session)}</span>
        </div>
        <h3>${escapeHtml(item.label || item.programme)}</h3>
        <p>${escapeHtml(item.programme)}</p>
        <a class="btn btn-primary btn-sm" href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">Ouvrir l’espace <i class="fas fa-external-link-alt"></i></a>
      </article>`).join('');
  }

  function bindFilters() {
    [['evaluationCycle', 'cycle'], ['evaluationLevel', 'level'], ['evaluationSession', 'session']].forEach(([id, key]) => {
      const element = byId(id);
      if (element) element.addEventListener('change', () => { state.filters[key] = element.value; render(); });
    });
    const reset = byId('evaluationReset');
    if (reset) reset.addEventListener('click', () => {
      ['evaluationCycle', 'evaluationLevel', 'evaluationSession'].forEach(id => { if (byId(id)) byId(id).value = 'all'; });
      state.filters = { cycle: 'all', level: 'all', session: 'all' };
      render();
    });
  }

  async function init() {
    if (!byId('evaluationGrid')) return;
    bindFilters();
    try {
      const response = await fetch('data/evaluations.json', { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      state.items = Array.isArray(data.evaluations) ? data.evaluations : [];
      state.notice = data.notice || '';
    } catch (error) {
      state.notice = 'Les espaces d’évaluation sont momentanément indisponibles. Réessayez plus tard.';
      console.warn('Chargement des évaluations impossible :', error);
    }
    render();
  }

  document.addEventListener('DOMContentLoaded', init);
})();

