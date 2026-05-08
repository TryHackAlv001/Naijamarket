'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useProductReviews } from '@/hooks/useReviews';
import { ReviewForm } from './ReviewForm';
import { RatingsDisplay, ReviewsList } from './ReviewsDisplay';

interface ProductReviewsSectionProps {
  productId: string;
  productName?: string;
  avgRating?: number;
  reviewCount?: number;
}

export function ProductReviewsSection({
  productId,
  productName = 'Product',
  avgRating = 0,
  reviewCount = 0,
}: ProductReviewsSectionProps) {
  const { user } = useAuthStore();
  const {
    reviews,
    loading,
    total,
    page,
    sort,
    setPage,
    setSort,
    hasMorePages,
    refresh,
  } = useProductReviews(productId);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [checkingPurchase, setCheckingPurchase] = useState(true);

  // Check if user has already reviewed and if they can review
  useEffect(() => {
    const checkReviewStatus = async () => {
      if (!user || !productId) {
        setCanReview(false);
        setCheckingPurchase(false);
        return;
      }

      try {
        // Check if user already reviewed this product
        const existingReview = reviews.find(r => r.buyer_id === user.id);
        setAlreadyReviewed(!!existingReview);

        // If already reviewed, they can't review again
        if (existingReview) {
          setCanReview(false);
          setCheckingPurchase(false);
          return;
        }

        // Try to submit a review - if it fails with 403, they can't review
        // We'll just assume they can review if they're trying to submit
        setCanReview(true);
        setCheckingPurchase(false);
      } catch (error) {
        console.error('Error checking review status:', error);
        setCheckingPurchase(false);
      }
    };

    if (reviews.length > 0) {
      checkReviewStatus();
    }
  }, [user, productId, reviews]);

  const handleReviewSubmitted = () => {
    setAlreadyReviewed(true);
    setShowReviewForm(false);
    refresh();
  };

  return (
    <div className="space-y-6">
      {/* Ratings Overview */}
      <RatingsDisplay
        productId={productId}
        avgRating={avgRating}
        reviewCount={total}
      />

      {/* Review Form */}
      {user && (
        <>
          {!showReviewForm && !alreadyReviewed && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="w-full rounded-full bg-blue-600 py-3 font-medium text-white hover:bg-blue-700"
            >
              Write a Review
            </button>
          )}

          {showReviewForm && !alreadyReviewed && (
            <ReviewForm
              productId={productId}
              onReviewSubmitted={handleReviewSubmitted}
              onClose={() => setShowReviewForm(false)}
              disabled={!canReview && !checkingPurchase}
              alreadyReviewed={alreadyReviewed}
            />
          )}

          {alreadyReviewed && !showReviewForm && (
            <div className="rounded-3xl border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm text-blue-700">✓ You've already reviewed this product</p>
            </div>
          )}
        </>
      )}

      {!user && (
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-center">
          <p className="text-sm text-slate-600">Sign in to write a review</p>
        </div>
      )}

      {/* Reviews List */}
      <ReviewsList
        reviews={reviews}
        loading={loading}
        page={page}
        hasMorePages={hasMorePages}
        sort={sort}
        onPageChange={setPage}
        onSortChange={setSort}
      />
    </div>
  );
}