Cloudflare Pages configuration

- Build command: `npm run build`
- Build output directory: `public`

Notes:
- The `build` script simply copies the `project-root` folder into `public`. If you'd prefer to serve directly from `project-root`, set the output directory in Pages to `project-root` and leave the build command blank.
- To test locally you can run:

```bash
npm run build
python3 -m http.server --directory public 8000
```

Then open `http://localhost:8000` to preview the built site.
