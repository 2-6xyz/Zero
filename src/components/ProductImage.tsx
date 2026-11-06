import { useState } from 'react';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'eager' | 'lazy';
  fetchPriority?: 'high' | 'low' | 'auto';
  sizes?: string;
  variant?: 'panel' | 'compact';
}

/**
 * Renders a supplied product photograph, reserving space via CSS on its wrapper.
 * If the file has not been added to public/images yet, a neutral panel appears
 * instead of a broken-image icon — no substitute product artwork is generated.
 */
export function ProductImage({
  src,
  alt,
  className = '',
  loading = 'lazy',
  fetchPriority,
  sizes,
  variant = 'panel',
}: ProductImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return variant === 'compact' ? (
      <div className={`image-fallback image-fallback--compact ${className}`.trim()} role="img" aria-label={alt}>
        <span className="image-fallback__mark">ZF</span>
      </div>
    ) : (
      <div className={`image-fallback ${className}`.trim()} role="img" aria-label={alt}>
        <span className="image-fallback__mark">ZFORCE</span>
        <span className="image-fallback__text">Product image unavailable</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      decoding="async"
      fetchPriority={fetchPriority}
      sizes={sizes}
      onError={() => setFailed(true)}
    />
  );
}
