import { storeConfig } from '../config/store';
import { price, product } from '../data/product';
import { formatPrice } from './currency';

export interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
  emirate: string;
  city: string;
  address: string;
  notes: string;
}

export interface OrderRequest {
  reference: string;
  createdAt: string;
  product: {
    id: string;
    name: string;
    model: string;
    quantity: number;
    unitPrice: number;
    compareAtUnitPrice: number;
  };
  totals: {
    currency: string;
    subtotal: number;
    originalTotal: number;
    savings: number;
  };
  customer: CustomerDetails;
  paymentStatus: 'not_collected';
  fulfilment: {
    shipping: 'not_configured';
    tax: 'not_configured';
  };
}

export type SubmitOutcome =
  | { status: 'submitted'; reference: string; delivered: boolean }
  | { status: 'failed'; message: string; reference: string };

const STORAGE_KEY = 'zforce.orderRequests.v1';

export function createReference(): string {
  const stamp = Date.now().toString(36).slice(-4).toUpperCase();
  const random = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `ZF-${stamp}${random}`;
}

export function buildOrderRequest(quantity: number, customer: CustomerDetails): OrderRequest {
  return {
    reference: createReference(),
    createdAt: new Date().toISOString(),
    product: {
      id: product.id,
      name: product.name,
      model: product.model,
      quantity,
      unitPrice: price.sale,
      compareAtUnitPrice: price.compareAt,
    },
    totals: {
      currency: storeConfig.currency,
      subtotal: quantity * price.sale,
      originalTotal: quantity * price.compareAt,
      savings: quantity * price.savings,
    },
    customer,
    paymentStatus: 'not_collected',
    fulfilment: {
      shipping: 'not_configured',
      tax: 'not_configured',
    },
  };
}

function persist(order: OrderRequest) {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    const existing = Array.isArray(parsed) ? parsed : [];
    const trimmed = existing.slice(-19);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...trimmed, order]));
    return true;
  } catch {
    return false;
  }
}

/**
 * Sends the request to the configured order endpoint. With no endpoint set, the
 * request is only saved in this browser — the UI says so and never claims delivery.
 */
export async function submitOrder(order: OrderRequest): Promise<SubmitOutcome> {
  persist(order);

  if (!storeConfig.orderEndpoint) {
    return { status: 'submitted', reference: order.reference, delivered: false };
  }

  try {
    const response = await fetch(storeConfig.orderEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    if (!response.ok) {
      return {
        status: 'failed',
        reference: order.reference,
        message: `The order service answered with ${response.status}. Nothing has been charged. Please try again or contact the store.`,
      };
    }
    return { status: 'submitted', reference: order.reference, delivered: true };
  } catch {
    return {
      status: 'failed',
      reference: order.reference,
      message: 'We could not reach the order service. Nothing has been charged. Check your connection and try again.',
    };
  }
}

export function orderSummaryText(order: OrderRequest): string {
  const { customer, totals, product: item } = order;
  return [
    `ZFORCE order request ${order.reference}`,
    `Placed: ${new Date(order.createdAt).toLocaleString('en-AE')}`,
    '',
    `${item.name} × ${item.quantity}`,
    `Unit price: ${formatPrice(item.unitPrice)} (was ${formatPrice(item.compareAtUnitPrice)})`,
    `Subtotal: ${formatPrice(totals.subtotal)}`,
    `You save: ${formatPrice(totals.savings)}`,
    `Shipping: not configured`,
    `Payment: not collected`,
    '',
    `Name: ${customer.fullName}`,
    `Email: ${customer.email}`,
    `Phone: ${customer.phone}`,
    `Emirate: ${customer.emirate}`,
    `City: ${customer.city}`,
    `Address: ${customer.address}`,
    customer.notes ? `Notes: ${customer.notes}` : 'Notes: —',
  ].join('\n');
}
