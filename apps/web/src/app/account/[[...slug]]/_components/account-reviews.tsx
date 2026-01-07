"use client";

import Image from "next/image";
import Link from "next/link";

import { ExternalLink, MessageSquare, Star, Trash2 } from "lucide-react";

import BentoCard from "@/components/BentoCard";
import Button from "@/components/Button";
import { useReviewDeleteMutation, useReviewsUserQuery } from "@/data/review";

export function AccountReviews() {
  const { data: userReviews } = useReviewsUserQuery();
  const { mutate: deleteReview } = useReviewDeleteMutation();

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-3xl font-light mb-6">My Reviews ({userReviews.length})</h2>
      {userReviews.length > 0 ? (
        <div className="space-y-4">
          {userReviews.map((review) => {
            return (
              <BentoCard
                key={review.id}
                className="p-6 bg-white group/item"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-20 h-20 bg-gray-100 rounded-2xl overflow-hidden shrink-0">
                    {review.product.images.length === 0 ? (
                      <div>No Image</div>
                    ) : (
                      review.product.images.map((image) => (
                        <Image
                          src={image.url}
                          key={image.id}
                          className="w-full h-full object-cover"
                          alt={image.altText || review.product.name}
                        />
                      ))
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-lg">
                          {review.product.name || "Unknown Product"}
                        </h4>
                        <div className="flex gap-1 my-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={
                                i < review.rating
                                  ? "text-yellow-500 fill-yellow-500"
                                  : "text-gray-200"
                              }
                            />
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteReview({ id: review.id })}
                        className="text-gray-300 hover:text-red-500 p-2 transition-colors md:opacity-0 group-hover/item:opacity-100"
                        type="button"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">
                      "{review.comment}"
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        Posted on {review.createdAt.toDateString()}
                      </span>
                      <Link
                        href={`/product/${review.product.slug}`}
                        className="text-xs font-bold text-black flex items-center gap-1 hover:underline"
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
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] text-center border border-dashed border-gray-200">
          <MessageSquare
            size={48}
            className="text-gray-200 mb-4"
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
