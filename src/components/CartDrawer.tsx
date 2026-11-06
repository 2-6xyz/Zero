import { useRef } from 'react';
import { useCart } from '../cart/CartProvider';
import { storeConfig } from '../config/store';
import { galleryImages, price } from '../data/product';
import { formatPrice } from '../lib/currency';
import { scrollToSection } from '../hooks/useMotion';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { BagIcon, CloseIcon } from './Icons';
import { OrderTotals } from './OrderTotals';
import { ProductImage } from './ProductImage';
import { QuantityStepper } from './QuantityStepper';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export function CartDrawer({ open, onClose, onCheckout }: CartDrawerProps) {
  const { quantity, setQuantity, remove } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);
  useFocusTrap(open, panelRef, onClose);

  const frontImage = galleryImages[0];

  return (
    <>
      <div className={`scrim ${open ? 'is-open' : ''}`} onClick={onClose} aria-hidden="true" />
      <aside
        ref={panelRef}
        className={`drawer ${open ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="bag-title"
        aria-hidden={!open}
        inert={!open}
        tabIndex={-1}
      >
        <header className="drawer__head">
          <div>
            <h2 id="bag-title" className="drawer__title">
              Your bag <span className="drawer__count">({quantity})</span>
            </h2>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close bag">
            <CloseIcon size={22} />
          </button>
        </header>

        <div className="drawer__body">
          {quantity === 0 || !frontImage ? (
            <div className="drawer__empty">
              <span className="drawer__empty-icon" aria-hidden="true">
                <BagIcon size={30} />
              </span>
              <h3>Your bag is empty</h3>
              <p>The ZF-435 is waiting — one colourway, AED 40.</p>
              <button
                type="button"
                className="button button--primary"
                onClick={() => {
                  onClose();
                  window.setTimeout(() => scrollToSection('product'), 220);
                }}
              >
                Shop the ZF-435
              </button>
            </div>
          ) : (
            <>
              <article className="line-item">
                <div className="line-item__media">
                  <ProductImage src={frontImage.src} alt={frontImage.alt} className="line-item__image" loading="lazy" />
                </div>
                <div className="line-item__body">
                  <h3 className="line-item__name">ZF-435 Wireless Earbuds</h3>
                  <p className="line-item__variant">Matte black / orange</p>
                  <p className="line-item__price">
                    <span>{formatPrice(price.sale)}</span>
                    <s>{formatPrice(price.compareAt)}</s>
                    <span className="line-item__save">Save {formatPrice(price.savings)}</span>
                  </p>
                  <div className="line-item__controls">
                    <QuantityStepper
                      value={quantity}
                      onChange={(next) => setQuantity(Math.max(1, Math.min(storeConfig.maxQuantity, next)))}
                      max={storeConfig.maxQuantity}
                      label="Quantity in bag"
                      size="sm"
                    />
                    <button type="button" className="link-button" onClick={remove}>
                      Remove
                    </button>
                  </div>
                </div>
              </article>

              <OrderTotals />
              <p className="drawer__note">
                Shipping and taxes are not configured yet; they are confirmed with the merchant. No payment is collected
                on this site.
              </p>
            </>
          )}
        </div>

        {quantity > 0 ? (
          <footer className="drawer__foot">
            <button type="button" className="button button--primary button--lg" onClick={onCheckout}>
              Continue to Order
            </button>
            <button type="button" className="button button--ghost button--sm" onClick={onClose}>
              Keep shopping
            </button>
          </footer>
        ) : null}
      </aside>
    </>
  );
}
