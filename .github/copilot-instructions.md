# National Controls Consulting - AI Development Guide

## Project Overview
This is a **Cloudflare Pages-hosted static marketing site** for a lighting controls consulting business. The site uses **Parcel** for bundling and supports two deployment modes: full site and "coming soon" landing page.

## Architecture & Build System

### Two-Site System
- **Source**: [`project-root/`](project-root/) contains all source files (HTML, CSS, JS, images)
- **Build output**: [`public/`](public/) contains Parcel-bundled, production-ready assets deployed to Cloudflare Pages
- **Dual modes**:
  - Standard build: `npm run build` → full featured site
  - Coming soon mode: `npm run build:coming-soon` → overlays [coming-soon.html](project-root/coming-soon.html) onto index

### Build Commands (from package.json)
- `npm run dev` - Local dev server with hot reload on port 3000
- `npm run build` - Production build to `public/` directory
- `npm run preview` - Build + serve locally on port 8000

### Cloudflare Pages Configuration
- **Build command**: `npm run build`
- **Output directory**: `public`
- See [CLOUDFLARE-PAGES.md](CLOUDFLARE-PAGES.md) for deployment details

## Key Files & Structure

### Main Site ([project-root/index.html](project-root/index.html))
Multi-section single-page site with:
- Navigation: in-page anchor links (`#about`, `#services`, `#training`, `#contact`)
- Background images: overlay with `rgba(0,0,0,0.6)` for text readability
- Sections: hero, about, services, training, contact form

### Styling Patterns ([project-root/style.css](project-root/style.css))
- **Section backgrounds**: Uses `.content-background` with fixed background image for parallax effect
- **Text overlays**: All text in sections has dark semi-transparent backgrounds for visibility over images
- **Logo sizing**: Responsive - 120px desktop, 64px mobile (see media query at line 237)
- **Color scheme**: Navy (#003366), cyan (#0ab4ff), dark (#1a1a1a)

### Contact Form Flow
1. Form submits to `/api/contact` (Cloudflare Functions endpoint)
2. [functions/api/contact.js](functions/api/contact.js) handles dual email delivery:
   - **Web3Forms**: Sends notification to business owner
   - **Resend**: Auto-response to customer (requires `RESEND_API_KEY` env var)
3. Currently returns JSON debug response (not production redirect)
4. Frontend ([script.js](project-root/script.js)) checks for `?success=true` URL param to show confirmation

### Logo Generation
- Python script [create_logo.py](project-root/create_logo.py) generates placeholder `images/logo.png`
- Run with `python3 create_logo.py` before first build

## Development Workflow

### Local Development
```bash
npm run dev  # Start at localhost:3000 with hot reload
```

### Testing Production Build Locally
```bash
npm run preview  # Builds to public/ and serves on localhost:8000
```

### Coming Soon Mode
To test the landing page instead of full site:
```bash
npm run build:coming-soon
python3 -m http.server --directory public 8000
```

## Common Modifications

### Adding New Sections
1. Add section in [project-root/index.html](project-root/index.html) inside `.content-background` div
2. Add nav link in `.nav-links` with matching anchor
3. Style follows pattern: `.section` class with `background: rgba(0,0,0,0.6)` for text blocks

### Updating Contact Form
- Form fields in [index.html](project-root/index.html) line 82-90
- Backend logic in [functions/api/contact.js](functions/api/contact.js)
- Environment variables needed: `WEB3FORMS_KEY`, `RESEND_API_KEY` (set in Cloudflare Pages settings)

### Changing Hero Image
Replace `./images/coming-soon-bg.jpg` reference in [style.css](project-root/style.css) line 43

## Critical Conventions

### Asset Paths
- **In source files**: Use relative paths (`./images/logo.png`)
- **Parcel handles bundling**: Don't modify `public/` directly - always edit in `project-root/`
- **Public URL**: Build uses `--public-url ./` for relative paths in deployed assets

### Responsive Design
- Mobile-first CSS patterns
- Logo scaling media query at 600px breakpoint
- Flexbox cards with `flex: 1 1 250px` wrapping

### Version Control
- Ignore `node_modules/`, `.parcel-cache/`
- Track both `project-root/` (source) and `public/` (built assets) per current setup
