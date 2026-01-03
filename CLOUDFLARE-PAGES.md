Cloudflare Pages configuration

- Build command: `npm run build`
- Build output directory: `public`

Notes:
- The `build` script now uses Parcel to bundle and optimize assets from `project-root` into `public`.
- To enable a "Coming Soon" landing page during a build, set the environment variable `COMING_SOON=1` when running the build; this will copy `project-root/coming-soon.html` over `public/index.html` after the build.

Local dev with hot reload:

```bash
npm run dev
```

To build a production site normally:

```bash
npm run build
python3 -m http.server --directory public 8000
```

To build and preview the *coming soon* page locally:

```bash
# Option A: use environment variable
COMING_SOON=1 npm run build
python3 -m http.server --directory public 8000

# Option B: use the repo toggle file (no Cloudflare permissions required)
npm run enable-coming-soon   # creates, commits and pushes .coming_soon
# Wait for Pages to deploy (or run `npm run build` locally to test)
# To disable:
npm run disable-coming-soon  # removes, commits and pushes .coming_soon
```

Or use the convenience script:

```bash
npm run build:coming-soon
npm run preview
```

Then open `http://localhost:8000` to preview the built site.
