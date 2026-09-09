/**
 * Football World Hub - Country Directory Component
 * Country-by-country competition explorer grouped by confederation.
 */

class CountryDirectoryComponent {
  constructor() {
    this.currentConfed = "ALL";
    this.searchQuery = "";
  }

  render(containerId = "countries-grid-container") {
    const container = document.getElementById(containerId);
    if (!container) return;

    let list = window.footballApi.getCountries();

    if (this.currentConfed !== "ALL") {
      list = list.filter(c => c.confederation.toUpperCase() === this.currentConfed.toUpperCase());
    }

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase().trim();
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.topLeague.toLowerCase().includes(q) ||
        c.federation.toLowerCase().includes(q)
      );
    }

    if (list.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; padding: 2rem; text-align: center; color: var(--text-muted);">
          No countries match the current filter.
        </div>
      `;
      return;
    }

    container.innerHTML = list.map(c => `
      <div class="country-card" onclick="window.countryDirectory.selectCountry('${c.name}')">
        <div class="country-flag-box">${c.flag}</div>
        <div class="country-details" style="flex: 1;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <h4>${c.name}</h4>
            <span class="tag-pill" style="font-size: 0.68rem;">${c.confederation}</span>
          </div>
          <p style="margin-top: 0.2rem;"><strong>League:</strong> ${c.topLeague}</p>
          <p style="font-size: 0.72rem; color: var(--text-muted);">${c.federation}</p>
        </div>
      </div>
    `).join("");
  }

  filterByConfederation(confed) {
    this.currentConfed = confed;
    this.render();
  }

  filterBySearch(query) {
    this.searchQuery = query;
    this.render();
  }

  selectCountry(countryName) {
    // Switch to competitions tab filtered by that country
    window.appRouter.navigateTo("competitions");
    const compSearch = document.getElementById("comp-search-input");
    if (compSearch) {
      compSearch.value = countryName;
      compSearch.dispatchEvent(new Event("input"));
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.countryDirectory = new CountryDirectoryComponent();
});
