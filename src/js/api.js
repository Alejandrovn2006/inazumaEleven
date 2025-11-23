(function (global) {
  async function fetchPlayers() {
    const url = "./db/db.json";
    try {
      const resp = await fetch(url);
      if (!resp.ok) throw new Error("HTTP " + resp.status);
      const data = await resp.json();
      return data.players || [];
    } catch (err) {
      console.error("API.fetchPlayers error:", err);
      throw err;
    }
  }

  global.API = {
    fetchPlayers,
  };
})(window);
