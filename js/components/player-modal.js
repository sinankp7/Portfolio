/**
 * Football World Hub - Player Profile Component
 * Renders player details with verified statistics, biometric data, and club ties.
 */

class PlayerModalComponent {
  constructor() {
    this.modalEl = document.getElementById("player-modal-overlay");
    this.closeBtn = document.getElementById("close-player-modal");
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

  open(playerId) {
    const player = window.footballApi.getPlayerById(playerId);
    if (!player || !this.modalEl) return;

    const titleEl = document.getElementById("player-modal-title");
    const contentEl = document.getElementById("player-modal-content");

    if (titleEl) titleEl.innerText = `${player.name} (#${player.number})`;

    const team = window.footballApi.getTeamById(player.teamId);
    const isFav = window.storageService ? window.storageService.isFavorite("players", player.id) : false;

    contentEl.innerHTML = `
      <div style="background: linear-gradient(135deg, rgba(14,26,44,0.7) 0%, rgba(8,14,24,0.95) 100%); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1.5rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap;">
          <div style="display: flex; align-items: center; gap: 1.25rem;">
            <div class="player-avatar" style="width: 72px; height: 72px; font-size: 2.2rem;">
              ${player.flag || "👤"}
            </div>
            <div>
              <h2 style="font-size: 1.6rem; line-height: 1.2; margin-bottom: 0.2rem;">${player.name}</h2>
              <div style="display: flex; align-items: center; gap: 0.6rem; font-size: 0.85rem; color: var(--text-secondary); flex-wrap: wrap;">
                <span>${player.nationality} ${player.flag}</span>
                <span>•</span>
                <span>Position: <strong style="color: #ffffff;">${player.position}</strong></span>
                <span>•</span>
                <span>Club: <strong style="color: var(--accent-green); cursor: pointer;" onclick="window.appRouter.openTeam('${player.teamId}'); window.playerModal.close();">${team ? team.name : player.teamId}</strong></span>
              </div>
            </div>
          </div>

          <button class="filter-btn ${isFav ? 'active' : ''}" onclick="window.appRouter.toggleFavorite('players', '${player.id}', this)" style="display: flex; align-items: center; gap: 0.4rem;">
            <span>★</span>
            <span>${isFav ? 'Favorited' : 'Favorite Player'}</span>
          </button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 1rem; margin-top: 1.5rem; border-top: 1px solid var(--border-subtle); padding-top: 1rem;">
          <div>
            <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Age</span>
            <div style="font-weight: 700; color: #fff;">${player.age} yrs</div>
          </div>
          <div>
            <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Height</span>
            <div style="font-weight: 700; color: #fff;">${player.height}</div>
          </div>
          <div>
            <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Preferred Foot</span>
            <div style="font-weight: 700; color: #fff;">${player.preferredFoot}</div>
          </div>
          <div>
            <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Squad Number</span>
            <div style="font-weight: 700; color: var(--accent-green);">#${player.number}</div>
          </div>
        </div>
      </div>

      <div style="margin-top: 1.5rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
          <h4 style="font-size: 0.95rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em;">Verified Season Statistics</h4>
          <span style="font-size: 0.72rem; color: var(--accent-green); background: rgba(0,230,118,0.1); padding: 0.15rem 0.5rem; border-radius: 4px;">Verified Archive</span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 0.85rem;">
          <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 1rem; text-align: center;">
            <div style="font-family: var(--font-heading); font-size: 1.8rem; font-weight: 800; color: var(--accent-green);">${player.stats.goals}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Goals</div>
          </div>
          <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 1rem; text-align: center;">
            <div style="font-family: var(--font-heading); font-size: 1.8rem; font-weight: 800; color: var(--accent-cyan);">${player.stats.assists}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Assists</div>
          </div>
          <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 1rem; text-align: center;">
            <div style="font-family: var(--font-heading); font-size: 1.8rem; font-weight: 800; color: #ffffff;">${player.stats.appearances}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Matches</div>
          </div>
          <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 1rem; text-align: center;">
            <div style="font-family: var(--font-heading); font-size: 1.8rem; font-weight: 800; color: #ffffff;">${player.stats.passAccuracy}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Pass Accuracy</div>
          </div>
          <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 1rem; text-align: center;">
            <div style="font-family: var(--font-heading); font-size: 1.8rem; font-weight: 800; color: #ffffff;">${player.stats.minutesPlayed}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Minutes</div>
          </div>
          <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 1rem; text-align: center;">
            <div style="font-family: var(--font-heading); font-size: 1.8rem; font-weight: 800; color: #f59e0b;">${player.stats.yellowCards}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Yellow Cards</div>
          </div>
        </div>

        <div style="margin-top: 1rem; font-size: 0.75rem; color: var(--text-muted); text-align: center;">
          Data reflects domestic and international official match records across all certified competitions.
        </div>
      </div>
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
  window.playerModal = new PlayerModalComponent();
});
