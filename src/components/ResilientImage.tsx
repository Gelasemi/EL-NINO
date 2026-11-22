import { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  aspectClassName?: string;
}

export function ResilientImage({
  src,
  alt,
  caption,
  className = '',
  aspectClassName = 'aspect-[4/3]',
}: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <figure className="flex flex-col">
      <div
        className={`relative overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 ${aspectClassName}`}
      >
        {!hasError ? (
          <img
            src={src}
            alt={alt}
            referrerPolicy="no-referrer"
            onError={() => setHasError(true)}
            className={`h-full w-full object-cover ${className}`}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-zinc-100 to-zinc-200 p-6 text-center text-zinc-500">
            <ImageOff className="h-6 w-6 text-zinc-400" aria-hidden="true" />
            <p className="max-w-xs text-xs font-medium text-zinc-600">{alt}</p>
          </div>
        )}
      </div>
      {caption && (
        <figcaption className="mt-2.5 font-serif text-xs italic leading-relaxed text-zinc-500">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
