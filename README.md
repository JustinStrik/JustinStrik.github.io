# Justin Strikowski — Portfolio

Personal portfolio site with a JSON-based CMS. Dark theme with sage green accents, interactive particle network background, matrix rain loading screen, GSAP scroll animations, and responsive design.

**Live:** [justinstrik.github.io](https://justinstrik.github.io)

## How It Works

All site content lives in `content.json`. A build script (`build.js`) reads the JSON and generates `index.html` by combining the content with pre-built templates for styles, animations, and scripts.

### To update the site:

```bash
# 1. Edit content.json (add a project, update experience, etc.)
# 2. Build
node build.js
# 3. Commit and push
```

### File Structure

```
content.json           ← All site content (edit this)
build.js               ← Build script (node build.js → index.html)
index.html             ← Generated output (don't edit directly)
assets/
  css/style.css        ← All styles (loading screen, layout, cards, responsive)
  js/main.js           ← Particle background, matrix rain, GSAP animations, nav
  js/gator.js          ← Gator easter egg animation
images/                ← Referenced by filename in content.json
  headshot.jpg
  brandradar.png
  acquios.png
  plato-graphs.png
  liu-group.png
  orca.png
  baseball-minipros.png
  uf-gator.png
xlcompress/            ← XLcompress browser demo (WASM)
```

## content.json Structure

| Section | Key | What it controls |
|---|---|---|
| `meta` | `title`, `favicon`, `footer` | Page title, tab icon, footer text |
| `loading` | `name`, `label`, `enterText` | Matrix rain loading screen text |
| `nav` | `logo`, `links[]` | Top nav bar |
| `hero` | `label`, `firstName`, `lastName`, `description`, `headshot`, `links[]` | Hero section with headshot |
| `projects` | `items[]` with `year`, `title`, `description`, `tags[]`, `screenshot`, `links[]` | Project cards grid |
| `publication` | `title`, `authors`, `venue`, `url` | Publication section |
| `experience` | `items[]` with `title`, `meta`, `description` | Experience timeline |
| `education` | `schoolName`, `logo`, `cards[]` with `degree`, `meta`, `description`, `honors[]` | Education cards with honor badges |
| `skills` | `groups[]` with `title`, `content` | Skills grid |
| `contact` | `items[]` with `icon`, `text`, `url` | Contact cards |

### Adding a project

Add an entry to `projects.items[]`:

```json
{
  "year": "2025",
  "title": "My New Project",
  "description": "What it does.",
  "tags": ["Python", "React"],
  "screenshot": "images/my-project.png",
  "links": [
    { "url": "https://github.com/...", "icon": "fab fa-github", "title": "GitHub" },
    { "url": "https://example.com", "icon": "fas fa-external-link-alt", "title": "Live" }
  ]
}
```

### Icons

Links use [Font Awesome 6](https://fontawesome.com/icons) class names:

| Icon | Class |
|---|---|
| GitHub | `fab fa-github` |
| External link | `fas fa-external-link-alt` |
| Python/PyPI | `fab fa-python` |
| LinkedIn | `fab fa-linkedin` |
| Email | `fas fa-envelope` |
| Paper/file | `fas fa-file-alt` |
| Building | `fas fa-building` |
| Gamepad | `fas fa-gamepad` |

### Honor badges

Honors in education cards can be plain text or linked:

```json
{ "text": "Dean's List" }
{ "text": "ACM Publication", "url": "https://dl.acm.org/..." }
```

Linked honors get a small external-link icon automatically.

## What's Pre-Programmed

These features are baked into the templates and don't need JSON config:

- **Matrix rain loading screen** — sage green 1/0s with embedded tech words scrolling upward, click/key to enter
- **Particle network background** — floating connected dots that follow the mouse
- **GSAP scroll animations** — cards, timeline items, and section headers animate in on scroll
- **Responsive layout** — mobile nav toggle, stacked cards on small screens
- **Gator easter egg** — animated gator walks across the education cards
- **Dark theme** — sage green (`#7C9082`) accent color throughout

## Projects

- [XLcompress](https://github.com/JustinStrik/xlcompress) — Spreadsheet compression for LLMs ([PyPI](https://pypi.org/project/xlcompress/), [Demo](https://justinstrik.github.io/xlcompress/))
- [BrandRadar](https://brandradar.co/) — Automated brand sentiment monitoring platform
- [AcquiOS](https://acquios.ai/p/acquios) — AI-driven real estate deal analysis platform
- [PLATO](https://dl.acm.org/doi/10.1145/3765612.3767242) — Published bioinformatics research (ACM BCB 2025)
- [Computational Chemistry Research](https://liu.chem.ufl.edu/) — Tools & databases ([GitHub](https://github.com/Liu-Group-UF))
- [Financial Statements Module](https://www.orcainc.com/p/financial-statements) — Fintech module built at SerVC/Orca
- [Baseball MiniPros](https://github.com/JustinStrik/Baseball-MiniPros) — Interactive baseball simulation using Bezier curves

## Publication

**PLATO: Predicting Longitudinally-Aligned Time Observations of Biological Networks**
T. Khatib, S. Gafarov, J. Strikowski, M. Turan, T. Kahveci — ACM BCB 2025

## Links

- [GitHub](https://github.com/JustinStrik)
- [LinkedIn](https://www.linkedin.com/in/justin-strikowski-a8a715208)
- [Email](mailto:strikowski.justin@gmail.com)
