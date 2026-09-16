<p align="center">
  <img src="apps/web/public/favicon.svg" width="96" height="96" alt="Elden Ring Compass logo" />
</p>

<h1 align="center">Elden Ring Compass</h1>

<p align="center">
  A high-performance, in-browser save reader and interactive progression tracker for Elden Ring.
</p>

<p align="center">
  <a href="https://github.com/Kolbxyz/elden-ring-compass-plus/actions/workflows/pages.yml"><img src="https://img.shields.io/github/actions/workflow/status/Kolbxyz/elden-ring-compass-plus/pages.yml?branch=main&label=Pages%20Deploy&style=flat-square" alt="GitHub Pages Deployment"/></a>
  <a href="https://github.com/Kolbxyz/elden-ring-compass-plus/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square" alt="License"/></a>
  <a href="https://bun.sh"><img src="https://img.shields.io/badge/runtime-Bun-fbf0df?style=flat-square&logo=bun" alt="Bun"/></a>
  <a href="https://react.dev"><img src="https://img.shields.io/badge/react-19-61dafb?style=flat-square&logo=react" alt="React 19"/></a>
  <a href="https://tanstack.com"><img src="https://img.shields.io/badge/tanstack-router%20%26%20start-ff4154?style=flat-square" alt="TanStack"/></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/tailwind-v4-38bdf8?style=flat-square&logo=tailwindcss" alt="Tailwind CSS v4"/></a>
</p>

---

Upload (or continuously poll) your Elden Ring save file (`.sl2`) and the site decodes your full progression — inventory, defeated bosses, unlocked sites of grace, active map markers, equipment, and quest flags — entirely inside your browser.

Zero server uploads, zero telemetry, and zero modifications to your save file.

> **Original project**: Forked from [Elden Ring Compass](https://www.eldenringcompass.com). Enhanced with GitHub Pages static deployment workflows, modernized monorepo tooling, and comprehensive questline dependency analysis.

---

## Features

| Feature | In-Browser | Live Polling | Map Sync | Local Cache | Save-Safe |
|---|:---:|:---:|:---:|:---:|:---:|
| **Bosses & Defeat Flags** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Sites of Grace** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Inventory & Equipment** | ✅ | ✅ | — | ✅ | ✅ |
| **Map Markers & Placements** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Questlines & Milestones** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Weapon Scaling & AR** | ✅ | — | — | ✅ | ✅ |

- **In-Browser Save Parsing** — 100% pure TypeScript save parser running inside a Web Worker. Reads the complete event-flag bitfield via binary search trees (`eventflag-bst.txt`) with zero native dependencies or WASM overhead.
- **Continuous Live Polling** — Point a browser tab to your local save directory using any simple HTTP server; the app auto-refreshes your character state in real-time as you play.
- **Interactive Tiled Map** — Leaflet-powered multi-layer game map with marker filtering, location coordinates, and blank tile skip optimizations.
- **Local Storage Sync** — Map viewports, filter selections, active character slots, and table preferences are persisted locally on your device.
- **Stat & Attack Rating Engine** — Real-time AR calculation graphs covering scaling curves, reinforcement tiers, and affinities.

---

## Safety & Anti-Cheat

**Can this get me banned? No.**

1. **Read-Only by Architecture** — The application operates exclusively as a reader. It cannot write, mutate, or re-sign your save file.
2. **No Memory Injection** — Unlike Cheat Engine or memory hooks, this tool reads static files from disk. Easy Anti-Cheat (EAC) remains untouched.
3. **No Network Transmission** — Your save file never leaves your browser sandbox. All parsing and event evaluation happen locally.
4. **Cloud-Backup Equivalent** — Elden Ring allows external programs to inspect save files (Steam Cloud regularly reads and syncs `.sl2` files while playing).

---

## Architecture

Monorepo powered by **Turborepo** and **Bun**:

```
apps/
  web/               Full-stack React 19 web app (TanStack Start, Vite, Nitro, Leaflet)
packages/
  data/              Single runtime data source: game params, items, icons, placements
  save-parser/       Pure TypeScript save parser (save-parser-ts, worker protocol)
  extractor/         Build-time CLI: parses dvdbnd, FMG, PARAM, MSB, and EMEVD from install
  vendored-data/     Reverse-engineered constants: event-flag BST, AES/RSA keys, schemas
  config/            Shared TypeScript, Vite, and Oxlint configurations
```

### Technology Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) + [TanStack Router](https://tanstack.com/router)
- **UI & Styling**: [React 19](https://react.dev) (React Compiler), [Base UI](https://base-ui.com/) (`@base-ui/react`), [Tailwind CSS v4](https://tailwindcss.com)
- **State & Data**: [Effect](https://effect.website) + `@effect/atom-react`
- **Mapping & Tables**: [Leaflet](https://leafletjs.com/) (`react-leaflet`), [TanStack Table](https://tanstack.com/table), [TanStack Virtual](https://tanstack.com/virtual)
- **Toolchain**: [Bun](https://bun.sh), [Turborepo](https://turbo.build), [Vite](https://vite.dev), [oxlint](https://oxc.rs)/[oxfmt](https://oxc.rs), [Vitest](https://vitest.dev), [Playwright](https://playwright.dev)

---

## Building & Development

### Prerequisites

- **[Bun](https://bun.sh/)** (v1.3+ recommended)
- Optional: **Nix** with flakes enabled (`flake.nix`)

```bash
# Optional Nix development shell
nix develop
# or with direnv:
direnv allow
```

### Getting Started

```bash
# 1. Install dependencies across workspaces
bun install

# 2. Start the local development server
bun run dev

# 3. Type-check with native TypeScript preview (tsgo)
bun run typecheck

# 4. Lint and format code
bun run lint

# 5. Run unit and integration tests
bun run test

# 6. Build production bundles
bun run build
```

---

## Provenance & Credits

Game data extraction and event flag resolution rely on research from the FromSoftware modding community:

- **[ER-Save-Lib](https://github.com/ClayAmore/ER-Save-Lib)** — Save-format constants, event-flag tables, regulation keys.
- **[UXM-Selective-Unpack](https://github.com/Nordgaren/UXM-Selective-Unpack)** — Game archive RSA keys and file dictionary.
- **[soulsmods / Paramdex](https://github.com/soulsmods/Paramdex)** — PARAMDEF field definitions for `regulation.bin`.
- **[soulstruct](https://github.com/Grimrukh/soulstruct)** — EMEVD instruction dictionary (EMEDF).
- **[er-save-manager](https://github.com/Hapfel/er-save-manager)** — Questline flag maps and state machine references.

---

## License

This project is licensed under the [MIT License](LICENSE).
