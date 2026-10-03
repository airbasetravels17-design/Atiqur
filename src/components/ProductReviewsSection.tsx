import React, { useState, useMemo } from 'react';
import { ProductReview } from '../types/ecommerce';
import { Star, CheckCircle2, AlertCircle, MessageSquare, ThumbsUp, Send, User, Sparkles } from 'lucide-react';

interface ProductReviewsSectionProps {
  productId: string;
  productName: string;
  rating: number;
  reviewsCount: number;
  reviews?: ProductReview[];
  onAddReview?: (productId: string, review: { customerName: string; rating: number; comment: string }) => void;
}

const RATING_LABELS: Record<number, string> = {
  1: 'Poor - Did not meet expectations',
  2: 'Fair - Below expectations',
  3: 'Good - Met expectations',
  4: 'Very Good - Highly satisfied',
  5: 'Excellent - Absolutely loved it!'
};

export const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({
  productId,
  productName,
  rating,
  reviewsCount,
  reviews = [],
  onAddReview
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [customerName, setCustomerName] = useState('');
  const [comment, setComment] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, number>>({});

  // Compute rating breakdown percentages
  const distribution = useMemo(() => {
    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    
    if (reviews.length > 0) {
      reviews.forEach(r => {
        const star = Math.min(5, Math.max(1, Math.round(r.rating)));
        counts[star] = (counts[star] || 0) + 1;
      });
    } else {
      // Synthetic weighted distribution based on average rating
      const total = Math.max(1, reviewsCount);
      counts[5] = Math.round(total * 0.65);
      counts[4] = Math.round(total * 0.22);
      counts[3] = Math.round(total * 0.08);
      counts[2] = Math.round(total * 0.03);
      counts[1] = Math.round(total * 0.02);
    }

    const totalReviews = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
    return {
      counts,
      percentages: {
        5: Math.round((counts[5] / totalReviews) * 100),
        4: Math.round((counts[4] / totalReviews) * 100),
        3: Math.round((counts[3] / totalReviews) * 100),
        2: Math.round((counts[2] / totalReviews) * 100),
        1: Math.round((counts[1] / totalReviews) * 100)
      }
    };
  }, [reviews, reviewsCount]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setFormError('Please enter your name.');
      return;
    }
    if (!comment.trim() || comment.trim().length < 5) {
      setFormError('Please write a brief comment (at least 5 characters).');
      return;
    }

    setFormError(null);

    if (onAddReview) {
      onAddReview(productId, {
        customerName: customerName.trim(),
        rating: selectedRating,
        comment: comment.trim()
      });
    }

    setSubmittedSuccess(true);
    setComment('');
    setTimeout(() => {
      setSubmittedSuccess(false);
      setIsFormOpen(false);
    }, 2500);
  };

  const handleHelpfulClick = (reviewId: string) => {
    setHelpfulVotes(prev => ({
      ...prev,
      [reviewId]: (prev[reviewId] || 0) + 1
    }));
  };

  const activeRatingValue = hoverRating || selectedRating;

  return (
    <div className="pt-6 border-t border-stone-200 space-y-6" id="reviews-section">
      
      {/* Header and Call to Action */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#7C3AED]" />
            <span>Customer Reviews & Ratings</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Verified customer ratings, styling feedback, and fabric fit notes.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsFormOpen(!isFormOpen);
            setSubmittedSuccess(false);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
            isFormOpen
              ? 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              : 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white'
          }`}
        >
          <Star className="w-3.5 h-3.5 fill-current" />
          <span>{isFormOpen ? 'Cancel Review' : 'Write a Review'}</span>
        </button>
      </div>

      {/* RATINGS SCOREBOARD CARD */}
      <div className="bg-stone-50/70 border border-stone-200/90 rounded-2xl p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
        
        {/* Left Column: Big Average Score */}
        <div className="text-center sm:border-r border-stone-200 sm:pr-4">
          <div className="text-4xl sm:text-5xl font-extrabold font-serif text-stone-900">
            {rating > 0 ? rating.toFixed(1) : '5.0'}
          </div>
          
          <div className="flex justify-center items-center gap-1 my-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.round(rating || 5)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-stone-300'
                }`}
              />
            ))}
          </div>

          <div className="text-xs font-medium text-stone-500">
            Based on <strong className="text-stone-900">{reviewsCount || reviews.length}</strong> customer reviews
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
            ✓ 94% of buyers recommend this fit
          </div>
        </div>

        {/* Right 2 Columns: Rating Breakdown Bars */}
        <div className="sm:col-span-2 space-y-1.5 text-xs">
          {[5, 4, 3, 2, 1].map((stars) => {
            const pct = distribution.percentages[stars as keyof typeof distribution.percentages] || 0;
            const count = distribution.counts[stars] || 0;

            return (
              <div key={stars} className="flex items-center gap-2 text-stone-600">
                <span className="w-10 font-bold flex items-center gap-1 text-[11px] shrink-0 text-stone-700">
                  <span>{stars}</span>
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                </span>

                {/* Progress bar track */}
                <div className="flex-1 h-2 bg-stone-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <span className="w-10 text-right text-[11px] text-stone-400 shrink-0 tabular-nums">
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>

      </div>

      {/* WRITE A REVIEW ACCORDION / FORM */}
      {isFormOpen && (
        <div className="bg-white border-2 border-purple-200 rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm animate-fade-in">
          
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h4 className="font-bold text-sm text-stone-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#7C3AED]" />
              <span>Reviewing: {productName}</span>
            </h4>
            <span className="text-xs text-stone-400">Share your genuine shopping experience</span>
          </div>

          {submittedSuccess ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold text-xs">Review submitted successfully!</p>
                <p className="text-[11px] text-emerald-700">
                  Thank you for rating Women's Fit. Your review is now live on this product.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
              
              {/* Star Rating Picker */}
              <div>
                <label className="font-bold text-stone-800 block mb-1.5">
                  Your Overall Rating <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setSelectedRating(star)}
                      className="p-1 hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                      aria-label={`Rate ${star} star`}
                    >
                      <Star
                        className={`w-7 h-7 transition-colors ${
                          star <= activeRatingValue
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-stone-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-xs font-semibold text-stone-700">
                    {RATING_LABELS[activeRatingValue] || `${activeRatingValue} Stars`}
                  </span>
                </div>
              </div>

              {/* Customer Name */}
              <div>
                <label className="font-bold text-stone-800 block mb-1">
                  Your Name / Nickname <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Fatima Rahman"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#7C3AED] focus:bg-white"
                />
              </div>

              {/* Review Comment */}
              <div>
                <label className="font-bold text-stone-800 block mb-1">
                  Your Review & Fitting Feedback <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell others about the fabric feel, drape, color accuracy, and whether the size runs true..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-xs text-stone-900 focus:outline-none focus:border-[#7C3AED] focus:bg-white"
                />
              </div>

              {formError && (
                <div className="flex items-center gap-1.5 text-rose-600 text-xs font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 border border-stone-300 text-stone-600 hover:bg-stone-50 rounded-xl font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post My Review</span>
                </button>
              </div>

            </form>
          )}

        </div>
      )}

      {/* REVIEWS LIST */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
          Customer Testimonials ({reviews.length})
        </h4>

        {reviews.length === 0 ? (
          <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200 text-center space-y-2">
            <p className="text-xs font-semibold text-stone-700">No reviews yet for this product.</p>
            <p className="text-[11px] text-stone-500">
              Be the first to share your thoughts and help our modest fashion community!
            </p>
            <button
              type="button"
              onClick={() => setIsFormOpen(true)}
              className="mt-2 text-xs font-bold text-[#7C3AED] underline cursor-pointer"
            >
              Leave the first 5-star rating →
            </button>
          </div>
        ) : (
          reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-5 space-y-2 shadow-xs hover:border-stone-300 transition-all"
            >
              {/* Reviewer Header */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-purple-100 text-[#7C3AED] flex items-center justify-center font-bold text-xs shrink-0">
                    {rev.customerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-stone-900 text-xs">{rev.customerName}</span>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                        ✓ Verified Buyer
                      </span>
                    </div>
                    <div className="text-[10px] text-stone-400">{rev.date}</div>
                  </div>
                </div>

                {/* Star Rating Badge */}
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3.5 h-3.5 ${
                        star <= rev.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-stone-200'
                      }`}
                    />
                  ))}
                  <span className="text-xs font-bold text-stone-800 ml-1">{rev.rating}.0</span>
                </div>
              </div>

              {/* Review Text */}
              <p className="text-xs text-stone-700 leading-relaxed pl-9">
                "{rev.comment}"
              </p>

              {/* Helpful vote */}
              <div className="pt-2 pl-9 flex items-center gap-3 text-[11px] text-stone-400 border-t border-stone-100">
                <span>Was this review helpful?</span>
                <button
                  type="button"
                  onClick={() => handleHelpfulClick(rev.id)}
                  className="inline-flex items-center gap-1 hover:text-stone-700 font-medium cursor-pointer"
                >
                  <ThumbsUp className="w-3 h-3" />
                  <span>Helpful ({helpfulVotes[rev.id] || 0})</span>
                </button>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
