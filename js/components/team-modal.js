/**
 * Football World Hub - Team Profile Component
 * Renders complete club/national-team details: stadium, trophies, squad, fixtures, and form.
 */

class TeamModalComponent {
  constructor() {
    this.modalEl = document.getElementById("team-modal-overlay");
    this.closeBtn = document.getElementById("close-team-modal");
    this.init();
  }

  init() {
    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", () => this.close());
    }
    if (this.modalEl) {
      this.modalEl.addEventListener("click", (e) => {
        if (e.target === this.modalEl) this.close();
      });
    }
  }

  open(teamId) {
    const team = window.footballApi.getTeamById(teamId);
    if (!team || !this.modalEl) return;

    const titleEl = document.getElementById("team-modal-title");
    const contentEl = document.getElementById("team-modal-content");

    if (titleEl) titleEl.innerText = team.name;

    const comp = window.footballApi.getCompetitionById(team.leagueId);
    const players = window.footballApi.getPlayers({ teamId: team.id });
    const isFav = window.storageService ? window.storageService.isFavorite("teams", team.id) : false;

    // Team matches
    const matches = window.footballApi.getMatches({ teamId: team.id });

    // Trophies HTML
    let trophiesHtml = "";
    if (team.trophies && team.trophies.length > 0) {
      trophiesHtml = `
        <div style="margin-top: 1.5rem;">
          <h4 style="font-size: 0.95rem; margin-bottom: 0.75rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em;">Trophy Cabinet & Honors</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 0.75rem;">
            ${team.trophies.map(tr => `
              <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); padding: 0.75rem; border-radius: var(--radius-sm);">
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.2rem;">
                  <span style="font-size: 1.2rem;">🏆</span>
                  <strong style="color: #ffffff; font-size: 0.9rem;">${tr.name} (${tr.count})</strong>
                </div>
                <div style="font-size: 0.72rem; color: var(--text-muted);">${tr.years}</div>
              </div>
            `).join("")}
          </div>
        </div>
      `;
    }

    // Squad HTML
    let squadHtml = "";
    if (players.length > 0) {
      squadHtml = `
        <div style="margin-top: 1.5rem;">
          <h4 style="font-size: 0.95rem; margin-bottom: 0.75rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em;">Squad (${players.length} Key Players)</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 0.75rem;">
            ${players.map(p => `
              <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); padding: 0.65rem 0.85rem; border-radius: var(--radius-sm); cursor: pointer;" onclick="window.appRouter.openPlayer('${p.id}'); window.teamModal.close();">
                <div style="display: flex; align-items: center; gap: 0.6rem;">
                  <span style="font-size: 1.2rem;">${p.flag}</span>
                  <div>
                    <div style="font-weight: 700; font-size: 0.9rem; color: #ffffff;">${p.name}</div>
                    <div style="font-size: 0.72rem; color: var(--text-muted);">${p.position} • #${p.number}</div>
                  </div>
                </div>
                <span class="tag-pill" style="font-size: 0.7rem;">${p.stats.goals}G ${p.stats.assists}A</span>
              </div>
            `).join("")}
          </div>
        </div>
      `;
    }

    // Form Pills
    const formHtml = team.currentForm.map(f => {
      const lower = f.toLowerCase();
      return `<span class="form-pill ${lower}">${f}</span>`;
    }).join("");

    contentEl.innerHTML = `
      <div style="background: linear-gradient(135deg, rgba(14,26,44,0.7) 0%, rgba(8,14,24,0.95) 100%); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1.5rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap;">
          <div style="display: flex; align-items: center; gap: 1.25rem;">
            <div style="width: 72px; height: 72px; border-radius: 50%; background: rgba(255,255,255,0.05); border: 3px solid ${team.colors ? team.colors.primary : '#fff'}; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; box-shadow: var(--shadow-sm);">
              ${team.flag || "⚽"}
            </div>
            <div>
              <h2 style="font-size: 1.6rem; line-height: 1.2; margin-bottom: 0.2rem;">${team.name}</h2>
              <div style="display: flex; align-items: center; gap: 0.6rem; font-size: 0.85rem; color: var(--text-secondary); flex-wrap: wrap;">
                <span>${team.city ? team.city + ', ' : ''}${team.country}</span>
                <span>•</span>
                <span>League: <strong style="color: var(--accent-green); cursor: pointer;" onclick="window.appRouter.openCompetition('${team.leagueId}'); window.teamModal.close();">${comp ? comp.name : team.leagueId}</strong></span>
              </div>
            </div>
          </div>

          <button class="filter-btn ${isFav ? 'active' : ''}" onclick="window.appRouter.toggleFavorite('teams', '${team.id}', this)" style="display: flex; align-items: center; gap: 0.4rem;">
            <span>★</span>
            <span>${isFav ? 'Favorited' : 'Favorite Club'}</span>
          </button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 1rem; margin-top: 1.5rem; border-top: 1px solid var(--border-subtle); padding-top: 1rem;">
          <div>
            <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Manager</span>
            <div style="font-weight: 700; color: #fff;">${team.manager}</div>
          </div>
          <div>
            <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Stadium</span>
            <div style="font-weight: 700; color: #fff;">${team.stadium ? team.stadium.name : 'N/A'}</div>
            <div style="font-size: 0.72rem; color: var(--text-muted);">${team.stadium && team.stadium.capacity ? team.stadium.capacity.toLocaleString() + ' Seats' : ''}</div>
          </div>
          <div>
            <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Founded</span>
            <div style="font-weight: 700; color: #fff;">${team.founded}</div>
          </div>
          <div>
            <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Recent Form</span>
            <div style="display: flex; gap: 0.3rem; margin-top: 0.2rem;">${formHtml}</div>
          </div>
        </div>
      </div>

      ${squadHtml}
      ${trophiesHtml}
    `;

    this.modalEl.classList.add("active");
  }

  close() {
    if (this.modalEl) {
      this.modalEl.classList.remove("active");
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.teamModal = new TeamModalComponent();
});
