'use client';

import { Star } from 'lucide-react';

interface RatingSummaryProps {
  rating: number;
  reviewCount: number;
  size?: 'sm' | 'md'; // sm for cards, md for larger displays
  showCount?: boolean;
}

export function RatingSummary({
  rating,
  reviewCount,
  size = 'sm',
  showCount = true,
}: RatingSummaryProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  const starSize = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';

  return (
    <div className="flex items-center gap-1">
      {/* Stars */}
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <div key={i}>
            {i < fullStars ? (
              <Star className={`${starSize} fill-yellow-400 text-yellow-400`} />
            ) : i === fullStars && hasHalfStar ? (
              <div className="relative">
                <Star className={`${starSize} text-slate-300`} />
                <div className="absolute inset-0 overflow-hidden w-1/2">
                  <Star className={`${starSize} fill-yellow-400 text-yellow-400`} />
                </div>
              </div>
            ) : (
              <Star className={`${starSize} text-slate-300`} />
            )}
          </div>
        ))}
      </div>

      {/* Rating Number */}
      <span className={`font-medium text-slate-900 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
        {rating.toFixed(1)}
      </span>

      {/* Count */}
      {showCount && (
        <span className={`text-slate-500 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
          ({reviewCount})
        </span>
      )}
    </div>
  );
}