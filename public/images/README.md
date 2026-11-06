# Product images

The storefront uses these five ZFORCE ZF-435 images, with these exact names and
aspect ratios:

| File | Role | Aspect |
| --- | --- | --- |
| `zforce-zf435-front.png` | Gallery 1 — straight-on open case with earbuds | 1:1 |
| `zforce-zf435-details.png` | Gallery 2 — earbuds, case and details | 1:1 |
| `zforce-zf435-angles.png` | Gallery 3 — case and earbud angles | 1:1 |
| `zforce-zf435-hero-studio.png` | Hero — studio pedestal composition | 2:1 |
| `zforce-zf435-hero-lifestyle.png` | Campaign — marble table composition | 2:1 |

The files are already in place. To replace one, keep the same filename and aspect
ratio, then run `npm run check:assets`. The UI falls back to a neutral "image
unavailable" panel if a file is missing, so nothing breaks.
