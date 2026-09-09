/**
 * Football World Hub - Match Center Component
 * Provides complete match filtering, cards, live clock tracking,
 * and deep match detail modal with soccer-pitch formation visualizer and event timeline.
 */

class MatchCenterComponent {
  constructor() {
    this.currentStatusFilter = "ALL";
    this.currentCompFilter = "ALL";
    this.currentTeamFilter = "ALL";
    this.modalEl = document.getElementById("match-modal-overlay");
    this.closeBtn = document.getElementById("close-match-modal");
    this.init();
  }

  init() {
    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", () => this.closeModal());
    }
    if (this.modalEl) {
      this.modalEl.addEventListener("click", (e) => {
        if (e.target === this.modalEl) this.closeModal();
      });
    }
  }

  render(containerId = "matches-grid-container", options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let filter = {};
    if (options.status && options.status !== "ALL") filter.status = options.status;
    else if (this.currentStatusFilter !== "ALL") filter.status = this.currentStatusFilter;

    if (options.competitionId && options.competitionId !== "ALL") filter.competitionId = options.competitionId;
    else if (this.currentCompFilter !== "ALL") filter.competitionId = this.currentCompFilter;

    if (options.teamId && options.teamId !== "ALL") filter.teamId = options.teamId;
    else if (this.currentTeamFilter !== "ALL") filter.teamId = this.currentTeamFilter;

    if (options.date) filter.date = options.date;

    const matches = window.footballApi.getMatches(filter);

    if (matches.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; padding: 3rem 1rem; text-align: center; color: var(--text-muted); background: var(--bg-surface); border-radius: var(--radius-md); border: 1px dashed var(--border-subtle);">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">⚽</div>
          <h3 style="color: var(--text-secondary); margin-bottom: 0.3rem;">No Matches Found</h3>
          <p style="font-size: 0.85rem;">Try adjusting your status or league filters to view other fixtures.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = matches.map(m => this.renderMatchCard(m)).join("");
  }

  renderMatchCard(m) {
    const isLive = m.status === "LIVE";
    const isUpcoming = m.status === "UPCOMING";
    const isFinished = m.status === "FINISHED";

    let statusHtml = "";
    if (isLive) {
      statusHtml = `
        <span class="match-status-badge live">
          <span class="pulse-live"></span>
          <span>${m.minute}' LIVE</span>
        </span>
      `;
    } else if (isUpcoming) {
      const dateObj = new Date(m.kickoff);
      const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      statusHtml = `
        <span class="match-status-badge upcoming">
          <span>${timeStr}</span>
        </span>
      `;
    } else {
      statusHtml = `
        <span class="match-status-badge finished">
          <span>FT</span>
        </span>
      `;
    }

    const homeScore = isUpcoming ? "-" : m.homeScore;
    const awayScore = isUpcoming ? "-" : m.awayScore;

    return `
      <div class="match-card ${isLive ? 'live-glow' : ''}" onclick="window.matchCenter.openModal('${m.id}')">
        <div class="match-card-header">
          <div class="match-comp-badge">
            <span>${m.competition.flag || "🏆"}</span>
            <span>${m.competition.shortName || m.competition.name}</span>
          </div>
          ${statusHtml}
        </div>

        <div class="match-card-body">
          <div class="team-box">
            <div class="team-crest" style="border-color: ${m.homeTeam.colors ? m.homeTeam.colors.primary : '#fff'}">
              <span>${m.homeTeam.flag || "⚽"}</span>
            </div>
            <span class="team-name">${m.homeTeam.name}</span>
          </div>

          <div class="match-score-center">
            <div class="score-display">
              ${isUpcoming ? '<span class="score-vs">VS</span>' : `<span>${homeScore}</span><span style="color:var(--text-muted)">:</span><span>${awayScore}</span>`}
            </div>
            ${isLive ? `<span class="match-minute">${m.minute}'</span>` : ''}
            ${isUpcoming ? `<span style="font-size:0.7rem; color:var(--text-muted); margin-top:0.2rem;">${new Date(m.kickoff).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>` : ''}
          </div>

          <div class="team-box">
            <div class="team-crest" style="border-color: ${m.awayTeam.colors ? m.awayTeam.colors.primary : '#fff'}">
              <span>${m.awayTeam.flag || "⚽"}</span>
            </div>
            <span class="team-name">${m.awayTeam.name}</span>
          </div>
        </div>

        <div class="match-card-footer">
          <div class="match-venue">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <span>${m.venue || "Stadium TBD"}</span>
          </div>
          <span style="color: var(--accent-green); font-size: 0.72rem; font-weight: 600;">Match Details →</span>
        </div>
      </div>
    `;
  }

  openModal(matchId) {
    const match = window.footballApi.getMatchById(matchId);
    if (!match || !this.modalEl) return;

    const modalTitle = document.getElementById("match-modal-title");
    const modalContent = document.getElementById("match-modal-content");

    if (modalTitle) {
      modalTitle.innerText = `${match.homeTeam.name} vs ${match.awayTeam.name}`;
    }

    const isUpcoming = match.status === "UPCOMING";
    const dateFormatted = new Date(match.kickoff).toLocaleDateString([], {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    let statsHtml = "";
    if (match.stats) {
      const pHome = match.stats.possession[0];
      const pAway = match.stats.possession[1];
      const sHome = match.stats.shots[0];
      const sAway = match.stats.shots[1];
      const sotHome = match.stats.shotsOnTarget[0];
      const sotAway = match.stats.shotsOnTarget[1];
      const cHome = match.stats.corners[0];
      const cAway = match.stats.corners[1];
      const fHome = match.stats.fouls[0];
      const fAway = match.stats.fouls[1];

      statsHtml = `
        <div style="margin-top: 1.5rem;">
          <h4 style="font-size: 0.95rem; margin-bottom: 1rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em;">Match Statistics</h4>
          
          <div class="stat-bar-container">
            <div class="stat-bar-labels"><span>${pHome}%</span><span style="color:var(--text-muted)">Ball Possession</span><span>${pAway}%</span></div>
            <div class="stat-bar-track">
              <div class="stat-bar-home" style="width: ${pHome}%"></div>
              <div class="stat-bar-away" style="width: ${pAway}%"></div>
            </div>
          </div>

          <div class="stat-bar-container">
            <div class="stat-bar-labels"><span>${sHome}</span><span style="color:var(--text-muted)">Total Shots</span><span>${sAway}</span></div>
            <div class="stat-bar-track">
              <div class="stat-bar-home" style="width: ${(sHome / (sHome + sAway)) * 100}%"></div>
              <div class="stat-bar-away" style="width: ${(sAway / (sHome + sAway)) * 100}%"></div>
            </div>
          </div>

          <div class="stat-bar-container">
            <div class="stat-bar-labels"><span>${sotHome}</span><span style="color:var(--text-muted)">Shots on Target</span><span>${sotAway}</span></div>
            <div class="stat-bar-track">
              <div class="stat-bar-home" style="width: ${(sotHome / (sotHome + sotAway || 1)) * 100}%"></div>
              <div class="stat-bar-away" style="width: ${(sotAway / (sotHome + sotAway || 1)) * 100}%"></div>
            </div>
          </div>

          <div class="stat-bar-container">
            <div class="stat-bar-labels"><span>${cHome}</span><span style="color:var(--text-muted)">Corners</span><span>${cAway}</span></div>
            <div class="stat-bar-track">
              <div class="stat-bar-home" style="width: ${(cHome / (cHome + cAway || 1)) * 100}%"></div>
              <div class="stat-bar-away" style="width: ${(cAway / (cHome + cAway || 1)) * 100}%"></div>
            </div>
          </div>

          <div class="stat-bar-container">
            <div class="stat-bar-labels"><span>${fHome}</span><span style="color:var(--text-muted)">Fouls</span><span>${fAway}</span></div>
            <div class="stat-bar-track">
              <div class="stat-bar-home" style="width: ${(fHome / (fHome + fAway || 1)) * 100}%"></div>
              <div class="stat-bar-away" style="width: ${(fAway / (fHome + fAway || 1)) * 100}%"></div>
            </div>
          </div>
        </div>
      `;
    }

    let eventsHtml = "";
    if (match.events && match.events.length > 0) {
      eventsHtml = `
        <div style="margin-top: 1.5rem;">
          <h4 style="font-size: 0.95rem; margin-bottom: 0.75rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em;">Timeline of Events</h4>
          <div style="display: flex; flex-direction: column; gap: 0.6rem;">
            ${match.events.map(ev => {
              const icon = ev.type === "goal" ? "⚽ GOAL!" : ev.cardType === "yellow" ? "🟨 Card" : ev.cardType === "red" ? "🟥 Red Card" : "🔄 Sub";
              const isHome = ev.team === match.homeTeamId;
              return `
                <div style="display: flex; align-items: center; justify-content: ${isHome ? 'flex-start' : 'flex-end'}; font-size: 0.82rem; background: rgba(255,255,255,0.03); padding: 0.5rem 0.75rem; border-radius: 6px;">
                  <span style="font-weight: 700; color: var(--accent-green); margin-right: 0.5rem;">${ev.minute}'</span>
                  <span>${icon} <strong>${ev.player}</strong> ${ev.assist ? `<span style="color: var(--text-muted);">(Assist: ${ev.assist})</span>` : ''}</span>
                </div>
              `;
            }).join("")}
          </div>
        </div>
      `;
    }

    let pitchHtml = "";
    if (match.lineups) {
      const homeStarting = match.lineups.home.starting.slice(0, 5);
      const awayStarting = match.lineups.away.starting.slice(0, 5);

      pitchHtml = `
        <div style="margin-top: 1.5rem;">
          <h4 style="font-size: 0.95rem; margin-bottom: 0.5rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em;">Tactical Formation & Lineups</h4>
          <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.4rem;">
            <span>${match.homeTeam.name} (${match.lineups.home.formation})</span>
            <span>${match.awayTeam.name} (${match.lineups.away.formation})</span>
          </div>

          <div class="soccer-pitch">
            <div class="pitch-lineup-row">
              ${homeStarting.map((name, i) => `
                <div class="pitch-player">
                  <div class="pitch-player-dot">${i + 1}</div>
                  <span class="pitch-player-name">${name}</span>
                </div>
              `).join("")}
            </div>
            <div class="pitch-lineup-row">
              ${awayStarting.map((name, i) => `
                <div class="pitch-player away">
                  <div class="pitch-player-dot">${i + 1}</div>
                  <span class="pitch-player-name">${name}</span>
                </div>
              `).join("")}
            </div>
          </div>
        </div>
      `;
    }

    modalContent.innerHTML = `
      <div style="background: linear-gradient(180deg, rgba(14,26,44,0.6) 0%, rgba(8,14,24,0.9) 100%); border-radius: var(--radius-md); padding: 1.5rem; border: 1px solid var(--border-subtle); text-align: center;">
        <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1rem;">
          <span>${match.competition.flag || "🏆"}</span>
          <span>${match.competition.name}</span>
          <span>•</span>
          <span>${match.round || "Matchday"}</span>
        </div>

        <div style="display: flex; align-items: center; justify-content: space-around; margin: 1rem 0;">
          <div style="width: 35%; cursor: pointer;" onclick="window.appRouter.openTeam('${match.homeTeam.id}'); window.matchCenter.closeModal();">
            <div style="font-size: 3rem; margin-bottom: 0.5rem;">${match.homeTeam.flag || "⚽"}</div>
            <h3 style="font-size: 1.15rem;">${match.homeTeam.name}</h3>
          </div>

          <div style="width: 30%;">
            <div style="font-family: var(--font-heading); font-size: 2.8rem; font-weight: 900; color: #ffffff;">
              ${isUpcoming ? '<span style="font-size: 1.8rem; color: var(--text-muted);">VS</span>' : `${match.homeScore} - ${match.awayScore}`}
            </div>
            ${match.status === "LIVE" ? `<span class="match-status-badge live" style="margin-top:0.3rem;"><span class="pulse-live"></span> ${match.minute}' LIVE</span>` : ''}
            ${match.status === "FINISHED" ? `<span class="match-status-badge finished" style="margin-top:0.3rem;">Full Time</span>` : ''}
          </div>

          <div style="width: 35%; cursor: pointer;" onclick="window.appRouter.openTeam('${match.awayTeam.id}'); window.matchCenter.closeModal();">
            <div style="font-size: 3rem; margin-bottom: 0.5rem;">${match.awayTeam.flag || "⚽"}</div>
            <h3 style="font-size: 1.15rem;">${match.awayTeam.name}</h3>
          </div>
        </div>

        <div style="font-size: 0.8rem; color: var(--text-muted); border-top: 1px solid var(--border-subtle); padding-top: 0.75rem; margin-top: 1rem; display: flex; justify-content: center; gap: 1.5rem; flex-wrap: wrap;">
          <span>📅 ${dateFormatted}</span>
          <span>🏟️ ${match.venue || "Stadium TBD"}</span>
          <span>👨‍⚖️ Ref: ${match.referee || "TBD"}</span>
        </div>
      </div>

      ${eventsHtml}
      ${pitchHtml}
      ${statsHtml}
    `;

    this.modalEl.classList.add("active");
  }

  closeModal() {
    if (this.modalEl) {
      this.modalEl.classList.remove("active");
    }
  }

  filterByStatus(status) {
    this.currentStatusFilter = status;
    document.querySelectorAll(".match-status-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.status === status);
    });
    this.render();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.matchCenter = new MatchCenterComponent();
});
