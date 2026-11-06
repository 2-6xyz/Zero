# ZFORCE ZF-435 storefront

A single-product storefront for the ZFORCE ZF-435 true wireless stereo earbuds:
**AED 40** (was AED 60 — save AED 20). Built with Vite, React and TypeScript, with
hand-written CSS and no UI framework.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # typecheck + production build to dist/
npm run typecheck
npm run check:assets
```

Deployment is static: `dist/` can be served by any static host (or mounted as
Workers assets). No server, database or secret is required for the storefront.

## Product images (required)

The five supplied PNGs belong in `public/images/` with these exact names:

| Supplied file | Destination | Role |
| --- | --- | --- |
| `assets/126583.png` | `public/images/zforce-zf435-front.png` | Gallery 1, 1:1 |
| `assets/126587.png` | `public/images/zforce-zf435-details.png` | Gallery 2, 1:1 |
| `assets/126586.png` | `public/images/zforce-zf435-angles.png` | Gallery 3, 1:1 |
| `assets/126584.png` | `public/images/zforce-zf435-hero-studio.png` | Hero 1, 2:1 |
| `assets/126585.png` | `public/images/zforce-zf435-hero-lifestyle.png` | Hero 2, 2:1 |

```bash
cp assets/126583.png public/images/zforce-zf435-front.png
cp assets/126587.png public/images/zforce-zf435-details.png
cp assets/126586.png public/images/zforce-zf435-angles.png
cp assets/126584.png public/images/zforce-zf435-hero-studio.png
cp assets/126585.png public/images/zforce-zf435-hero-lifestyle.png
npm run check:assets
```

`check:assets` verifies each file exists with the expected aspect ratio. Until a file
is present, that slot shows a neutral "Product image unavailable" panel — no substitute
product artwork is generated, and the layout keeps its reserved space.

The image containers match the supplied ratios (square gallery, 2:1 hero), so the
photographs are shown complete and uncropped. Keep the originals as the source files.

## Pricing and content

All pricing lives in `src/data/product.ts`:

```ts
compareAt: 60,
sale: 40,
savings: 60 - 40, // derived, never typed twice
```

The copy deliberately contains only details confirmed by the brief and the supplied
photographs: brand, model, TWS type, matte black shell, orange interior, silicone tips,
chrome-finish stem caps and the `Case Battery: 400mAh` marking. Unconfirmed
specifications are listed as "Not specified". There are no reviews, ratings, stock
counts, delivery promises or payment-success claims anywhere on the site.

## Orders and payment

No payment provider is configured, so checkout collects a **delivery details form** and
submits an **order request**. The confirmation states plainly that no payment was taken.

- With `orderEndpoint` empty (default), the request is saved only in this browser
  (`localStorage`, key `zforce.orderRequests.v1`) and the UI says it was not sent.
- Set `VITE_ORDER_ENDPOINT` in the deployment environment (or `orderEndpoint` in
  `src/config/store.ts` locally) to a POST URL to send requests as JSON
  (`OrderRequest` in `src/lib/orders.ts`). Successful responses must be `2xx`.
  The merchant then confirms price, shipping/payment method and delivery directly.
  The variable is inlined at build time, so redeploy after changing it.

Shipping cost, taxes, delivery times and payment methods are intentionally left
unconfigured; the cart and checkout label them as set by the merchant instead of
inventing values.

## Structure

```
src/
  App.tsx                 page shell, overlays and live region
  cart/CartProvider.tsx   single-product bag state, localStorage persistence
  components/             header, hero, gallery, buy box, details, FAQ, footer,
                          cart drawer, checkout dialog, shared UI
  config/store.ts         currency, delivery market, order endpoint, max quantity
  data/product.ts         pricing, images, confirmed specs, FAQs
  hooks/                  focus trap, reduced-motion helpers
  lib/                    currency formatting and order submission
  styles/                 tokens/base, layout, overlays
public/images/            the five supplied product photographs
```

## Deploy to Vercel

The project is configured for Vercel in `vercel.json` (Vite preset, `npm ci`,
`npm run build`, `dist/` output, immutable asset caching and basic security headers).

1. Push the repository (already at `main`) and choose **Add New → Project** in Vercel.
2. Import the repo. The Vite preset and build settings are detected from
   `vercel.json`; no server, database or build secret is required.
3. Optional: add `VITE_ORDER_ENDPOINT` under **Settings → Environment Variables**
   for Production and Preview, then redeploy to receive order requests. Without it,
   checkout stays in its clearly labelled local-only mode.
4. Add the five product images to `public/images/` and redeploy when they are ready.

Or from the CLI:

```bash
npx vercel          # preview deployment
npx vercel --prod   # production deployment
```

## Accessibility and motion

Semantic landmarks, skip link, keyboard-operable gallery and carousel, focus-trapped
drawer/dialog with Escape and focus restore, visible focus states, labelled form fields
with inline errors, live regions for bag changes, and collision-free alt text.
All animation is subtle, transform/opacity based, and disabled by
`prefers-reduced-motion`. The hero carousel pauses on hover/focus and stops autoplaying
for reduced-motion users.
