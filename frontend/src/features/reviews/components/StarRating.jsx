import React from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ rating = 0, max = 5 }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
        <Star
          key={star}
          className={`w-3.5 h-3.5 ${
            star <= rating
              ? 'fill-amber-400 text-amber-400'
              : 'fill-transparent text-slate-300'
          }`}
        />
      ))}
      <span className="text-[11px] font-bold text-slate-700 ml-1">
        {rating}/{max}
      </span>
    </div>
  );
}
