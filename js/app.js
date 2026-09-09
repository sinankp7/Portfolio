/**
 * Football World Hub - Master Application Controller & Client-Side Router
 */

class AppRouter {
  constructor() {
    this.currentView = "home";
    this.currentConfedFilter = "ALL";
    this.currentTypeFilter = "ALL";
    this.selectedCompId = null;
    this.init();
  }

  init() {
    // Hash change routing
    window.addEventListener("hashchange", () => this.handleRoute());

    // Navigation links click listeners
    document.querySelectorAll(".nav-link, .mobile-nav-item").forEach(link => {
      link.addEventListener("click", (e) => {
        const route = link.dataset.view;
        if (route) {
          e.preventDefault();
          this.navigateTo(route);
        }
      });
    });

    // Handle initial route
    this.handleRoute();

    // Listen for favorites update
    window.addEventListener("fwh:favorites-updated", () => {
      if (this.currentView === "favorites") {
        this.renderFavoritesView();
      }
      this.updateFavoriteButtonsState();
    });

    // API settings modal handlers
    const apiBtn = document.getElementById("open-api-settings-btn");
    const apiModal = document.getElementById("api-settings-modal-overlay");
    const closeApiBtn = document.getElementById("close-api-settings-modal");
    const saveApiBtn = document.getElementById("save-api-settings-btn");

    if (apiBtn && apiModal) {
      apiBtn.addEventListener("click", () => {
        const settings = window.storageService.getApiSettings();
        const providerSel = document.getElementById("api-provider-select");
        const keyInput = document.getElementById("api-key-input");
        const liveToggle = document.getElementById("use-live-toggle");

        if (providerSel) providerSel.value = settings.provider || "local_verified";
        if (keyInput) keyInput.value = settings.apiKey || "";
        if (liveToggle) liveToggle.checked = !!settings.useLiveData;

        apiModal.classList.add("active");
      });
    }

    if (closeApiBtn && apiModal) {
      closeApiBtn.addEventListener("click", () => apiModal.classList.remove("active"));
    }

    if (saveApiBtn && apiModal) {
      saveApiBtn.addEventListener("click", () => {
        const provider = document.getElementById("api-provider-select").value;
        const apiKey = document.getElementById("api-key-input").value;
        const useLiveData = document.getElementById("use-live-toggle").checked;

        window.storageService.saveApiSettings({ provider, apiKey, useLiveData });
        apiModal.classList.remove("active");
        alert("API Settings updated successfully! Active Data Mode: " + (useLiveData && apiKey ? "Live Connected" : "Verified Archive / Demo Mode"));
      });
    }
  }

  handleRoute() {
    const hash = window.location.hash.replace("#", "") || "home";
    const parts = hash.split("/");
    const mainRoute = parts[0] || "home";

    if (mainRoute === "competition" && parts[1]) {
      this.openCompetition(parts[1], false);
      return;
    }
    if (mainRoute === "team" && parts[1]) {
      this.openTeam(parts[1], false);
      return;
    }
    if (mainRoute === "player" && parts[1]) {
      this.openPlayer(parts[1], false);
      return;
    }

    this.navigateTo(mainRoute, false);
  }

