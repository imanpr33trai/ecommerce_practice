"use client";

import Image from "next/image";
import Link from "next/link";

import { ExternalLink, MessageSquare, Star, Trash2 } from "lucide-react";

import BentoCard from "@/components/BentoCard";
import Button from "@/components/Button";
import { useReviewDeleteMutation, useReviewsUserQuery } from "@/data/review";
import { authClient } from "@/lib/auth-client";

export function AccountReviews() {
  const { data: session } = authClient.useSession();
  const { data: userReviews } = useReviewsUserQuery(!!session, { limit: "10", page: "1" });
  const { mutate: deleteReview } = useReviewDeleteMutation();

  return (
    <div className="animate-fade-in space-y-6">
      <h2 className="mb-6 font-light text-3xl">My Reviews ({userReviews.items.length})</h2>
      {userReviews.items.length > 0 ? (
        <div className="space-y-4">
          {userReviews.items.map((review) => {
            return (
              <BentoCard
                key={review.id}
                className="group/item bg-white p-6"
              >
                <div className="flex flex-col gap-6 md:flex-row">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-gray-100">
                    {review.product.images.length === 0 ? (
                      <div>No Image</div>
                    ) : (
                      review.product.images.map((image) => (
                        <Image
                          src={image.url}
                          key={image.id}
                          className="h-full w-full object-cover"
                          alt={image.altText || review.product.name}
                        />
                      ))
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-lg">
                          {review.product.name || "Unknown Product"}
                        </h4>
                        <div className="my-1 flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={
                                i < review.rating
                                  ? "fill-yellow-500 text-yellow-500"
                                  : "text-gray-200"
                              }
                            />
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteReview(review.id)}
                        className="p-2 text-gray-300 transition-colors hover:text-red-500 group-hover/item:opacity-100 md:opacity-0"
                        type="button"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <p className="mb-4 text-gray-600 text-sm italic leading-relaxed">
                      "{review.comment}"
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[10px] text-gray-400 uppercase tracking-widest">
                        Posted on {review.createdAt}
                      </span>
                      <Link
                        href={`/product/${review.product.slug}`}
                        className="flex items-center gap-1 font-bold text-black text-xs hover:underline"
                      >
                        View Product <ExternalLink size={12} />
                      </Link>
                    </div>
                  </div>
                </div>
              </BentoCard>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-[2rem] border border-gray-200 border-dashed bg-white py-20 text-center">
          <MessageSquare
            size={48}
            className="mb-4 text-gray-200"
          />
          <p className="text-gray-500">You haven't written any reviews yet.</p>
          <Link
            href="/product"
            className="mt-4"
          >
            <Button
              variant="outline"
              size="sm"
            >
              Go Shop & Review
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
