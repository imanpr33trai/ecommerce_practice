"use client";

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
import Link from "next/link";
import { useState } from "react";
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
    <div className="mb-24 grid animate-fade-in grid-cols-1 gap-8 lg:grid-cols-12">
      {/* LEFT COLUMN: Form & Stats */}
      <div className="space-y-6 lg:col-span-4">
        {/* Review Form */}
        <BentoCard className="h-fit bg-white p-8">
          <h2 className="mb-6 flex items-center gap-3 font-light text-3xl">
            <MessageSquare size={24} /> Feedback
          </h2>

          {!session ? (
            <div className="rounded-3xl border border-gray-200 border-dashed bg-gray-50 p-6 text-center">
              <p className="mb-4 text-gray-500 text-sm">
                Login to share your experience with this product.
              </p>
              <Link href="/log-in">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handlePostReview} className="space-y-4">
              <div>
                <label className="mb-3 block font-bold text-gray-400 text-xs uppercase tracking-wider">
                  Your Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="transition-transform hover:scale-110 focus:outline-none active:scale-95">
                      <Star
                        size={24}
                        className={
                          star <= reviewRating ? "fill-yellow-500 text-yellow-500" : "text-gray-200"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-2 block font-bold text-gray-400 text-xs uppercase tracking-wider">
                  Comment
                </label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="What did you love about this piece?"
                  className="min-h-30 w-full resize-none rounded-2xl bg-gray-50 px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-black/5"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isPosting}>
                {isPosting ? "Posting..." : "Post Review"} <Send size={16} className="ml-2" />
              </Button>
            </form>
          )}
        </BentoCard>

        {/* Rating Summary (Histogram) */}
        <BentoCard className="border border-gray-100 bg-gray-50 p-6">
          <div className="mb-4 flex items-end justify-between">
            <h4 className="font-bold">Rating Summary</h4>
            {summary && (
              <span className="font-medium text-gray-500 text-xs">
                {summary.data.average.toFixed(1)} / 5.0 ({summary.data.total})
              </span>
            )}
          </div>

          {isSummaryLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((r) => {
                const count = summary?.data.distribution[r] || 0;
                const total = summary?.data.total || 1; // Avoid div by zero
                const percentage = (count / total) * 100;

                return (
                  <div key={r} className="flex items-center gap-3">
                    <span className="w-4 font-bold text-xs">{r}</span>
                    <Star size={12} className="shrink-0 fill-yellow-500 text-yellow-500" />
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white">
                      <div
                        className="h-full bg-black transition-all duration-1000 ease-out"
                        style={{ width: `${percentage}%` }}></div>
                    </div>
                    <span className="w-8 text-right text-gray-400 text-xs">{count}</span>
                  </div>
                );
              })}
            </div>
          )}
        </BentoCard>
      </div>

      {/* RIGHT COLUMN: Review List */}
      <div className="lg:col-span-8">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-bold text-xl">
            Reviews
            <span className="ml-2 font-normal text-muted-foreground text-sm">
              ({productReviews && (productReviews.data.pagination.total ?? 0)})
            </span>
          </h3>

          <Select
            value={sort}
            onValueChange={(value) => {
              // Type assertion fix
              setSort(value as "newest" | "highest" | "lowest");
              // Always reset page to 1 when changing sort order
              setPage(1);
            }}>
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
              <Skeleton key={i} className="h-48 w-full rounded-[2rem] bg-[#e8e8e6]" />
            ))
          ) : productReviews && productReviews.data.items.length > 0 ? (
            productReviews.data.items.map((review) => (
              <BentoCard
                key={review.id}
                className="group/rev bg-white p-8 transition-all hover:shadow-md">
                <div className="mb-6 flex items-start justify-between">
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
                                  ? "fill-yellow-500 text-yellow-500"
                                  : "text-gray-200"
                              }
                            />
                          ))}
                        </div>
                        <span className="font-bold text-[10px] text-gray-400 uppercase tracking-widest">
                          • {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {session && review.userId === session.user.id && (
                    <button
                      type="button"
                      onClick={() => deleteReview(review.id)}
                      className="rounded-full bg-gray-50 p-2 text-gray-300 opacity-0 transition-colors hover:text-red-500 group-hover/rev:opacity-100"
                      title="Delete Review">
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>

                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 font-bold text-[10px] text-green-700 uppercase tracking-widest">
                  <ShieldCheck size={12} /> Verified Purchase
                </div>

                <p className="text-gray-600 text-lg italic leading-relaxed">"{review.comment}"</p>
              </BentoCard>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center rounded-[2rem] border border-gray-100 border-dashed bg-white py-20 text-center">
              <MessageSquare size={48} className="mb-4 text-gray-200" />
              <h3 className="mb-2 font-bold text-xl">No reviews yet</h3>
              <p className="text-gray-500">Be the first to share your thoughts!</p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {productReviews && productReviews.data.pagination.totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-full">
              <ChevronLeft size={20} />
            </Button>
            <span className="font-medium text-gray-500 text-sm">
              Page {page} of {productReviews.data.pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              disabled={page >= productReviews.data.pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-full">
              <ChevronRight size={20} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
