"use client";

import Link from "next/link";
import { useState } from "react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@comp/select";
import { Skeleton } from "@comp/skeleton";
import {
    ChevronLeft,
    ChevronRight,
    MessageSquare,
    Send,
    ShieldCheck,
    Star,
    Trash2,
} from "lucide-react";
import { toast } from "sonner";

import Image from "@/components/AppImage";
import BentoCard from "@/components/BentoCard";
import Button from "@/components/Button";
import { useProudctDetailQuery } from "@/data/product";
import {
    useReviewCreateMutation,
    useReviewDeleteMutation,
    useReviewListQuery,
    useReviewSummaryQuery,
} from "@/data/review";
import { authClient } from "@/lib/auth-client";

interface ProductReviewsProps {
  slug: string;
}

export default function ProductReviews({ slug }: ProductReviewsProps) {
  const { data: session } = authClient.useSession();
  const { data: product } = useProudctDetailQuery(slug);

  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<"newest" | "highest" | "lowest">("newest");

  const pageStr = page.toString();

  const { mutate: createReview, isPending: isPosting } = useReviewCreateMutation(product.id);
  const { mutate: deleteReview } = useReviewDeleteMutation(product.id);
  const { data: summary, isLoading: isSummaryLoading } = useReviewSummaryQuery(product.id);
  const { data: productReviews, isLoading: isListLoading } = useReviewListQuery(product.id, {
    page: pageStr,

    sort,
  });

  if (!product || !productReviews) {
    return null;
  }

  const handlePostReview = (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      return toast.error("Please login to post a review");
    }

    if (reviewRating === 0) {
      toast.error("Please select a star rating");
      return;
    }
    if (reviewComment.trim().length < 5) {
      toast.error("Please write a bit more in your comment");
      return;
    }

    createReview(
      {
        productId: product.id,
        rating: reviewRating,
        comment: reviewComment,
      },
      {
        onSuccess: () => {
          setReviewComment("");
          setReviewRating(0);
          setPage(1);
        },
      },
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-24 animate-fade-in">
      {/* LEFT COLUMN: Form & Stats */}
      <div className="lg:col-span-4 space-y-6">
        {/* Review Form */}
        <BentoCard className="p-8 bg-white h-fit">
          <h2 className="text-3xl font-light mb-6 flex items-center gap-3">
            <MessageSquare size={24} /> Feedback
          </h2>

          {!session ? (
            <div className="text-center p-6 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
              <p className="text-sm text-gray-500 mb-4">
                Login to share your experience with this product.
              </p>
              <Link href="/log-in">
                <Button
                  variant="outline"
                  size="sm"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <form
              onSubmit={handlePostReview}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                  Your Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="transition-transform hover:scale-110 active:scale-95 focus:outline-none"
                    >
                      <Star
                        size={24}
                        className={
                          star <= reviewRating ? "text-yellow-500 fill-yellow-500" : "text-gray-200"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Comment
                </label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="What did you love about this piece?"
                  className="w-full bg-gray-50 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-black/5 min-h-[120px] resize-none"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isPosting}
              >
                {isPosting ? "Posting..." : "Post Review"}{" "}
                <Send
                  size={16}
                  className="ml-2"
                />
              </Button>
            </form>
          )}
        </BentoCard>

        {/* Rating Summary (Histogram) */}
        <BentoCard className="p-6 bg-gray-50 border border-gray-100">
          <div className="flex items-end justify-between mb-4">
            <h4 className="font-bold">Rating Summary</h4>
            {summary && (
              <span className="text-xs text-gray-500 font-medium">
                {summary.data.average.toFixed(1)} / 5.0 ({summary.data.total})
              </span>
            )}
          </div>

          {isSummaryLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-4 w-full"
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((r) => {
                const count = summary?.data.distribution[r] || 0;
                const total = summary?.data.total || 1; // Avoid div by zero
                const percentage = (count / total) * 100;

                return (
                  <div
                    key={r}
                    className="flex items-center gap-3"
                  >
                    <span className="text-xs font-bold w-4">{r}</span>
                    <Star
                      size={12}
                      className="text-yellow-500 fill-yellow-500 shrink-0"
                    />
                    <div className="flex-1 h-1.5 bg-white rounded-full overflow-hidden">
                      <div
                        className="h-full bg-black transition-all duration-1000 ease-out"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-400 w-8 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          )}
        </BentoCard>
      </div>

      {/* RIGHT COLUMN: Review List */}
      <div className="lg:col-span-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-xl">
            Reviews
            <span className="text-muted-foreground text-sm font-normal ml-2">
              ({productReviews.data.pagination.total ?? 0})
            </span>
          </h3>

          <Select
            value={sort}
            onValueChange={(value) => {
              // Type assertion fix
              setSort(value as "newest" | "highest" | "lowest");
              // Always reset page to 1 when changing sort order
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[180px]">
              {/*
                SelectValue automatically renders the label of the active item.
                If you want a static icon, put it inside the trigger but
                before the SelectValue.
              */}
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>

            {/*
              1. Remove 'w-45' from SelectContent; Shadcn automatically
                 matches the width of the Trigger.
              2. Ensure you are importing SelectItem from your UI folder
                 to get the correct padding (pl-8).
            */}
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="highest">Highest Rating</SelectItem>
              <SelectItem value="lowest">Lowest Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-6">
          {isListLoading ? (
            // List Skeleton
            [1, 2, 3].map((i) => (
              <Skeleton
                key={i}
                className="h-48 w-full rounded-[2rem]"
              />
            ))
          ) : productReviews && productReviews.data.items.length > 0 ? (
            productReviews.data.items.map((review) => (
              <BentoCard
                key={review.id}
                className="p-8 bg-white group/rev transition-all hover:shadow-md"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="relative h-12 w-12">
                      <Image
                        alt={review.user.name}
                        fill
                        src={review.user.image || "/placeholder-user.jpg"} // Use a local placeholder if null
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{review.user.name}</h4>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              className={
                                i < review.rating
                                  ? "text-yellow-500 fill-yellow-500"
                                  : "text-gray-200"
                              }
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                          • {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {session && review.userId === session.user.id && (
                    <button
                      type="button"
                      onClick={() => deleteReview(review.id)}
                      className="p-2 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover/rev:opacity-100 bg-gray-50 rounded-full"
                      title="Delete Review"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>

                <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
                  <ShieldCheck size={12} /> Verified Purchase
                </div>

                <p className="text-gray-600 leading-relaxed text-lg italic">"{review.comment}"</p>
              </BentoCard>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] text-center border border-dashed border-gray-100">
              <MessageSquare
                size={48}
                className="text-gray-200 mb-4"
              />
              <h3 className="text-xl font-bold mb-2">No reviews yet</h3>
              <p className="text-gray-500">Be the first to share your thoughts!</p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {productReviews && productReviews.data.pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-full"
            >
              <ChevronLeft size={20} />
            </Button>
            <span className="text-sm font-medium text-gray-500">
              Page {page} of {productReviews.data.pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              disabled={page >= productReviews.data.pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-full"
            >
              <ChevronRight size={20} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
