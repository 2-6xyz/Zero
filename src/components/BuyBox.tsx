import { useEffect, useRef, useState } from 'react';
import { useCart } from '../cart/CartProvider';
import { storeConfig } from '../config/store';
import { price } from '../data/product';
import { formatPrice } from '../lib/currency';
import { BagIcon, CheckIcon } from './Icons';
import { QuantityStepper } from './QuantityStepper';

interface BuyBoxProps {
  onOpenCart: () => void;
}

export function BuyBox({ onOpenCart }: BuyBoxProps) {
  const { add } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  const handleAdd = () => {
    add(quantity);
    setAdded(true);
    onOpenCart();
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setAdded(false), 2200);
  };

  return (
    <div className="buybox">
      <p className="eyebrow">ZFORCE · Model ZF-435</p>
      <h3 className="buybox__title">ZF-435 True Wireless Stereo Earbuds</h3>

      <div className="buybox__price price-row price-row--stacked">
        <span className="price-row__now">
          <span className="price-row__currency">AED</span>
          <span className="price-row__amount">{price.sale}</span>
        </span>
        <span className="price-row__meta">
          <s className="price-row__was">{formatPrice(price.compareAt)}</s>
          <span className="chip chip--save">Save {formatPrice(price.savings)}</span>
        </span>
      </div>

      <p className="buybox__desc">
        A compact matte black charging case with a vivid orange interior, holding black earbuds with
        silicone tips and chrome-finish stem accents. The lid is marked Case Battery: 400mAh.
      </p>

      <div className="buybox__colour">
        <span className="buybox__label">Colour</span>
        <span className="swatch" aria-hidden="true">
          <span className="swatch__black" />
          <span className="swatch__orange" />
        </span>
        <span className="buybox__colour-name">Matte black / orange</span>
        <span className="buybox__single">As shown</span>
      </div>

      <div className="buybox__actions">
        <QuantityStepper
          value={quantity}
          onChange={(next) => setQuantity(Math.min(storeConfig.maxQuantity, Math.max(1, next)))}
          max={storeConfig.maxQuantity}
          label="Quantity"
        />
        <button type="button" className={`button button--primary button--lg buybox__add ${added ? 'is-added' : ''}`} onClick={handleAdd}>
          {added ? (
            <>
              <CheckIcon size={19} /> Added to Bag
            </>
          ) : (
            <>
              <BagIcon size={19} /> Add to Cart
            </>
          )}
        </button>
      </div>

      <p className="buybox__note">
        Price shown in AED. Shipping, taxes and payment method are confirmed by the merchant — nothing is charged on this site.
      </p>

      <dl className="breakdown" aria-label="Price breakdown">
        <div className="breakdown__row">
          <dt>Sale price</dt>
          <dd>{formatPrice(price.sale)} each</dd>
        </div>
        <div className="breakdown__row">
          <dt>Original price</dt>
          <dd>
            <s>{formatPrice(price.compareAt)}</s> each
          </dd>
        </div>
        <div className="breakdown__row breakdown__row--accent">
          <dt>You save</dt>
          <dd>{formatPrice(price.savings)} each</dd>
        </div>
      </dl>

      <ul className="buybox__facts" aria-label="Confirmed details">
        <li>TWS earbuds</li>
        <li>400mAh case marking</li>
        <li>Chrome-finish accents</li>
      </ul>
    </div>
  );
}
