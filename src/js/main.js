import "../scss/style.scss"
function createEl(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === "class") el.className = v;
    else if (k === "html") el.innerHTML = v;
    else el.setAttribute(k, v);
  });
  children.forEach((c) => {
    if (c != null)
      el.append(typeof c === "string" ? document.createTextNode(c) : c);
  });
  return el;
}

async function main() {
  const searchInput = document.getElementById("search");
  const gamesSelect = document.getElementById("games");
  const teamsSelect = document.getElementById("teams");
  const elementsSelect = document.getElementById("elements");
  const gendersSelect = document.getElementById("genders");
  const positionsSelect = document.getElementById("positions");

  const listEl = document.querySelector(".player-list");
  const infoEl = document.querySelector(".player-info");

  let players = [];

  try {
    const resp = await fetch("./db/db.json");
    const data = await resp.json();
    players = data.players || [];
  } catch (e) {
    listEl.textContent = "Error cargando datos.";
    console.error(e);
    return;
  }

  function showPlayer(p) {
    infoEl.innerHTML = "";
    const header = createEl(
      "div",
      { class: "player-header" },
      createEl("img", { src: p.Sprite, alt: p.Name, class: "player-sprite" }),
      createEl(
        "div",
        { class: "player-meta" },
        createEl("h2", {}, p.Name),
        createEl("p", {}, p.Nickname ? `"${p.Nickname}"` : ""),
        createEl("p", {}, p.Description || ""),
        createEl(
          "p",
          {},
          createEl("img", {
            src: p.TeamSprite || "",
            alt: p.Team || "",
            style: "height:20px;vertical-align:middle;margin-right:6px;",
          }),
          ` ${p.Team || ""}`
        )
      )
    );

    const stats = createEl("div", { class: "player-stats" });
    const statKeys = [
      "Kick",
      "Body",
      "Control",
      "Guard",
      "Speed",
      "Stamina",
      "Guts",
      "FP",
      "TP",
    ];
    statKeys.forEach((k) => {
      if (p[k] !== undefined)
        stats.append(
          createEl(
            "div",
            { class: "stat-row" },
            createEl("strong", {}, k + ": "),
            String(p[k])
          )
        );
    });

    infoEl.append(header, stats);
  }

  function renderList(list) {
    listEl.innerHTML = "";
    if (!list.length) {
      listEl.textContent = "No players found.";
      return;
    }

    list.forEach((p) => {
      const card = createEl("div", { class: "player-card" });
      const img = createEl("img", {
        src: p.Sprite,
        alt: p.Name,
        class: "player-thumb",
      });
      const name = createEl("div", { class: "player-name" }, p.Name);
      const small = createEl(
        "div",
        { class: "player-team" },
        createEl("img", {
          src: p.TeamSprite || "",
          alt: p.Team || "",
          style: "height:16px;vertical-align:middle;margin-right:6px;",
        }),
        p.Team || ""
      );
      card.append(img, name, small);
      card.addEventListener("click", () => showPlayer(p));
      listEl.appendChild(card);
    });
  }

  function applyFilters() {
    const q = (searchInput.value || "").toLowerCase().trim();
    const g = gamesSelect.value;
    const t = teamsSelect.value;
    const e = elementsSelect.value;
    const ge = gendersSelect.value;
    const pos = positionsSelect.value;

    const filtered = players.filter((p) => {
      if (q) {
        const matchName =
          (p.Name || "").toLowerCase().includes(q) ||
          (p.Nickname || "").toLowerCase().includes(q);
        if (!matchName) return false;
      }
      if (g && g !== "all" && p.Game !== g) return false;
      if (t && t !== "all" && p.Team !== t) return false;
      if (e && e !== "all" && p.Element !== e) return false;
      if (ge && ge !== "all" && p.Gender !== ge) return false;
      if (pos && pos !== "all" && p.Position !== pos) return false;
      return true;
    });

    renderList(filtered);
  }

  // attach events
  [
    searchInput,
    gamesSelect,
    teamsSelect,
    elementsSelect,
    gendersSelect,
    positionsSelect,
  ].forEach((el) => {
    if (!el) return;
    el.addEventListener("input", applyFilters);
    el.addEventListener("change", applyFilters);
  });

  renderList(players);

  if (players.length) showPlayer(players[0]);
}

document.addEventListener("DOMContentLoaded", async function () {
  try {
    const players = await window.API.fetchPlayers();
    window.App.init(players);
  } catch (err) {
    console.error("Error inicializando la app:", err);
    const listEl = document.querySelector(".player-list");
    if (listEl) listEl.textContent = "No se pudieron cargar los datos.";
  }
});
