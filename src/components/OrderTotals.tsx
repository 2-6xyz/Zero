import { useCart } from '../cart/CartProvider';
import { formatPrice } from '../lib/currency';

export function OrderTotals({ showGrand = true, compact = false }: { showGrand?: boolean; compact?: boolean }) {
  const { quantity, subtotal, originalTotal, savings } = useCart();

  return (
    <dl className={`totals ${compact ? 'totals--compact' : ''}`} aria-label="Order summary">
      <div className="totals__row">
        <dt>
          Subtotal <span className="totals__qty">({quantity} {quantity === 1 ? 'item' : 'items'})</span>
        </dt>
        <dd>{formatPrice(subtotal)}</dd>
      </div>
      <div className="totals__row totals__row--muted">
        <dt>Original price</dt>
        <dd>
          <s>{formatPrice(originalTotal)}</s>
        </dd>
      </div>
      <div className="totals__row totals__row--accent">
        <dt>You save</dt>
        <dd>{formatPrice(savings)}</dd>
      </div>
      <div className="totals__row totals__row--muted">
        <dt>Shipping</dt>
        <dd>Set by merchant</dd>
      </div>
      {showGrand ? (
        <div className="totals__row totals__row--grand">
          <dt>Total before shipping</dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
      ) : null}
    </dl>
  );
}
