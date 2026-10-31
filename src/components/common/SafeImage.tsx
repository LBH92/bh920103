import React, { useState } from 'react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  fallbackComponent?: React.ReactNode;
}

// Minimal inline SVG fallback avatar data URI
export const DEFAULT_AVATAR_FALLBACK = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="%23334155"><circle cx="32" cy="24" r="14" fill="%2364748b"/><path d="M10 56c0-12 10-20 22-20s22 8 22 20z" fill="%2364748b"/></svg>`;

// Minimal inline SVG fallback image data URI
export const DEFAULT_IMAGE_FALLBACK = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150" fill="%231e293b"><rect width="200" height="150" rx="8" fill="%231e293b"/><text x="100" y="80" fill="%2394a3b8" font-size="11" text-anchor="middle" font-family="sans-serif">이미지 없음</text></svg>`;

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt = '',
  className = '',
  fallbackSrc = DEFAULT_IMAGE_FALLBACK,
  fallbackComponent,
  onError,
  ...rest
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError && fallbackComponent) {
    return <>{fallbackComponent}</>;
  }

  return (
    <img
      src={hasError ? fallbackSrc : (src || fallbackSrc)}
      alt={alt}
      className={className}
      onError={(e) => {
        if (!hasError) {
          setHasError(true);
        }
        if (onError) {
          onError(e);
        }
      }}
      loading="lazy"
      {...rest}
    />
  );
};
