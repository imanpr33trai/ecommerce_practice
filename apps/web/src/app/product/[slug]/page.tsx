"use client";

import Link from "next/link";
import { use, useContext, useState } from "react";

import { TRPCClientError } from "@trpc/client";
import {
  Heart,
  MessageSquare,
  PenTool,
  Send,
  ShieldCheck,
  Star,
  Trash2,
  Truck,
} from "lucide-react";
import { toast } from "sonner";

import Image from "@/components/AppImage";
import BentoCard from "@/components/BentoCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import Button from "@/components/Button";
import ImageWithSkeleton from "@/components/ImageWithSkeleton";
import LoadingSkeleton from "@/components/LoadingSkeleton";
// import { PRODUCTS } from "@/constants";
import { LayoutContext } from "@/context/LayoutContext";
import { useShop } from "@/context/ShopContext";
import {
  useReviewCreateMutation,
  useReviewDeleteMutation,
  useReviewListQuery,
} from "@/data/review";
import { useWishListedQuery, useWishToggleMutation } from "@/data/wish";
import { Cart } from "@/feature/cart";
import { Product } from "@/feature/product";
import { authClient } from "@/lib/auth-client";

export default function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  // const { addToast } = useToast();
  const [activeColor, setActiveColor] = useState("#D9D9D9");
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const { addItem, isAdding } = Cart.hooks.useActions();
  const { mutate: toggleWish } = useWishToggleMutation();
  const { mutate: createReview } = useReviewCreateMutation();
  const { mutate: deleteReview } = useReviewDeleteMutation();
  const { data: productReviews } = useReviewListQuery({
    page: 1,
    productId: slug,
    sort: "newest",
  });
  const { data: session } = authClient.useSession();

  const { data: product, isLoading, isError, error } = Product.hooks.useDetail(slug);

  const isWishlisted = useWishListedQuery(product?.id);
  if (isLoading) {
    return <LoadingSkeleton type="detail" />;
  }
  if (!product) {
    throw new TRPCClientError("product is undefined");
  }

  const handleAddToCart = () => {
    if (!session) {
      return toast.error("Please login to add to cart");
    }

    addItem({
      productId: product.id,
      quantity: 1,
      color: activeColor,
    });
  };

  const handlePostReview = (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      return toast.error("Please login to add to cart");
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
        },
      },
    );
  };

  const handleWishlist = () => {
    if (!session) {
      return toast.error("Please login to save items");
    }
    toggleWish({ productId: product?.id });
  };

  if (!productReviews) {
    throw new TRPCClientError("prduct review is undefined");
  }
  // const relatedProducts = product.id.match((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="p-4 md:px-8 max-w-400 mx-auto pb-12 animate-fade-in">
      <Breadcrumbs />
      {/* <Link href={{pathname:"/product"}} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-6">
        <ArrowLeft size={16} /> Back to Collection
      </Link> */}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-16">
        <BentoCard className="lg:col-span-8 min-h-125 lg:h-162.5 bg-[#F4F4F4] relative group overflow-hidden">
          {product.images.map((image) => (
            <ImageWithSkeleton
              src={image.url}
              key={image.id}
              alt={image.altText || product.name}
              className="w-full h-full object-cover object-center"
            />
          ))}
          <button
            onClick={handleWishlist}
            type="button"
            className="absolute top-6 right-6 p-3 rounded-full bg-white/90 backdrop-blur shadow-md transition-all duration-300 hover:scale-110 active:scale-95 z-20"
          >
            <Heart
              size={24}
              className={`transition-colors duration-300 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-700"}`}
            />
          </button>
          <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 bg-white/90 backdrop-blur rounded-full px-6 py-3 shadow-lg z-20">
            <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
          </div>
        </BentoCard>

        <div className="lg:col-span-4 flex flex-col gap-4">
          <BentoCard className="p-6 bg-white flex flex-col justify-center gap-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 uppercase tracking-widest">
                {product.category?.name}
              </span>
              <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                <Star
                  size={14}
                  className="text-yellow-500 fill-yellow-500"
                />
                <span className="text-sm font-bold">
                  {product.rating}{" "}
                  <span className="text-gray-400 font-normal">({productReviews.items.length})</span>
                </span>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-light tracking-tighter">${product.price}</span>
              {product.isOnSale && (
                <span className="text-xl text-gray-400 line-through">
                  ${Math.round(product.price * 1.5)}
                </span>
              )}
            </div>
            <p className="text-gray-600 mt-2 leading-relaxed">{product.description}</p>
          </BentoCard>

          <BentoCard className="p-6 bg-white">
            <h3 className="font-bold mb-4">Select Color</h3>
            <div className="flex gap-3 mb-8">
              {(product.colors || ["#D9D9D9", "#3A3A3A", "#8C7A6B"]).map((color, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveColor(color)}
                  className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${activeColor === color ? "border-black scale-110" : "border-transparent"}`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>

            <div className="space-y-3">
              <Button
                className="w-full"
                size="lg"
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
              <Button
                variant="outline"
                className="w-full"
              >
                Download Spec Sheet
              </Button>
            </div>
          </BentoCard>

          <BentoCard className="flex-1 p-6 flex flex-col justify-center gap-4 bg-[#E8E8E6]">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                <Truck size={18} />
              </div>
              <div>
                <h4 className="font-bold text-sm">Free Shipping</h4>
                <p className="text-xs text-gray-500">On orders over $200</p>
              </div>
            </div>
            <div className="w-full h-px bg-gray-300" />
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                <ShieldCheck size={18} />
              </div>
              <div>
                <h4 className="font-bold text-sm">2 Year Warranty</h4>
                <p className="text-xs text-gray-500">Full coverage included</p>
              </div>
            </div>
          </BentoCard>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-24">
        <div className="lg:col-span-4 space-y-6">
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
                        className="transition-transform hover:scale-110 active:scale-95"
                      >
                        <Star
                          size={24}
                          className={
                            star <= reviewRating
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-200"
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
                >
                  Post Review{" "}
                  <Send
                    size={16}
                    className="ml-2"
                  />
                </Button>
              </form>
            )}
          </BentoCard>

          <BentoCard className="p-6 bg-nest-bg border border-gray-100">
            <h4 className="font-bold mb-4">Rating Summary</h4>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((r) => {
                const count = productReviews.items.filter((rev) => rev.rating === r).length;
                const percentage =
                  productReviews.items.length > 0 ? (count / productReviews.items.length) * 100 : 0;
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
                        className="h-full bg-black transition-all duration-1000"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-400 w-8 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </BentoCard>
        </div>

        <div className="lg:col-span-8">
          <div className="space-y-6">
            {productReviews.items.length > 0 ? (
              productReviews.items.map((review) => (
                <BentoCard
                  key={review.id}
                  className="p-8 bg-white group/rev"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <Image
                        alt={review.user.name}
                        width={50}
                        height={50}
                        src={review.user.image || ""}
                        className="w-12 h-12 rounded-full object-cover"
                      />
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
                            • {review.createdAt.toString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {session && review.userId === session.user.email && (
                      <button
                        type="button"
                        onClick={() => deleteReview({ id: review.id })}
                        className="p-2 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover/rev:opacity-100"
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
                <p className="text-gray-500">
                  Be the first to share your thoughts about this product!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/*{relatedProducts.length > 0 && (
        <div className="mb-24">
          <h2 className="text-3xl font-light mb-8">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        </div>
      )}*/}

      {/* The Design Story - Moved to the End of the page */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-16 border-t border-gray-100">
        <div className="space-y-6 px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200">
            <PenTool size={14} />
            <span className="text-xs font-bold uppercase tracking-wider text-gray-600">
              The Design Story
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-light leading-tight">
            Crafted with intention. <br /> Built for longevity.
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            The {product.name} isn't just a piece of furniture; it's a statement of minimalist
            philosophy. Designed in our Stockholm studio, every curve serves a purpose. We sourced
            the finest materials to ensure that it doesn't just look good on day one, but develops a
            rich patina over years of use.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div>
              <h4 className="font-bold text-3xl mb-1">100%</h4>
              <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">
                Sustainable Wood
              </p>
            </div>
            <div>
              <h4 className="font-bold text-3xl mb-1">300+</h4>
              <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">
                Hours of Craft
              </p>
            </div>
          </div>
        </div>
        <div className="h-[500px] md:h-[600px] rounded-[3rem] overflow-hidden shadow-2xl">
          <ImageWithSkeleton
            src="https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&q=80&w=1200"
            alt="Craftsmanship"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
