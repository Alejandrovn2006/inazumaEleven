# Inazuma Eleven Explorer — Practice Report

> **Students:** Alejandro Vázquez and Rodrigo Rico

## Description
Is a Single Page Application (SPA) built with Vite and plain JavaScript that lets users explore players from the "Inazuma Eleven" universe using a local JSON database and a small client-side API wrapper.

## 1 Project description

The app loads a list of players from a local JSON file (`./src/db/db.json`) and provides:
- Real-time search by name or nickname.
- Filtering by game, team, element, gender and position.
- A player listing and a detailed view that shows statistics and sprites.

This is a static app (no server by default) intended to practice data fetching with `fetch`, modular organization and DOM manipulation.

## 2 Data source and API connection

- Primary data: `./src/db/db.json` (local file inside `src/db`).
- JS wrapper: `src/js/api.js` exposes `API.fetchPlayers()` which internally performs `fetch('./db/db.json')` and returns the `players` array.

If you want to expose the JSON as a REST endpoint (optional), you can use `json-server`:

PowerShell:
```powershell
npm install -g json-server
json-server --watch src/db/db.json --port 3000
```

With `json-server` running, example endpoints would be:
- `GET http://localhost:3000/players` → returns the `players` array.
- `GET http://localhost:3000/players/0` → returns the player with id 0 (json-server adds numeric ids).

Note: the current project does NOT include a backend; the app reads the JSON file via `fetch`. If you run `json-server`, update `src/js/api.js` to fetch from `http://localhost:3000/players` (or add a small proxy in the frontend).

## 3 Endpoints and exposed functions (summary)

- `API.fetchPlayers()` (client): loads `./db/db.json` and returns `players`.
- Optional with json-server: `GET /players`, `GET /players/:id`, `POST/PUT/DELETE /players` (if you enable write support with json-server).

Example usage (already implemented):
```javascript
const players = await window.API.fetchPlayers();
window.App.init(players);
```

## 4 Application flow (technical summary)

1. On `DOMContentLoaded`, `main.js` calls `API.fetchPlayers()`.
2. Data is passed to `App.init(players)` (or `App.renderList`) to render the list and the detailed view.
3. `app.js` contains rendering, filtering and event logic (click on a card to open details, inputs/selects to filter).
4. `api.js` is the data access layer (currently minimal: only `fetchPlayers`).

## 5 Project structure and file purposes

Root
- `package.json` : dev dependencies (`vite`) and scripts (`dev`, `build`, `preview`).
- `vite.config.js` : Vite configuration for dev server and build.

`src/` directory
- `index.html` : main HTML template.
- `readme.md` : this practice report .
- `style.css` : global stylesheet (there is also `css/style.css`).
- `db/db.json` : local database containing the `players` array (main data source).
- `js/`
  - `api.js`  : small wrapper that exports `API.fetchPlayers()` and centralizes fetch calls.
  - `app.js`  : UI logic: renders the list, shows player details, handles filters and events.
  - `main.js` : entry point that initializes the app and handles initial loading and errors.
- `images/` : sprites, emblems, elements, positions and other graphics.
- `fonts/`  : fonts used by the UI.

`public/` (if present): static assets served directly.

## 6 Short explanation per key file

- `src/js/api.js` : performs `fetch('./db/db.json')`, handles errors and returns `data.players`.
- `src/js/main.js` : helper functions for DOM creation, initial `fetch`, and `DOMContentLoaded` handler that calls `API.fetchPlayers()` and `App.init()`.
- `src/js/app.js` : contains `renderList`, `showPlayer`, `applyFilters` and event wiring for inputs/selects. Responsible for updating the DOM with player cards and the detail view.
- `src/db/db.json` : player objects with fields such as `Name`, `Nickname`, `Team`, `Element`, `Sprite`, `Kick`, `Speed`, `FP`, `TP`, etc.


## 7 Considerations and future improvements

- Add a proper REST API (Node/Express) to edit players or add scores.
- Implement server-side pagination and search for large datasets.
- Add unit tests for filtering and rendering utilities.
- Improve accessibility and optimize images for performance.

---

## Participation table 



| Student | % Participation (Practice) | % Participation (Documentation) |
|---|---:|---:|
| Alejandro Vázquez | 50% | 50% |
| Rodrigo Rico      | 50% | 50% |


