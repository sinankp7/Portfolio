/**
 * Football World Hub - League Tables & Standings Component
 * Displays standings with Pos, Team, P, W, D, L, GF, GA, GD, Pts, Form.
 * Features distinct qualification indicators for UCL, UEL, UECL, Relegation, and Promotion.
 */

class StandingsComponent {
  constructor() {
    this.currentLeague = "premier-league";
    this.init();
  }

  init() {
    const selector = document.getElementById("standings-league-select");
    if (selector) {
      selector.addEventListener("change", (e) => {
        this.currentLeague = e.target.value;
        this.render();
      });
    }
  }

  render(containerId = "standings-table-container", leagueId = null) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const targetLeague = leagueId || this.currentLeague;
    const standings = window.footballApi.getStandings(targetLeague);
    const competition = window.footballApi.getCompetitionById(targetLeague);

    if (standings.length === 0) {
      container.innerHTML = `
        <div style="padding: 2.5rem; text-align: center; color: var(--text-muted);">
          <p>No table data currently available for this competition.</p>
        </div>
      `;
      return;
    }

    let rowsHtml = standings.map(row => {
      let zoneClass = "";
      if (row.qualification === "ucl") zoneClass = "zone-ucl";
      else if (row.qualification === "uel") zoneClass = "zone-uel";
      else if (row.qualification === "uecl") zoneClass = "zone-uecl";
      else if (row.qualification === "relegation") zoneClass = "zone-relegation";
      else if (row.qualification === "promotion") zoneClass = "zone-promotion";

      const formHtml = row.form.map(f => {
        const lower = f.toLowerCase();
        return `<span class="form-pill ${lower}">${f}</span>`;
      }).join("");

      return `
        <tr class="${zoneClass}">
          <td style="font-weight: 700; width: 45px; text-align: center;">${row.pos}</td>
          <td>
            <div class="team-cell" style="cursor: pointer;" onclick="window.appRouter.openTeam('${row.teamId}')">
              <div class="table-team-crest" style="border: 1px solid ${row.teamColors.primary || '#fff'}">
                ${row.teamFlag || "⚽"}
              </div>
              <div>
                <strong style="color: #ffffff;">${row.teamName}</strong>
              </div>
            </div>
          </td>
          <td style="text-align: center;">${row.played}</td>
          <td style="text-align: center;">${row.won}</td>
          <td style="text-align: center;">${row.drawn}</td>
          <td style="text-align: center;">${row.lost}</td>
          <td style="text-align: center; color: var(--text-muted);">${row.gf}</td>
          <td style="text-align: center; color: var(--text-muted);">${row.ga}</td>
          <td style="text-align: center; font-weight: 700; color: ${row.gd > 0 ? 'var(--accent-green)' : row.gd < 0 ? '#ef4444' : 'var(--text-secondary)'};">
            ${row.gd > 0 ? '+' + row.gd : row.gd}
          </td>
          <td style="text-align: center; font-weight: 900; font-size: 1.05rem; color: #ffffff;">${row.points}</td>
          <td style="text-align: center;"><div class="form-badges" style="justify-content: center;">${formHtml}</div></td>
        </tr>
      `;
    }).join("");

    container.innerHTML = `
      <div class="table-container">
        <table class="standings-table">
          <thead>
            <tr>
              <th style="width: 45px; text-align: center;">#</th>
              <th>Club</th>
              <th style="text-align: center;">MP</th>
              <th style="text-align: center;">W</th>
              <th style="text-align: center;">D</th>
              <th style="text-align: center;">L</th>
              <th style="text-align: center;">GF</th>
              <th style="text-align: center;">GA</th>
              <th style="text-align: center;">GD</th>
              <th style="text-align: center;">Pts</th>
              <th style="text-align: center;">Form</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>

      <div class="table-legend-bar">
        <div class="legend-item">
          <span class="legend-color" style="background: var(--accent-cyan); box-shadow: 0 0 8px var(--accent-cyan);"></span>
          <span>UEFA Champions League Qualification</span>
        </div>
        <div class="legend-item">
          <span class="legend-color" style="background: var(--accent-amber);"></span>
          <span>Europa League</span>
        </div>
        <div class="legend-item">
          <span class="legend-color" style="background: var(--accent-green);"></span>
          <span>Conference League / Playoff</span>
        </div>
        <div class="legend-item">
          <span class="legend-color" style="background: var(--accent-red);"></span>
          <span>Relegation</span>
        </div>
      </div>
    `;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.standingsComponent = new StandingsComponent();
});
