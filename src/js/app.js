(function (global) {
  function createEl(tag, attrs = {}, ...children) {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k == "class") el.className = v;
      else if (k == "html") el.innerHTML = v;
      else el.setAttribute(k, v);
    });
    children.forEach((c) => {
      if (c != null)
        el.append(typeof c == "string" ? document.createTextNode(c) : c);
    });
    return el;
  }

  let players = [];
  let refs = {};

  function showPlayer(p) {
    const infoEl = refs.infoEl;
    if (!infoEl) return;
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
    const listEl = refs.listEl;
    if (!listEl) return;
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
    const q = (refs.searchInput.value || "").toLowerCase().trim();
    const g = refs.gamesSelect.value;
    const t = refs.teamsSelect.value;
    const e = refs.elementsSelect.value;
    const ge = refs.gendersSelect.value;
    const pos = refs.positionsSelect.value;

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

  function attachEvents() {
    const els = [
      refs.searchInput,
      refs.gamesSelect,
      refs.teamsSelect,
      refs.elementsSelect,
      refs.gendersSelect,
      refs.positionsSelect,
    ];
    els.forEach((el) => {
      if (!el) return;
      el.addEventListener("input", applyFilters);
      el.addEventListener("change", applyFilters);
    });
  }

  function init(playerData) {
    players = playerData || [];
    refs.searchInput = document.getElementById("search");
    refs.gamesSelect = document.getElementById("games");
    refs.teamsSelect = document.getElementById("teams");
    refs.elementsSelect = document.getElementById("elements");
    refs.gendersSelect = document.getElementById("genders");
    refs.positionsSelect = document.getElementById("positions");
    refs.listEl = document.querySelector(".player-list");
    refs.infoEl = document.querySelector(".player-info");

    renderList(players);
    if (players.length) showPlayer(players[0]);
    attachEvents();
  }

  global.App = {
    init,
    renderList,
    showPlayer,
  };
})(window);
