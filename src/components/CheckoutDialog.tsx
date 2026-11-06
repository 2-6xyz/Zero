import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
} from 'react';
import { useCart } from '../cart/CartProvider';
import { storeConfig } from '../config/store';
import { galleryImages, price } from '../data/product';
import { formatPrice } from '../lib/currency';
import { scrollToSection } from '../hooks/useMotion';
import { useFocusTrap } from '../hooks/useFocusTrap';
import {
  buildOrderRequest,
  orderSummaryText,
  submitOrder,
  type CustomerDetails,
  type OrderRequest,
  type SubmitOutcome,
} from '../lib/orders';
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, CloseIcon, CopyIcon } from './Icons';
import { QuantityStepper } from './QuantityStepper';
import { ProductImage } from './ProductImage';

const EMIRATES = [
  'Abu Dhabi',
  'Dubai',
  'Sharjah',
  'Ajman',
  'Umm Al Quwain',
  'Ras Al Khaimah',
  'Fujairah',
] as const;

type FieldName = keyof CustomerDetails;
type Errors = Partial<Record<FieldName | 'consent', string>>;

const EMPTY_CUSTOMER: CustomerDetails = {
  fullName: '',
  email: '',
  phone: '',
  emirate: '',
  city: '',
  address: '',
  notes: '',
};

function validateField(name: FieldName, value: string): string | undefined {
  const trimmed = value.trim();
  switch (name) {
    case 'fullName':
      if (trimmed.length === 0) return 'Please enter your full name.';
      if (trimmed.length < 2) return 'Please enter at least 2 characters.';
      return undefined;
    case 'email':
      if (trimmed.length === 0) return 'Please enter an email address.';
      if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(trimmed)) return 'Enter a valid email, for example name@example.com.';
      return undefined;
    case 'phone': {
      if (trimmed.length === 0) return 'Please enter a phone number.';
      const digits = trimmed.replace(/\D/g, '');
      if (digits.length < 7 || digits.length > 15) return 'Enter a phone number with 7 to 15 digits.';
      if (!/^\+?[0-9][0-9\s\-()]*$/.test(trimmed)) return 'Use digits, spaces, +, - or brackets only.';
      return undefined;
    }
    case 'emirate':
      if (!trimmed) return 'Please select an emirate.';
      return undefined;
    case 'city':
      if (trimmed.length < 2) return 'Please enter your city or area.';
      return undefined;
    case 'address':
      if (trimmed.length < 6) return 'Please enter a delivery address (at least 6 characters).';
      return undefined;
    case 'notes':
      if (value.length > 500) return 'Please keep notes under 500 characters.';
      return undefined;
    default:
      return undefined;
  }
}

function validateAll(customer: CustomerDetails, consent: boolean): Errors {
  const errors: Errors = {};
  (Object.keys(customer) as FieldName[]).forEach((field) => {
    const message = validateField(field, customer[field]);
    if (message) errors[field] = message;
  });
  if (!consent) errors.consent = 'Please confirm we may contact you about this order request.';
  return errors;
}

interface FieldProps {
  id: string;
  label: string;
  name: FieldName;
  value: string;
  error?: string;
  type?: string;
  autoComplete?: string;
  inputMode?: 'text' | 'email' | 'tel';
  placeholder?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  optional?: boolean;
}

