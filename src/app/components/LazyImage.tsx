import { useState, useEffect, useRef } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderSrc?: string;
  onLoad?: () => void;
}

export function LazyImage({
  src,
  alt,
  className,
  placeholderSrc,
  onLoad
}: LazyImageProps) {
  const [imageSrc, setImageSrc] = useState(placeholderSrc || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1" height="1"%3E%3C/svg%3E');
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && imgRef.current) {
        setImageSrc(src);
        observer.unobserve(entry.target);
      }
    }, { rootMargin: '50px' });

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-50'} transition-opacity duration-300`}
      loading="lazy"
      onLoad={handleLoad}
    />
  );
}
