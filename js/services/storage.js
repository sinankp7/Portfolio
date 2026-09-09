/**
 * Football World Hub - Storage & Favorites Service
 * Manages user bookmarks for Competitions, Teams, and Players with reactive events.
 */

class StorageService {
  constructor() {
    this.STORAGE_KEY = "fwh_favorites_v1";
    this.SETTINGS_KEY = "fwh_settings_v1";
    this.defaults = {
      competitions: ["premier-league", "uefa-champions-league", "la-liga"],
      teams: ["barecelona ", "mancity"],
      players: ["haaland", "yamal"]
    };
    this.init();
  }

  init() {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.defaults));
    }
  }

  getFavorites() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : this.defaults;
    } catch (e) {
      console.error("Failed to load favorites", e);
      return this.defaults;
    }
  }

  saveFavorites(favorites) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
      window.dispatchEvent(new CustomEvent("fwh:favorites-updated", { detail: favorites }));
    } catch (e) {
      console.error("Failed to save favorites", e);
    }
  }

  isFavorite(type, id) {
    const favs = this.getFavorites();
    return Array.isArray(favs[type]) && favs[type].includes(id);
  }

  toggleFavorite(type, id) {
    const favs = this.getFavorites();
    if (!Array.isArray(favs[type])) {
      favs[type] = [];
    }

    const index = favs[type].indexOf(id);
    let added = false;
    if (index > -1) {
      favs[type].splice(index, 1);
      added = false;
    } else {
      favs[type].push(id);
      added = true;
    }

    this.saveFavorites(favs);
    return added;
  }

  getApiSettings() {
    try {
      const raw = localStorage.getItem(this.SETTINGS_KEY);
      return raw ? JSON.parse(raw) : {
        provider: "local_verified",
        apiKey: "",
        useLiveData: false
      };
    } catch (e) {
      return { provider: "local_verified", apiKey: "", useLiveData: false };
    }
  }

  saveApiSettings(settings) {
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent("fwh:settings-updated", { detail: settings }));
  }
}

window.storageService = new StorageService();
