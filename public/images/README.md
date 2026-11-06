# Product images

The storefront expects the five supplied ZFORCE ZF-435 image files here, with these
exact names and aspect ratios:

| File | Role | Aspect |
| --- | --- | --- |
| `zforce-zf435-front.png` | Gallery 1 — straight-on open case with earbuds | 1:1 |
| `zforce-zf435-details.png` | Gallery 2 — alternate angles / details | 1:1 |
| `zforce-zf435-angles.png` | Gallery 3 — alternate product views | 1:1 |
| `zforce-zf435-hero-studio.png` | Hero 1 — studio pedestal composition | 2:1 |
| `zforce-zf435-hero-lifestyle.png` | Hero 2 — table lifestyle composition | 2:1 |

Copy them from the supplied bundle without renaming, re-cropping or re-encoding:

```bash
cp assets/126583.png public/images/zforce-zf435-front.png
cp assets/126587.png public/images/zforce-zf435-details.png
cp assets/126586.png public/images/zforce-zf435-angles.png
cp assets/126584.png public/images/zforce-zf435-hero-studio.png
cp assets/126585.png public/images/zforce-zf435-hero-lifestyle.png
```

Then run `npm run check:assets` to confirm every file is present with the expected
dimensions. The UI falls back to a neutral "image unavailable" panel per slot while a
file is missing, so nothing breaks — it simply is not the finished product photography.
