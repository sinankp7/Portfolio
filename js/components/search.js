/**
 * Football World Hub - Global Omnibox Search Component
 * Supports keyboard triggers ('/' and 'Ctrl+K')
 * Instant typeahead search across Leagues, Competitions, Clubs, National Teams, Players, Countries, and Stadiums.
 */

class GlobalSearchComponent {
  constructor() {
    this.modalEl = document.getElementById("search-modal-overlay");
    this.inputEl = document.getElementById("global-search-input");
    this.resultsEl = document.getElementById("search-results-container");
    this.closeBtn = document.getElementById("close-search-modal");
    this.init();
  }

  init() {
    // Keyboard shortcuts
    window.addEventListener("keydown", (e) => {
      if ((e.key === "/" || (e.ctrlKey && e.key.toLowerCase() === "k")) && !this.isTypingInInput(e)) {
        e.preventDefault();
        this.open();
      }
      if (e.key === "Escape" && this.isOpen()) {
        this.close();
      }
    });

    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", () => this.close());
    }

    if (this.modalEl) {
      this.modalEl.addEventListener("click", (e) => {
        if (e.target === this.modalEl) this.close();
      });
    }

    if (this.inputEl) {
      this.inputEl.addEventListener("input", (e) => {
        this.handleSearch(e.target.value);
      });
    }

    // Header search triggers
    document.querySelectorAll(".search-trigger-btn").forEach(btn => {
      btn.addEventListener("click", () => this.open());
    });
  }

  isTypingInInput(e) {
    const tag = e.target.tagName;
    return tag === "INPUT" || tag === "TEXTAREA" || e.target.isContentEditable;
  }

  open() {
    if (this.modalEl) {
      this.modalEl.classList.add("active");
      if (this.inputEl) {
        this.inputEl.value = "";
        this.inputEl.focus();
      }
      this.renderDefaultSuggestions();
    }
  }

  close() {
    if (this.modalEl) {
      this.modalEl.classList.remove("active");
    }
  }

  isOpen() {
    return this.modalEl && this.modalEl.classList.contains("active");
  }

  renderDefaultSuggestions() {
    if (!this.resultsEl) return;
    this.resultsEl.innerHTML = `
      <div style="padding: 1.5rem 0.5rem; text-align: center; color: var(--text-muted);">
        <p style="margin-bottom: 0.75rem; font-size: 0.9rem;">Type to search globally across:</p>
        <div style="display: flex; justify-content: center; gap: 0.5rem; flex-wrap: wrap;">
          <span class="tag-pill">🏆 Competitions</span>
          <span class="tag-pill">🛡️ Clubs</span>
          <span class="tag-pill">⭐ Players</span>
          <span class="tag-pill">🏟️ Stadiums</span>
          <span class="tag-pill">🌍 Countries</span>
        </div>
        <p style="font-size: 0.75rem; margin-top: 1.5rem;">Quick hint: Try searching "Real Madrid", "Haaland", "Premier League", or "Bernabéu"</p>
      </div>
    `;
  }

  handleSearch(query) {
    if (!query || query.trim().length < 2) {
      this.renderDefaultSuggestions();
      return;
    }

    const res = window.footballApi.globalSearch(query);
    if (!res || res.totalMatches === 0) {
      this.resultsEl.innerHTML = `
        <div style="padding: 2rem 1rem; text-align: center; color: var(--text-muted);">
          <p style="font-size: 1.1rem; color: var(--text-secondary); margin-bottom: 0.4rem;">No results found for "${query}"</p>
          <p style="font-size: 0.8rem;">Try checking your spelling or search by country name or competition title.</p>
        </div>
      `;
      return;
    }

    let html = "";

    // Competitions
    if (res.competitions.length > 0) {
      html += `<div class="search-category-title">🏆 Competitions & Leagues (${res.competitions.length})</div>`;
      res.competitions.forEach(c => {
        html += `
          <div class="search-result-item" onclick="window.appRouter.openCompetition('${c.id}'); window.globalSearch.close();">
            <div class="search-item-left">
              <span style="font-size: 1.3rem;">${c.flag || "🏆"}</span>
              <div>
                <div class="search-item-title">${c.name}</div>
                <div class="search-item-sub">${c.country} • ${c.governingBody}</div>
              </div>
            </div>
            <span class="tag-pill">${c.type}</span>
          </div>
        `;
      });
    }

    // Clubs & National Teams
    if (res.clubs.length > 0) {
      html += `<div class="search-category-title">🛡️ Teams & Clubs (${res.clubs.length})</div>`;
      res.clubs.forEach(t => {
        html += `
          <div class="search-result-item" onclick="window.appRouter.openTeam('${t.id}'); window.globalSearch.close();">
            <div class="search-item-left">
              <span style="font-size: 1.3rem;">${t.flag || "⚽"}</span>
              <div>
                <div class="search-item-title">${t.name}</div>
                <div class="search-item-sub">${t.city ? t.city + ", " : ""}${t.country} • Stadium: ${t.stadium ? t.stadium.name : "N/A"}</div>
              </div>
            </div>
            <span class="tag-pill" style="color: var(--accent-green);">${t.shortName}</span>
          </div>
        `;
      });
    }

    // Players
    if (res.players.length > 0) {
      html += `<div class="search-category-title">⭐ Players (${res.players.length})</div>`;
      res.players.forEach(p => {
        html += `
          <div class="search-result-item" onclick="window.appRouter.openPlayer('${p.id}'); window.globalSearch.close();">
            <div class="search-item-left">
              <span style="font-size: 1.3rem;">${p.flag || "👤"}</span>
              <div>
                <div class="search-item-title">${p.name} <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 400;">#${p.number}</span></div>
                <div class="search-item-sub">${p.position} • ${p.nationality} • ${p.stats.goals} Goals, ${p.stats.assists} Assists</div>
              </div>
            </div>
            <span class="tag-pill">${p.position}</span>
          </div>
        `;
      });
    }

    // Stadiums
    if (res.stadiums.length > 0) {
      html += `<div class="search-category-title">🏟️ Stadiums (${res.stadiums.length})</div>`;
      res.stadiums.forEach(s => {
        html += `
          <div class="search-result-item" onclick="window.appRouter.openTeam('${s.team.id}'); window.globalSearch.close();">
            <div class="search-item-left">
              <span style="font-size: 1.3rem;">🏟️</span>
              <div>
                <div class="search-item-title">${s.stadiumName}</div>
                <div class="search-item-sub">Home of ${s.team.name} • Capacity: ${s.capacity ? s.capacity.toLocaleString() : "N/A"}</div>
              </div>
            </div>
            <span class="tag-pill">${s.team.country}</span>
          </div>
        `;
      });
    }

    // Countries
    if (res.countries.length > 0) {
      html += `<div class="search-category-title">🌍 Countries & Federations (${res.countries.length})</div>`;
      res.countries.forEach(c => {
        html += `
          <div class="search-result-item" onclick="window.appRouter.navigateTo('countries'); window.globalSearch.close();">
            <div class="search-item-left">
              <span style="font-size: 1.3rem;">${c.flag || "🌐"}</span>
              <div>
                <div class="search-item-title">${c.name}</div>
                <div class="search-item-sub">${c.confederation} • Top League: ${c.topLeague}</div>
              </div>
            </div>
            <span class="tag-pill">${c.confederation}</span>
          </div>
        `;
      });
    }

    this.resultsEl.innerHTML = html;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.globalSearch = new GlobalSearchComponent();
});
