# Design Shark International: site

Static site, no build step. Open `index.html` or run `python3 -m http.server` in this folder.

```
index.html
assets/css/styles.css
assets/js/main.js
assets/fonts/   assets/img/
```

## Before you host
- **Forms** post to Netlify Forms (`data-netlify`, form name `apply-page`, honeypot `bot-field`). On any other host,
  point `dsSend()` in `main.js` at your own endpoint; until then a failed post falls back to a WhatsApp dialog.
- **WhatsApp number**: `WA_NUMBER` at the top of `main.js` rewrites every `wa.me` link on load. The hrefs in
  `index.html` and the visible footer label are the no-JS fallback; keep them in sync.
- **Tracking**: the Meta Pixel stub was removed (no pixel was installed and there is no consent banner). The footer
  still says "NDPR and GDPR compliant": add a privacy policy / cookie notice before adding any tracking.
- **Social previews**: make the `og:image` / `twitter:image` URLs absolute once the domain is final and add `og.jpg`
  (1200x630) to the repo root. Re-run with `--site-url` or edit by hand.
- **Images**: the hero ribbon and the "Where your design gets made" section use stock photos but are captioned as
  the factory. Replace them with real photos or change the captions.
- **Fonts**: families are named `LibSerif` and `FMInter` in the CSS. Confirm the real family and licence before launch.

## Known things left as-is
Ribbon tiles are duplicated by hand for the infinite loop; the custom wheel smooth-scroll and hide-on-scroll header;
the "Leaving Design Shark International" dialog on every external link; the fake-progress preloader; abbreviated
class names (`jstep`, `mzx`, `ftc`, `fc`).
