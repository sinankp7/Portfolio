/**
 * Football World Hub - Football Data & API Service
 * Centralized data provider with modular architecture supporting both
 * the verified internal archive and external live football data providers.
 */

class FootballApiService {
  constructor() {
    this.db = window.FOOTBALL_DB || {
      metadata: {},
      confederations: [],
      competitions: [],
      teams: [],
      players: [],
      standings: {},
      matches: [],
      countries: []
    };
    this.settings = window.storageService ? window.storageService.getApiSettings() : { provider: "local_verified" };
  }

  getMetadata() {
    return {
      ...this.db.metadata,
      activeProvider: this.settings.provider,
      isLiveConnected: !!(this.settings.useLiveData && this.settings.apiKey)
    };
  }

  getConfederations() {
    return this.db.confederations;
  }

  getConfederationById(id) {
    return this.db.confederations.find(c => c.id.toUpperCase() === id.toUpperCase());
  }

  getCompetitions(filter = {}) {
    let list = [...this.db.competitions];

    if (filter.confederation) {
      list = list.filter(c => c.confederationId.toUpperCase() === filter.confederation.toUpperCase());
    }
    if (filter.type) {
      list = list.filter(c => c.type.toLowerCase() === filter.type.toLowerCase());
    }
    if (filter.category) {
      list = list.filter(c => c.category.toLowerCase() === filter.category.toLowerCase());
    }
    if (filter.entityType) {
      list = list.filter(c => c.entityType.toLowerCase() === filter.entityType.toLowerCase());
    }
    if (filter.isFeatured !== undefined) {
      list = list.filter(c => Boolean(c.isFeatured) === Boolean(filter.isFeatured));
    }
    if (filter.isPopular !== undefined) {
      list = list.filter(c => Boolean(c.isPopular) === Boolean(filter.isPopular));
    }
    if (filter.search) {
      const q = filter.search.toLowerCase().trim();
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.shortName.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q) ||
        c.governingBody.toLowerCase().includes(q)
      );
    }
    return list;
  }

  getCompetitionById(id) {
    return this.db.competitions.find(c => c.id === id);
  }

  getTeams(filter = {}) {
    let list = [...this.db.teams];
    if (filter.leagueId) {
      list = list.filter(t => t.leagueId === filter.leagueId);
    }
    if (filter.country) {
      list = list.filter(t => t.country.toLowerCase() === filter.country.toLowerCase());
    }
    if (filter.search) {
      const q = filter.search.toLowerCase().trim();
      list = list.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.shortName.toLowerCase().includes(q) ||
        t.city.toLowerCase().includes(q) ||
        t.stadium.name.toLowerCase().includes(q)
      );
    }
    return list;
  }

  getTeamById(id) {
    return this.db.teams.find(t => t.id === id);
  }

  getPlayers(filter = {}) {
    let list = [...this.db.players];
    if (filter.teamId) {
      list = list.filter(p => p.teamId === filter.teamId);
    }
    if (filter.position) {
      list = list.filter(p => p.position.toLowerCase() === filter.position.toLowerCase());
    }
    if (filter.nationality) {
      list = list.filter(p => p.nationality.toLowerCase() === filter.nationality.toLowerCase());
    }
    if (filter.search) {
      const q = filter.search.toLowerCase().trim();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.nationality.toLowerCase().includes(q) ||
        p.position.toLowerCase().includes(q)
      );
    }
    return list;
  }

  getPlayerById(id) {
    return this.db.players.find(p => p.id === id);
  }

  getStandings(leagueId) {
    const raw = this.db.standings[leagueId] || [];
    return raw.map(row => {
      const team = this.getTeamById(row.teamId);
      return {
        ...row,
        teamName: team ? team.name : row.teamId,
        teamShort: team ? team.shortName : row.teamId,
        teamFlag: team ? team.flag : "⚽",
        teamColors: team ? team.colors : { primary: "#333", secondary: "#fff" }
      };
    });
  }

  getMatches(filter = {}) {
    let list = [...this.db.matches];

    if (filter.status) {
      if (filter.status === "LIVE") {
        list = list.filter(m => m.status === "LIVE");
      } else if (filter.status === "UPCOMING") {
        list = list.filter(m => m.status === "UPCOMING");
      } else if (filter.status === "FINISHED") {
        list = list.filter(m => m.status === "FINISHED");
      }
    }

    if (filter.competitionId) {
      list = list.filter(m => m.competitionId === filter.competitionId);
    }

    if (filter.teamId) {
      list = list.filter(m => m.homeTeamId === filter.teamId || m.awayTeamId === filter.teamId);
    }

    if (filter.date) {
      // Date in format YYYY-MM-DD
      list = list.filter(m => m.kickoff && m.kickoff.startsWith(filter.date));
    }

    // Enrich match with team details
    return list.map(m => {
      const homeTeam = this.getTeamById(m.homeTeamId);
      const awayTeam = this.getTeamById(m.awayTeamId);
      const comp = this.getCompetitionById(m.competitionId);
      return {
        ...m,
        homeTeam: homeTeam || { name: m.homeTeamId, shortName: m.homeTeamId, flag: "⚽", colors: { primary: "#333" } },
        awayTeam: awayTeam || { name: m.awayTeamId, shortName: m.awayTeamId, flag: "⚽", colors: { primary: "#333" } },
        competition: comp || { name: m.competitionName, governingBody: "Unknown" }
      };
    });
  }

  getMatchById(id) {
    const match = this.db.matches.find(m => m.id === id);
    if (!match) return null;
    const homeTeam = this.getTeamById(match.homeTeamId);
    const awayTeam = this.getTeamById(match.awayTeamId);
    const comp = this.getCompetitionById(match.competitionId);
    return {
      ...match,
      homeTeam: homeTeam || { name: match.homeTeamId, shortName: match.homeTeamId, flag: "⚽", colors: { primary: "#333" } },
      awayTeam: awayTeam || { name: match.awayTeamId, shortName: match.awayTeamId, flag: "⚽", colors: { primary: "#333" } },
      competition: comp || { name: match.competitionName, governingBody: "Unknown" }
    };
  }

  getCountries(confederation) {
    let list = [...this.db.countries];
    if (confederation) {
      list = list.filter(c => c.confederation.toUpperCase() === confederation.toUpperCase());
    }
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }

  globalSearch(query) {
    if (!query || query.trim().length < 2) return null;
    const q = query.toLowerCase().trim();

    const competitions = this.db.competitions.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.shortName.toLowerCase().includes(q) ||
      c.country.toLowerCase().includes(q) ||
      c.governingBody.toLowerCase().includes(q)
    ).slice(0, 6);

    const clubs = this.db.teams.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.shortName.toLowerCase().includes(q) ||
      t.city.toLowerCase().includes(q)
    ).slice(0, 6);

    const stadiums = this.db.teams.filter(t =>
      t.stadium && t.stadium.name.toLowerCase().includes(q)
    ).map(t => ({
      stadiumName: t.stadium.name,
      capacity: t.stadium.capacity,
      team: t
    })).slice(0, 4);

    const players = this.db.players.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.nationality.toLowerCase().includes(q) ||
      p.position.toLowerCase().includes(q)
    ).slice(0, 6);

    const countries = this.db.countries.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.topLeague.toLowerCase().includes(q)
    ).slice(0, 5);

    return {
      query,
      competitions,
      clubs,
      stadiums,
      players,
      countries,
      totalMatches: competitions.length + clubs.length + stadiums.length + players.length + countries.length
    };
  }
}

window.footballApi = new FootballApiService();
