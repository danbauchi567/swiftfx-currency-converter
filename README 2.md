# SwiftFX — Currency Converter (Static Web + PWA)

## What this repo includes
- Responsive currency converter (index.html)
- Privacy, Contact, Blog, About pages
- PWA manifest & simple service worker
- Logo (SVG)
- Placeholder spots for AdSense & affiliate banners

## How to host on GitHub Pages
1. Create a new GitHub repo and push these files to the `main` branch (or `gh-pages` branch).
2. In the repo Settings → Pages, select the branch and `/ (root)` folder. Save.
3. GitHub Pages will provide `https://<username>.github.io/<repo>/` — your site is live.
4. Ensure `index.html` is at the root. GitHub Pages uses HTTPS which AdSense requires.

## Add Google AdSense
1. Sign up for AdSense and add your site URL.
2. After approval, replace the AdSense snippet in `index.html`:
   ```html
   <script data-ad-client="ca-pub-XXXXXXXXXXXX" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>