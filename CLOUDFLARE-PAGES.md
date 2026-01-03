Cloudflare Pages configuration

- Build command: `npm run build`
- Build output directory: `public`

Notes:
- The `build` script now uses Parcel to bundle and optimize assets from `project-root` into `public`.
- For local development with hot reload:

```bash
npm run dev
```

- To test the production build locally:

```bash
npm run build
python3 -m http.server --directory public 8000
```

Then open `http://localhost:8000` to preview the built site.
