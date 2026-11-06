/**
 * Store settings.
 *
 * Shipping cost, delivery time, taxes and payment methods are intentionally not
 * invented here. Fill these in with the merchant's real terms, and set
 * `orderEndpoint` to the URL that should receive submitted order requests.
 * While `orderEndpoint` is empty the checkout is clearly labelled as unconnected.
 */
const orderEndpointFromEnv = import.meta.env.VITE_ORDER_ENDPOINT?.trim() ?? '';

export const storeConfig = {
  /** ISO 4217 code used for every price on the site. */
  currency: 'AED',
  /** Delivery market shown on the checkout form. */
  deliveryCountry: 'United Arab Emirates',
  /**
   * POST target for order requests. Expected request: JSON `OrderRequest`
   * (see src/lib/orders.ts). Leave empty until a real backend is connected.
   * Set VITE_ORDER_ENDPOINT at build time on Vercel instead of editing this file.
   */
  orderEndpoint: orderEndpointFromEnv,
  /** Optional support address; the footer only shows a contact row when set. */
  supportEmail: '',
  /** Maximum units per order request. */
  maxQuantity: 10,
} as const;

export type StoreConfig = typeof storeConfig;
