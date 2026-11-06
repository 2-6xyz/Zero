import { MinusIcon, PlusIcon } from './Icons';

interface QuantityStepperProps {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max: number;
  label: string;
  size?: 'md' | 'sm';
}

export function QuantityStepper({ value, onChange, min = 1, max, label, size = 'md' }: QuantityStepperProps) {
  return (
    <div className={`qty qty--${size}`} role="group" aria-label={label}>
      <button
        type="button"
        className="qty__button"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        <MinusIcon size={16} />
      </button>
      <span className="qty__value" key={value} aria-live="polite" aria-atomic="true">
        {value}
      </span>
      <button
        type="button"
        className="qty__button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <PlusIcon size={16} />
      </button>
    </div>
  );
}
