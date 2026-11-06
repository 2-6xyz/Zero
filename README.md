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

## Product images

The five product images used by the site are in `public/images/` with these names:

| File | Role | Aspect |
| --- | --- | --- |
| `zforce-zf435-front.png` | Gallery 1 | 1:1 |
| `zforce-zf435-details.png` | Gallery 2 | 1:1 |
| `zforce-zf435-angles.png` | Gallery 3 | 1:1 |
| `zforce-zf435-hero-studio.png` | Hero | 2:1 |
| `zforce-zf435-hero-lifestyle.png` | Campaign | 2:1 |

`npm run check:assets` verifies each file exists with the expected aspect ratio. If a
file is missing, that slot shows a neutral "Product image unavailable" panel — no
substitute product artwork is generated.

The three gallery images sit on a warm square stage and blend into it, so the supplied
white backgrounds disappear. The studio hero is art-directed to a 55% focal crop on all
breakpoints, keeping both earbuds and the open case in frame. The lifestyle photograph
is used in the campaign section, cropped to the case and away from the wordmark baked
into the left side of the supplied file.

## Pricing and content

All pricing lives in `src/data/product.ts`:

```ts
compareAt: 60,
sale: 40,
savings: 60 - 40, // derived, never typed twice
```

The copy deliberately contains only details confirmed by the brief and the supplied
photographs: brand, model, TWS type, matte black shell, orange interior, chrome-finish
stem caps and the `Case Battery: 400mAh` marking. Unconfirmed specifications
(Bluetooth version, playback time, water resistance, warranty) are not published at
all. There are no reviews, ratings, stock counts, delivery promises or
payment-success claims anywhere on the site.

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
  components/             header, hero, gallery, product facts, campaign, FAQ,
                          footer, cart drawer, checkout dialog, shared UI
  config/store.ts         currency, delivery market, order endpoint, max quantity
  data/product.ts         pricing, images, confirmed details, FAQs
  hooks/                  focus trap, header-aware scrolling
  lib/                    currency formatting and order submission
  styles/                 tokens/base, layout, overlays
public/images/            the five product photographs
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
4. The five product images are already committed in `public/images/`; redeploy after
   replacing any of them.

Or from the CLI:

```bash
npx vercel          # preview deployment
npx vercel --prod   # production deployment
```

## Accessibility and motion

Semantic landmarks, skip link, keyboard-operable gallery with swipe and thumbnails,
focus-trapped drawer/dialog with Escape and focus restore, visible focus states,
labelled form fields with inline errors, live regions for bag changes, and descriptive
alt text. All animation is subtle, transform/opacity based, and disabled by
`prefers-reduced-motion`. The hero uses a single static studio photograph.

## Design method

The interface was rebuilt using the [Unslop](https://github.com/heydamir/unslop) skill,
installed at `.agents/skills/unslop/` (CC BY 4.0, by Damir Sokolovsky). The direction is
warm paper, near-black ink and the orange case interior, with Instrument Serif for
product figures and Instrument Sans for the interface.
