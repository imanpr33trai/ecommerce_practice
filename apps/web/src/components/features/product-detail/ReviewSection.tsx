"use client";

import { Star, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

import Button from "@/components/Button";
import { useReviewListQuery } from "@/data/review";

interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  user?: {
    name: string;
    image?: string | null;
  };
}

interface ReviewSectionProps {
  productId: string;
  productName: string;
  averageRating: number;
  totalReviews: number;
  initialReviews?: Review[];
}

export default function ReviewSection({
  productId,
  productName,
  averageRating,
  totalReviews,
  initialReviews,
}: ReviewSectionProps) {
  const [sortBy, setSortBy] = useState<"newest" | "highest" | "lowest">("newest");
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());

  const { data: reviewsData, isLoading, error } = useReviewListQuery(productId, {
    page: "1",
    limit: "10",
    sort: sortBy ?? "newest",
  });

  const reviewsResponse = reviewsData as unknown as { data: { items: Review[] } } | undefined;

  const reviews = initialReviews || reviewsResponse?.data?.items || [];
  const isLoadingReviews = isLoading && !initialReviews;

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r: Review) => r.rating === star).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { star, count, percentage };
  });

  const toggleExpand = (reviewId: string) => {
    setExpandedReviews((prev) => {
      const next = new Set(prev);
      if (next.has(reviewId)) {
        next.delete(reviewId);
      } else {
        next.add(reviewId);
      }
      return next;
    });
  };

  const renderStars = (rating: number, size: "sm" | "md" | "lg" = "md") => {
    const starSize = size === "sm" ? 12 : size === "md" ? 16 : 20;
    return (
      <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={starSize}
            className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
            aria-hidden="true"
          />
        ))}
      </div>
    );
  };

  if (error) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Failed to load reviews. Please try again later.</p>
      </div>
    );
  }

  return (
    <section className="space-y-8" aria-labelledby="reviews-heading">
      {/* Rating Summary */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1 flex flex-col items-center text-center md:items-start md:text-left">
          <div className="text-5xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
          <div className="flex items-center gap-1 mt-1">
            {renderStars(Math.round(averageRating), "lg")}
            <span className="text-gray-600">({totalReviews} reviews)</span>
          </div>
          <Button variant="outline" size="sm" className="mt-4">
            <Link href={`/product/${productId}#reviews`}>Write a review</Link>
          </Button>
        </div>

        {/* Rating Bars */}
        <div className="md:col-span-2 space-y-2">
          {ratingDistribution.map(({ star, count, percentage }) => (
            <div key={star} className="flex items-center gap-3">
              <span className="w-8 text-right text-sm text-gray-600">{star}★</span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                  role="progressbar"
                  aria-valuenow={percentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${star} star ratings: ${percentage.toFixed(0)}%`}
                />
              </div>
              <span className="w-12 text-sm text-gray-500">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200 pt-8" />

      {/* Sort & Filter */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 id="reviews-heading" className="text-xl font-semibold text-gray-900">
          Customer Reviews ({totalReviews})
        </h2>
        <div className="flex items-center gap-2">
          <label htmlFor="review-sort" className="text-sm text-gray-600">Sort by:</label>
          <select
            id="review-sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "newest" | "highest" | "lowest")}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="newest">Newest</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6" role="list" aria-label="Customer reviews">
        {isLoadingReviews ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse space-y-4">
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/4 bg-gray-200 rounded" />
                  <div className="h-4 w-1/2 bg-gray-200 rounded" />
                </div>
              </div>
              <div className="h-4 w-3/4 bg-gray-200 rounded" />
              <div className="h-4 w-1/2 bg-gray-200 rounded" />
            </div>
          ))
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="mb-4">No reviews yet for {productName}.</p>
            <Button variant="outline">
              <Link href={`/product/${productId}#reviews`}>Be the first to review</Link>
            </Button>
          </div>
        ) : (
          reviews.map((review: Review) => {
            const isExpanded = expandedReviews.has(review.id);
            const showExpand = review.comment.length > 200;
            const displayComment = isExpanded || !showExpand
              ? review.comment
              : `${review.comment.slice(0, 200)}...`;

            return (
              <article
                key={review.id}
                className="border border-gray-200 rounded-xl p-6 transition-shadow hover:shadow-sm"
                role="listitem"
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      {review.user?.image ? (
                        <img
                          src={review.user.image}
                          alt=""
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-lg font-medium text-gray-600">
                          {review.user?.name?.charAt(0).toUpperCase() || "U"}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {review.user?.name || "Anonymous"}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          {renderStars(review.rating, "sm")}
                          <time
                            dateTime={review.createdAt}
                            className="text-xs text-gray-500"
                          >
                            {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                          </time>
                        </div>
                      </div>
                    </div>
                    {review.title && (
                      <h5 className="mt-2 font-medium text-gray-900">{review.title}</h5>
                    )}
                    <p className="mt-2 text-gray-600 leading-relaxed">{displayComment}</p>
                    {showExpand && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 p-0 h-auto text-primary hover:text-primary/80 bg-transparent border-transparent"
                        onClick={() => toggleExpand(review.id)}
                        aria-expanded={isExpanded}
                        aria-controls={`review-${review.id}`}
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp size={14} className="mr-1" aria-hidden="true" />
                            Show Less
                          </>
                        ) : (
                          <>
                            <ChevronDown size={14} className="mr-1" aria-hidden="true" />
                            Read More
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* Load More / View All */}
      {reviews.length > 0 && reviews.length < totalReviews && (
        <div className="text-center pt-4">
          <Button variant="outline" size="lg">
            <Link href={`/product/${productId}#reviews`}>
              View All Reviews ({totalReviews})
            </Link>
          </Button>
        </div>
      )}
    </section>
  );
}