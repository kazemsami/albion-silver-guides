# Albion Silver — Money Making Guides

A frontend-only Next.js site with Albion Online money making guides. Browse strategies by category, filter by difficulty, and read step-by-step walkthroughs with estimated silver/hour ranges.

## Features

- **10 detailed guides** across 7 categories (gathering, crafting, dungeons, transport, market, fishing, laborers)
- **Category & difficulty filters** on the guides page
- **Individual guide pages** with requirements, steps, and pro tips
- **Dark medieval theme** inspired by Albion Online's aesthetic
- **Static frontend** — no backend or database required

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start development server |
| `npm run build` | Production build         |
| `npm run start` | Start production server  |
| `npm run lint`  | Run ESLint               |

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # Reusable UI components
├── data/guides.ts    # Static guide content
├── lib/format.ts     # Silver formatting helpers
└── types/guide.ts    # TypeScript types
```

## Disclaimer

This is a fan-made project and is not affiliated with Sandbox Interactive GmbH. Silver/hour estimates are approximate and vary by server, patch, and player skill.

## License

Copyright © 2026 Kazem Abou Setta.

This project is free software licensed under the [GNU General Public License v3.0 or later](LICENSE). You may redistribute and modify it under those terms. There is no warranty.

- Full license: [LICENSE](LICENSE)
- Online copy: https://www.gnu.org/licenses/gpl-3.0.html