function Field({
  id,
  label,
  name,
  value,
  error,
  type = 'text',
  autoComplete,
  inputMode,
  placeholder,
  onChange,
  onBlur,
  optional,
}: FieldProps) {
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label htmlFor={id}>
        {label}
        {optional ? <span className="field__optional">Optional</span> : null}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        required={!optional}
        maxLength={name === 'notes' ? 500 : 120}
      />
      {error ? (
        <p className="field__error" id={`${id}-error`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

interface CheckoutDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CheckoutDialog({ open, onClose }: CheckoutDialogProps) {
  const { quantity, setQuantity, remove, clear } = useCart();
  const dialogRef = useRef<HTMLDivElement>(null);
  const successTitleRef = useRef<HTMLHeadingElement>(null);
  const baseId = useId();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [customer, setCustomer] = useState<CustomerDetails>(EMPTY_CUSTOMER);
  const [consent, setConsent] = useState(false);
  const [touched, setTouched] = useState<Partial<Record<FieldName | 'consent', boolean>>>({});
  const [attempted, setAttempted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [outcome, setOutcome] = useState<SubmitOutcome | null>(null);
  const [order, setOrder] = useState<OrderRequest | null>(null);
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle');

  const errors = validateAll(customer, consent);

  const close = useCallback(() => {
    if (submitting) return;
    onClose();
  }, [onClose, submitting]);

  useFocusTrap(open, dialogRef, close);

  useEffect(() => {
    if (open) {
      setStep(1);
      setOutcome(null);
      setCopyState('idle');
      setAttempted(false);
      setTouched({});
    }
  }, [open]);

  useEffect(() => {
    if (outcome?.status !== 'submitted') return;
    const timer = window.setTimeout(() => successTitleRef.current?.focus(), 60);
    return () => window.clearTimeout(timer);
  }, [outcome]);

  const updateField = (name: FieldName, value: string) => {
    setCustomer((current) => ({ ...current, [name]: value }));
  };

  const visibleError = (name: FieldName | 'consent') => (touched[name] || attempted ? errors[name] : undefined);

  const goToStep = (next: 1 | 2 | 3) => {
    setOutcome(null);
    setStep(next);
  };

  const goToDelivery = () => {
    setStep(2);
  };

  const continueToReview = () => {
    setAttempted(true);
    if (Object.keys(errors).length > 0) return;
    setStep(3);
  };

  const placeOrder = async () => {
    if (quantity === 0) return;
    setSubmitting(true);
    const request = buildOrderRequest(quantity, customer);
    setOrder(request);
    const result = await submitOrder(request);
    setSubmitting(false);
    setOutcome(result);
    if (result.status === 'submitted') clear();
  };

  const copySummary = async () => {
    if (!order) return;
    const text = orderSummaryText(order);
    try {
      await navigator.clipboard.writeText(text);
      setCopyState('copied');
    } catch {
      setCopyState('error');
    }
    window.setTimeout(() => setCopyState('idle'), 2600);
  };

  const stepLabel = outcome ? 'Confirmation' : ['Bag', 'Delivery', 'Review'][step - 1];

  return (
    <>
      <div className={`checkout-scrim ${open ? 'is-open' : ''}`} onClick={close} aria-hidden="true" />
      <div
        ref={dialogRef}
        className={`checkout ${open ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
        aria-hidden={!open}
        inert={!open}
        tabIndex={-1}
      >
        <header className="checkout__head">
          <div>
            <p className="eyebrow">Order request · No payment</p>
            <h2 id="checkout-title" className="checkout__title">
              {stepLabel}
            </h2>
          </div>
          <button type="button" className="icon-button" onClick={close} aria-label="Close checkout" disabled={submitting}>
            <CloseIcon size={22} />
          </button>
        </header>

        {outcome?.status === 'submitted' ? (
          <div className="checkout__body success">
            <span className={`status-chip ${outcome.delivered ? 'status-chip--sent' : 'status-chip--saved'}`}>
              {outcome.delivered ? <CheckIcon size={16} /> : null}
              {outcome.delivered ? 'Order request sent' : 'Order request saved on this device'}
            </span>

            <h3 className="success__title" ref={successTitleRef} tabIndex={-1}>
              Thank you, {customer.fullName.trim().split(' ')[0] || 'there'}.
            </h3>
            <p className="success__lead">
              Your reference is <strong>{outcome.reference}</strong>. No payment has been taken and no card details were
              requested.
            </p>

            {!outcome.delivered ? (
              <div className="notice notice--warn">
                <strong>Order system not connected yet.</strong> This preview storefront has no order endpoint, so the
                request was saved in this browser only — it has not reached the merchant. Nothing has been charged.
              </div>
            ) : (
              <div className="notice">
                The merchant will confirm stock, shipping cost and your payment method using the contact details you
                provided.
              </div>
            )}

            {order ? (
              <div className="recap">
                <h4 className="recap__title">Order summary</h4>
                <dl className="recap__list">
                  <div>
                    <dt>Product</dt>
                    <dd>ZF-435 Wireless Earbuds</dd>
                  </div>
                  <div>
                    <dt>Quantity</dt>
                    <dd>{order.product.quantity}</dd>
                  </div>
                  <div>
                    <dt>Unit price</dt>
                    <dd>
                      {formatPrice(order.product.unitPrice)} <s>{formatPrice(order.product.compareAtUnitPrice)}</s>
                    </dd>
                  </div>
                  <div>
                    <dt>You save</dt>
                    <dd>{formatPrice(order.totals.savings)}</dd>
                  </div>
                  <div>
                    <dt>Total before shipping</dt>
                    <dd>{formatPrice(order.totals.subtotal)}</dd>
                  </div>
                  <div>
                    <dt>Delivery to</dt>
                    <dd>
                      {order.customer.city}, {order.customer.emirate}
                    </dd>
                  </div>
                </dl>
              </div>
            ) : null}

            <div className="success__actions">
              <button type="button" className="button button--secondary" onClick={copySummary} disabled={!order}>
                <CopyIcon size={17} />
                {copyState === 'copied' ? 'Copied' : copyState === 'error' ? 'Copy unavailable' : 'Copy order summary'}
              </button>
              <button
                type="button"
                className="button button--primary"
                onClick={() => {
                  onClose();
                  window.setTimeout(() => scrollToSection('product'), 220);
                }}
              >
                Back to the store
              </button>
            </div>
          </div>
        ) : (
          <>
            <ol className="steps" aria-label="Checkout progress">
              {['Bag', 'Delivery', 'Review'].map((label, index) => {
                const stepNumber = index + 1;
                const status = step === stepNumber ? 'current' : step > stepNumber ? 'done' : 'todo';
                return (
                  <li key={label} className={`steps__item is-${status}`} aria-current={status === 'current' ? 'step' : undefined}>
                    <span className="steps__dot" aria-hidden="true">
                      {status === 'done' ? <CheckIcon size={13} /> : stepNumber}
                    </span>
                    <span className="steps__label">{label}</span>
                  </li>
                );
              })}
            </ol>

            <div className="checkout__body">
              {quantity === 0 ? (
                <div className="checkout__empty">
                  <h3>Your bag is empty</h3>
                  <p>Add the ZF-435 to your bag before starting an order request.</p>
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
              ) : null}

              {quantity > 0 && step === 1 ? (
                <div className="review">
                  <article className="review__item">
                    <div className="review__media">
                      <ProductImage
                        src={galleryImages[0]?.src ?? ''}
                        alt={galleryImages[0]?.alt ?? 'ZFORCE ZF-435'}
                        className="review__image"
                        loading="lazy"
                      />
                    </div>
                    <div className="review__info">
                      <p className="eyebrow">ZFORCE · ZF-435</p>
                      <h3>ZF-435 Wireless Earbuds</h3>
                      <p className="review__variant">Matte black / orange</p>
                      <p className="review__price">
                        {formatPrice(price.sale)} <s>{formatPrice(price.compareAt)}</s>
                        <span className="chip chip--save">Save {formatPrice(price.savings)}</span>
                      </p>
                      <div className="review__controls">
                        <QuantityStepper
                          value={quantity}
                          onChange={(next) => setQuantity(Math.max(1, Math.min(storeConfig.maxQuantity, next)))}
                          max={storeConfig.maxQuantity}
                          label="Quantity"
                          size="sm"
                        />
                        <button type="button" className="link-button" onClick={remove}>
                          Remove
                        </button>
                      </div>
                    </div>
                  </article>

                  <div className="review__breakdown">
                    <div className="review__line">
                      <span>Sale price</span>
                      <span>{formatPrice(price.sale)} each</span>
                    </div>
                    <div className="review__line">
                      <span>Original price</span>
                      <span>
                        <s>{formatPrice(price.compareAt)}</s> each
                      </span>
                    </div>
                    <div className="review__line review__line--accent">
                      <span>Discount</span>
                      <span>{formatPrice(price.savings)} each</span>
                    </div>
                    <div className="review__line review__line--total">
                      <span>Subtotal · {quantity} {quantity === 1 ? 'unit' : 'units'}</span>
                      <span>{formatPrice(quantity * price.sale)}</span>
                    </div>
                  </div>

                  <p className="review__note">
                    Shipping and taxes are not configured for this store. They will be confirmed by the merchant before
                    any payment.
                  </p>
                </div>
              ) : null}

              {quantity > 0 && step === 2 ? (
                <form
                  id="delivery-form"
                  className="form"
                  noValidate
                  onSubmit={(event) => {
                    event.preventDefault();
                    continueToReview();
                  }}
                >
                  <div className="form__intro">
                    <p className="eyebrow">Delivery details</p>
                    <h3>Where should the order go?</h3>
                    <p>Used only to confirm this order request. Nothing is charged.</p>
                  </div>

                  <div className="form__grid">
                    <Field
                      id={`${baseId}-name`}
                      label="Full name"
                      name="fullName"
                      value={customer.fullName}
                      error={visibleError('fullName')}
                      autoComplete="name"
                      placeholder="Your name"
                      onChange={(event) => updateField('fullName', event.target.value)}
                      onBlur={() => setTouched((current) => ({ ...current, fullName: true }))}
                    />
                    <Field
                      id={`${baseId}-email`}
                      label="Email"
                      name="email"
                      type="email"
                      value={customer.email}
                      error={visibleError('email')}
                      autoComplete="email"
                      inputMode="email"
                      placeholder="name@example.com"
                      onChange={(event) => updateField('email', event.target.value)}
                      onBlur={() => setTouched((current) => ({ ...current, email: true }))}
                    />
                    <Field
                      id={`${baseId}-phone`}
                      label="Phone"
                      name="phone"
                      type="tel"
                      value={customer.phone}
                      error={visibleError('phone')}
                      autoComplete="tel"
                      inputMode="tel"
                      placeholder="+971 50 000 0000"
                      onChange={(event) => updateField('phone', event.target.value)}
                      onBlur={() => setTouched((current) => ({ ...current, phone: true }))}
                    />

                    <div className={`field ${visibleError('emirate') ? 'has-error' : ''}`}>
                      <label htmlFor={`${baseId}-emirate`}>Emirate</label>
                      <select
                        id={`${baseId}-emirate`}
                        name="emirate"
                        value={customer.emirate}
                        onChange={(event) => updateField('emirate', event.target.value)}
                        onBlur={() => setTouched((current) => ({ ...current, emirate: true }))}
                        aria-invalid={visibleError('emirate') ? true : undefined}
                        aria-describedby={visibleError('emirate') ? `${baseId}-emirate-error` : undefined}
                        required
                      >
                        <option value="">Select an emirate</option>
                        {EMIRATES.map((emirate) => (
                          <option key={emirate} value={emirate}>
                            {emirate}
                          </option>
                        ))}
                      </select>
                      {visibleError('emirate') ? (
                        <p className="field__error" id={`${baseId}-emirate-error`}>
                          {visibleError('emirate')}
                        </p>
                      ) : null}
                    </div>

                    <Field
                      id={`${baseId}-city`}
                      label="City / area"
                      name="city"
                      value={customer.city}
                      error={visibleError('city')}
                      autoComplete="address-level2"
                      placeholder="e.g. Al Barsha"
                      onChange={(event) => updateField('city', event.target.value)}
                      onBlur={() => setTouched((current) => ({ ...current, city: true }))}
                    />
                    <Field
                      id={`${baseId}-address`}
                      label="Delivery address"
                      name="address"
                      value={customer.address}
                      error={visibleError('address')}
                      autoComplete="street-address"
                      placeholder="Building, street, area"
                      onChange={(event) => updateField('address', event.target.value)}
                      onBlur={() => setTouched((current) => ({ ...current, address: true }))}
                    />

                    <div className={`field field--wide ${visibleError('notes') ? 'has-error' : ''}`}>
                      <label htmlFor={`${baseId}-notes`}>
                        Delivery notes <span className="field__optional">Optional</span>
                      </label>
                      <textarea
                        id={`${baseId}-notes`}
                        name="notes"
                        value={customer.notes}
                        onChange={(event) => updateField('notes', event.target.value)}
                        onBlur={() => setTouched((current) => ({ ...current, notes: true }))}
                        rows={3}
                        maxLength={500}
                        placeholder="Anything the courier should know"
                        aria-invalid={visibleError('notes') ? true : undefined}
                        aria-describedby={visibleError('notes') ? `${baseId}-notes-error` : undefined}
                      />
                      {visibleError('notes') ? (
                        <p className="field__error" id={`${baseId}-notes-error`}>
                          {visibleError('notes')}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className={`consent ${visibleError('consent') ? 'has-error' : ''}`}>
                    <label className="consent__label">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(event) => {
                          setConsent(event.target.checked);
                          setTouched((current) => ({ ...current, consent: true }));
                        }}
                        aria-invalid={visibleError('consent') ? true : undefined}
                        aria-describedby={visibleError('consent') ? `${baseId}-consent-error` : undefined}
                      />
                      <span>I agree to be contacted about this order request.</span>
                    </label>
                    {visibleError('consent') ? (
                      <p className="field__error" id={`${baseId}-consent-error`}>
                        {visibleError('consent')}
                      </p>
                    ) : null}
                  </div>

                  <button type="submit" className="visually-hidden-submit" tabIndex={-1} aria-hidden="true">
                    Continue to review
                  </button>
                </form>
              ) : null}

              {quantity > 0 && step === 3 ? (
                <div className="confirm">
                  <div className="confirm__block">
                    <div className="confirm__head">
                      <h3>Order</h3>
                      <button type="button" className="link-button" onClick={() => goToStep(1)}>
                        Edit bag
                      </button>
                    </div>
                    <p className="confirm__item">
                      ZF-435 Wireless Earbuds · {quantity} {quantity === 1 ? 'unit' : 'units'}
                    </p>
                    <p className="confirm__meta">
                      {formatPrice(price.sale)} each · was {formatPrice(price.compareAt)} · save {formatPrice(price.savings)} each
                    </p>
                    <p className="confirm__total">
                      <span>Total before shipping</span>
                      <strong>{formatPrice(quantity * price.sale)}</strong>
                    </p>
                  </div>

                  <div className="confirm__block">
                    <div className="confirm__head">
                      <h3>Delivery</h3>
                      <button type="button" className="link-button" onClick={() => goToStep(2)}>
                        Edit delivery
                      </button>
                    </div>
                    <p className="confirm__item">{customer.fullName}</p>
                    <p className="confirm__meta">
                      {customer.address}
                      <br />
                      {customer.city}, {customer.emirate}, {storeConfig.deliveryCountry}
                    </p>
                    <p className="confirm__meta">
                      {customer.email}
                      <br />
                      {customer.phone}
                    </p>
                    {customer.notes ? <p className="confirm__meta">Notes: {customer.notes}</p> : null}
                  </div>

                  {outcome?.status === 'failed' ? (
                    <div className="notice notice--warn" role="alert">
                      {outcome.message} Your saved reference is {outcome.reference}.
                    </div>
                  ) : null}

                  <div className={`notice ${storeConfig.orderEndpoint ? '' : 'notice--warn'}`}>
                    {storeConfig.orderEndpoint ? (
                      <>No payment is collected here. Submitting sends an order request; the merchant confirms payment and delivery separately.</>
                    ) : (
                      <>
                        <strong>Preview storefront.</strong> No order system is connected, so submitting will save the
                        request in this browser only. It will not be sent to the merchant and no payment is taken.
                      </>
                    )}
                  </div>
                </div>
              ) : null}
            </div>

            <footer className="checkout__foot">
              {step === 1 ? (
                <>
                  <button type="button" className="button button--ghost" onClick={onClose}>
                    Back to bag
                  </button>
                  <button type="button" className="button button--primary" onClick={goToDelivery} disabled={quantity === 0}>
                    Continue
                    <ArrowRightIcon size={17} />
                  </button>
                </>
              ) : null}

              {step === 2 ? (
                <>
                  <button type="button" className="button button--ghost" onClick={() => goToStep(1)}>
                    <ArrowLeftIcon size={17} />
                    Back
                  </button>
                  <button type="submit" form="delivery-form" className="button button--primary">
                    Review order
                    <ArrowRightIcon size={17} />
                  </button>
                </>
              ) : null}

              {step === 3 ? (
                <>
                  <button type="button" className="button button--ghost" onClick={() => goToStep(2)} disabled={submitting}>
                    <ArrowLeftIcon size={17} />
                    Back
                  </button>
                  <button type="button" className="button button--primary" onClick={placeOrder} disabled={submitting}>
                    {submitting ? 'Submitting…' : 'Submit order request'}
                    {submitting ? null : <ArrowRightIcon size={17} />}
                  </button>
                </>
              ) : null}
            </footer>
          </>
        )}
      </div>
    </>
  );
}
