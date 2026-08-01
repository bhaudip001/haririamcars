'use client';
import { useState } from 'react';
import Image from 'next/image';
import { IconCarOff } from '@tabler/icons-react';
import { generateBlurPlaceholder } from '@/lib/utils';

export default function CarImage({ src, alt, className, priority = false, sizes }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // If no source is provided at all, or if an error occurred, show the fallback UI
  if (!src || hasError) {
    return (
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 shadow-inner">
        <IconCarOff size={48} stroke={1.5} className="mb-2 opacity-60" />
        <span className="text-sm font-semibold tracking-wide uppercase opacity-80">
          Image Not Available
        </span>
      </div>
    );
  }

  return (
    <>
      {!isLoaded && (
        <div className="absolute inset-0 z-10 animate-pulse bg-gray-200 dark:bg-white/10" />
      )}
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        placeholder="blur"
        blurDataURL={generateBlurPlaceholder()}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          setIsLoaded(true);
        }}
        className={`${className} ${
          isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'
        }`}
      />
    </>
  );
}