  navigateTo(viewName, updateHash = true) {
    if (updateHash) {
      window.location.hash = viewName;
      return;
    }

    this.currentView = viewName;

    // Update active nav links
    document.querySelectorAll(".nav-link, .mobile-nav-item").forEach(link => {
      link.classList.toggle("active", link.dataset.view === viewName);
    });

    // Hide all view sections
    document.querySelectorAll(".view-section").forEach(sec => {
      sec.classList.remove("active");
    });

    // Show target section
    const targetSection = document.getElementById(`view-${viewName}`);
    if (targetSection) {
      targetSection.classList.add("active");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Initialize specific view content
    switch (viewName) {
      case "home":
        this.renderHomeView();
        break;
      case "competitions":
      case "leagues":
        this.renderCompetitionsView(viewName === "leagues" ? "Domestic League" : null);
        break;
      case "matches":
        if (window.matchCenter) window.matchCenter.render();
        break;
      case "standings":
        if (window.standingsComponent) window.standingsComponent.render();
        break;
      case "teams":
        this.renderTeamsView();
        break;
      case "players":
        this.renderPlayersView();
        break;
      case "countries":
        if (window.countryDirectory) window.countryDirectory.render();
        break;
      case "calendar":
        if (window.footballCalendar) window.footballCalendar.render();
        break;
      case "favorites":
        this.renderFavoritesView();
        break;
    }
  }

  renderHomeView() {
    // Render featured competitions carousel
    const featuredList = window.footballApi.getCompetitions({ isFeatured: true });
    const featuredContainer = document.getElementById("home-featured-competitions");
    if (featuredContainer) {
      featuredContainer.innerHTML = featuredList.slice(0, 6).map(c => this.renderCompetitionCard(c)).join("");
    }

    // Render Popular Leagues strip
    const popularList = window.footballApi.getCompetitions({ isPopular: true, type: "Domestic League" });
    const popularContainer = document.getElementById("home-popular-leagues");
    if (popularContainer) {
      popularContainer.innerHTML = popularList.map(c => `
        <div class="confed-card" onclick="window.appRouter.openCompetition('${c.id}')" style="min-width: 200px;">
          <div class="confed-badge" style="background: ${c.logoColor || 'rgba(255,255,255,0.05)'}; color: ${c.accentColor || '#fff'}">
            ${c.flag}
          </div>
          <div class="confed-info">
            <h4>${c.shortName}</h4>
            <p>${c.country}</p>
          </div>
        </div>
      `).join("");
    }

    // Render Home Live / Upcoming Matches
    if (window.matchCenter) {
      window.matchCenter.render("home-live-matches-grid", { status: "ALL" });
    }

    // Render Standings preview
    if (window.standingsComponent) {
      window.standingsComponent.render("home-standings-preview-container", "premier-league");
    }
  }

  renderCompetitionsView(forcedType = null) {
    const container = document.getElementById("competitions-grid-container");
    if (!container) return;

    let filter = {};
    if (this.currentConfedFilter !== "ALL") filter.confederation = this.currentConfedFilter;
    if (forcedType) filter.type = forcedType;
    else if (this.currentTypeFilter !== "ALL") filter.type = this.currentTypeFilter;

    const list = window.footballApi.getCompetitions(filter);

    if (list.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; padding: 3rem; text-align: center; color: var(--text-muted);">
          No competitions found matching the selected filters.
        </div>
      `;
      return;
    }

    container.innerHTML = list.map(c => this.renderCompetitionCard(c)).join("");
  }

  renderCompetitionCard(c) {
    const isFav = window.storageService ? window.storageService.isFavorite("competitions", c.id) : false;

    let catClass = "mens";
    if (c.category === "Women's") catClass = "womens";
    else if (c.category === "Youth") catClass = "youth";

    let entClass = "club";
    if (c.entityType === "National Teams") entClass = "intl";

    return `
      <div class="comp-card" onclick="window.appRouter.openCompetition('${c.id}')">
        <div class="comp-card-top">
          <div class="comp-logo" style="background: ${c.logoColor || 'rgba(255,255,255,0.05)'}; color: ${c.accentColor || '#fff'}">
            ${c.flag || "🏆"}
          </div>
          <div class="comp-details" style="flex: 1;">
            <h3>${c.name}</h3>
            <div class="comp-meta">
              <span>${c.country}</span>
              <span>•</span>
              <span class="comp-governing-badge">🏛️ ${c.governingBody}</span>
            </div>
            <div class="comp-tags-row">
              <span class="tag-pill ${catClass}">${c.category}</span>
              <span class="tag-pill ${entClass}">${c.entityType}</span>
              <span class="tag-pill">${c.type}</span>
            </div>
          </div>
          <button class="fav-btn ${isFav ? 'favorited' : ''}" onclick="event.stopPropagation(); window.appRouter.toggleFavorite('competitions', '${c.id}', this)">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          </button>
        </div>

        <div class="comp-card-footer">
          <div>
            <span style="color: var(--text-muted); font-size: 0.72rem;">CURRENT CHAMPION</span>
            <div style="font-weight: 700; color: #ffffff;">${c.currentChampion}</div>
          </div>
          <div style="text-align: right;">
            <span style="color: var(--text-muted); font-size: 0.72rem;">TEAMS</span>
            <div style="font-weight: 700; color: var(--accent-green);">${c.teamsCount} Clubs</div>
          </div>
        </div>
      </div>
    `;
  }

  openCompetition(compId, updateHash = true) {
    const comp = window.footballApi.getCompetitionById(compId);
    if (!comp) return;

    if (updateHash) {
      window.location.hash = `competition/${compId}`;
      return;
    }

    this.selectedCompId = compId;

    // Show details view
    document.querySelectorAll(".view-section").forEach(sec => sec.classList.remove("active"));
    const detailsSection = document.getElementById("view-competition-details");
    if (detailsSection) {
      detailsSection.classList.add("active");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    const isFav = window.storageService ? window.storageService.isFavorite("competitions", comp.id) : false;

    // Render header
    const headerContainer = document.getElementById("comp-details-header");
    if (headerContainer) {
      headerContainer.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap;">
          <div style="display: flex; align-items: center; gap: 1.5rem;">
            <div style="width: 80px; height: 80px; border-radius: var(--radius-md); background: ${comp.logoColor || '#1e293b'}; color: ${comp.accentColor || '#fff'}; display: flex; align-items: center; justify-content: center; font-size: 2.8rem; border: 2px solid rgba(255,255,255,0.15); box-shadow: var(--shadow-sm);">
              ${comp.flag || "🏆"}
            </div>
            <div>
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.3rem; flex-wrap: wrap;">
                <span class="tag-pill" style="background: var(--accent-green); color: #000; font-weight: 800;">${comp.confederationId}</span>
                <span class="tag-pill">${comp.type}</span>
                <span class="tag-pill">${comp.category}</span>
                <span class="tag-pill">${comp.entityType}</span>
              </div>
              <h1 style="font-size: 2.2rem; line-height: 1.2;">${comp.name}</h1>
              <div style="display: flex; align-items: center; gap: 0.6rem; font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.25rem; flex-wrap: wrap;">
                <span>📍 ${comp.country}</span>
                <span>•</span>
                <span>🏛️ Governing Body: <strong>${comp.governingBody}</strong></span>
                <span>•</span>
                <span>Season: <strong>${comp.currentSeason}</strong></span>
              </div>
            </div>
          </div>

          <button class="filter-btn ${isFav ? 'active' : ''}" onclick="window.appRouter.toggleFavorite('competitions', '${comp.id}', this)" style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.9rem;">
            <span>★</span>
            <span>${isFav ? 'Favorited' : 'Add to Favorites'}</span>
          </button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-top: 1.5rem; border-top: 1px solid var(--border-subtle); padding-top: 1.25rem;">
          <div>
            <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Current Champion</span>
            <div style="font-weight: 800; font-size: 1.05rem; color: #fff;">${comp.currentChampion}</div>
          </div>
          <div>
            <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Participating Teams</span>
            <div style="font-weight: 800; font-size: 1.05rem; color: var(--accent-green);">${comp.teamsCount} Teams</div>
          </div>
          <div>
            <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Start Date - End Date</span>
            <div style="font-weight: 700; color: #fff;">${comp.startDate} to ${comp.endDate}</div>
          </div>
          <div>
            <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Promotion & Relegation</span>
            <div style="font-size: 0.82rem; color: var(--text-secondary);">${comp.promotionRelegation || 'N/A'}</div>
          </div>
        </div>

        <div style="margin-top: 1rem; background: rgba(0,0,0,0.25); padding: 0.85rem 1rem; border-radius: var(--radius-sm); font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6;">
          <strong style="color: #fff;">Competition Format:</strong> ${comp.format}
        </div>
      `;
    }

    // Previous Winners Roll of Honour
    const winnersContainer = document.getElementById("comp-previous-winners-list");
    if (winnersContainer && comp.previousWinners) {
      winnersContainer.innerHTML = comp.previousWinners.map(w => `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.6rem 0.85rem; background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm);">
          <span style="font-weight: 700; color: var(--accent-green);">${w.year}</span>
          <span style="font-weight: 600; color: #ffffff;">${w.team}</span>
        </div>
      `).join("");
    }

    // Render Standings for this competition if available
    const standingsContainer = document.getElementById("comp-details-standings-container");
    if (standingsContainer) {
      window.standingsComponent.render("comp-details-standings-container", comp.id);
    }

    // Render Matches for this competition
    const matchesContainer = document.getElementById("comp-details-matches-container");
    if (matchesContainer) {
      window.matchCenter.render("comp-details-matches-container", { competitionId: comp.id });
    }
  }

  renderTeamsView() {
    const container = document.getElementById("teams-grid-container");
    if (!container) return;

    const teams = window.footballApi.getTeams();
    container.innerHTML = teams.map(t => {
      const isFav = window.storageService ? window.storageService.isFavorite("teams", t.id) : false;
      const comp = window.footballApi.getCompetitionById(t.leagueId);

      return `
        <div class="entity-card" onclick="window.appRouter.openTeam('${t.id}')">
          <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1rem;">
            <div style="display: flex; align-items: center; gap: 0.85rem;">
              <div style="width: 52px; height: 52px; border-radius: 50%; background: rgba(255,255,255,0.05); border: 2px solid ${t.colors ? t.colors.primary : '#fff'}; display: flex; align-items: center; justify-content: center; font-size: 1.8rem;">
                ${t.flag || "⚽"}
              </div>
              <div>
                <h3 style="font-size: 1.05rem; line-height: 1.2;">${t.name}</h3>
                <div style="font-size: 0.75rem; color: var(--text-secondary);">${t.city ? t.city + ', ' : ''}${t.country}</div>
              </div>
            </div>
            <button class="fav-btn ${isFav ? 'favorited' : ''}" onclick="event.stopPropagation(); window.appRouter.toggleFavorite('teams', '${t.id}', this)">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            </button>
          </div>

          <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.8rem;">
            <div><strong>League:</strong> ${comp ? comp.name : t.leagueId}</div>
            <div><strong>Stadium:</strong> ${t.stadium ? t.stadium.name : 'N/A'}</div>
            <div><strong>Manager:</strong> ${t.manager}</div>
          </div>

          <div style="margin-top: auto; border-top: 1px solid var(--border-subtle); padding-top: 0.75rem; display: flex; align-items: center; justify-content: space-between; font-size: 0.75rem;">
            <span style="color: var(--text-muted);">Form:</span>
            <div style="display: flex; gap: 0.25rem;">
              ${t.currentForm.map(f => `<span class="form-pill ${f.toLowerCase()}">${f}</span>`).join("")}
            </div>
          </div>
        </div>
      `;
    }).join("");
  }

  renderPlayersView() {
    const container = document.getElementById("players-grid-container");
    if (!container) return;

    const players = window.footballApi.getPlayers();
    container.innerHTML = players.map(p => {
      const isFav = window.storageService ? window.storageService.isFavorite("players", p.id) : false;
      const team = window.footballApi.getTeamById(p.teamId);

      return `
        <div class="entity-card" onclick="window.appRouter.openPlayer('${p.id}')">
          <div class="player-card-top">
            <div class="player-avatar">
              ${p.flag || "👤"}
            </div>
            <div style="flex: 1;">
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <h3 style="font-size: 1.05rem;">${p.name}</h3>
                <button class="fav-btn ${isFav ? 'favorited' : ''}" onclick="event.stopPropagation(); window.appRouter.toggleFavorite('players', '${p.id}', this)">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                </button>
              </div>
              <div style="font-size: 0.78rem; color: var(--text-secondary); margin-top: 0.2rem;">
                ${p.position} • #${p.number} • ${team ? team.name : p.teamId}
              </div>
              <div style="font-size: 0.72rem; color: var(--text-muted);">${p.nationality} ${p.flag}</div>
            </div>
          </div>

          <div class="player-stats-mini">
            <div class="stat-box">
              <div class="stat-val">${p.stats.goals}</div>
              <div class="stat-lbl">Goals</div>
            </div>
            <div class="stat-box">
              <div class="stat-val">${p.stats.assists}</div>
              <div class="stat-lbl">Assists</div>
            </div>
            <div class="stat-box">
              <div class="stat-val">${p.stats.appearances}</div>
              <div class="stat-lbl">Matches</div>
            </div>
          </div>
        </div>
      `;
    }).join("");
  }

  renderFavoritesView() {
    const favs = window.storageService.getFavorites();

    // Favorite Competitions
    const compContainer = document.getElementById("fav-competitions-grid");
    if (compContainer) {
      if (!favs.competitions || favs.competitions.length === 0) {
        compContainer.innerHTML = `<p style="grid-column: 1/-1; color: var(--text-muted); font-size: 0.9rem;">No favorited competitions yet. Click the star icon on any competition to pin it here.</p>`;
      } else {
        const comps = favs.competitions.map(id => window.footballApi.getCompetitionById(id)).filter(Boolean);
        compContainer.innerHTML = comps.map(c => this.renderCompetitionCard(c)).join("");
      }
    }

    // Favorite Teams
    const teamContainer = document.getElementById("fav-teams-grid");
    if (teamContainer) {
      if (!favs.teams || favs.teams.length === 0) {
        teamContainer.innerHTML = `<p style="grid-column: 1/-1; color: var(--text-muted); font-size: 0.9rem;">No favorited clubs yet. Star your favorite teams to track their matches.</p>`;
      } else {
        const teams = favs.teams.map(id => window.footballApi.getTeamById(id)).filter(Boolean);
        teamContainer.innerHTML = teams.map(t => `
          <div class="entity-card" onclick="window.appRouter.openTeam('${t.id}')">
            <div style="display: flex; align-items: center; gap: 0.85rem;">
              <div style="font-size: 2rem;">${t.flag || "⚽"}</div>
              <div>
                <h3 style="font-size: 1.1rem;">${t.name}</h3>
                <div style="font-size: 0.75rem; color: var(--text-secondary);">${t.country}</div>
              </div>
            </div>
          </div>
        `).join("");
      }
    }

    // Favorite Players
    const playerContainer = document.getElementById("fav-players-grid");
    if (playerContainer) {
      if (!favs.players || favs.players.length === 0) {
        playerContainer.innerHTML = `<p style="grid-column: 1/-1; color: var(--text-muted); font-size: 0.9rem;">No favorited players yet.</p>`;
      } else {
        const players = favs.players.map(id => window.footballApi.getPlayerById(id)).filter(Boolean);
        playerContainer.innerHTML = players.map(p => `
          <div class="entity-card" onclick="window.appRouter.openPlayer('${p.id}')">
            <div style="display: flex; align-items: center; gap: 0.85rem;">
              <div style="font-size: 2rem;">${p.flag || "👤"}</div>
              <div>
                <h3 style="font-size: 1.1rem;">${p.name}</h3>
                <div style="font-size: 0.75rem; color: var(--text-secondary);">${p.position} • ${p.stats.goals} Goals</div>
              </div>
            </div>
          </div>
        `).join("");
      }
    }
  }

  toggleFavorite(type, id, btnElement) {
    const added = window.storageService.toggleFavorite(type, id);
    if (btnElement) {
      btnElement.classList.toggle("active", added);
      btnElement.classList.toggle("favorited", added);
    }
    this.updateFavoriteButtonsState();
  }

  updateFavoriteButtonsState() {
    // Re-render favorite views if active
    if (this.currentView === "favorites") {
      this.renderFavoritesView();
    }
  }

  openTeam(teamId, updateHash = true) {
    if (updateHash) {
      window.location.hash = `team/${teamId}`;
      return;
    }
    if (window.teamModal) window.teamModal.open(teamId);
  }

  openPlayer(playerId, updateHash = true) {
    if (updateHash) {
      window.location.hash = `player/${playerId}`;
      return;
    }
    if (window.playerModal) window.playerModal.open(playerId);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.appRouter = new AppRouter();
});
