/* eslint-disable @next/next/no-img-element */

"use client";
import { Button } from "@/_components/client/button";
import { useProduct } from "@/hooks/useProduct";
import type { ProductDetailed, ReviewAddResult, ProductListItem, ProductReview } from "@/utils/typesClient";
import {
  IconHeart,
  IconMessageCircle,
  IconMinus,
  IconPlus,
  IconRuler,
  IconShoppingBag,
  IconTruck
} from "@tabler/icons-react";
import { Star, User } from "lucide-react";
import Link from "next/link";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Skeleton } from "@comp/skeleton";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import Header from "@/_components/Layout/Header";

const ProductPage = ({ productSlug }: { productSlug: string }) => {
  const { data: product, isLoading } = useProduct.getBySlug(productSlug);
  const { data: reviews, isLoading: reviewLoad, isError: reviewsError } = useProduct.reviewsByProductId(product?.id);
  const { data: allProduct, } = useProduct.getAll()
  // Replace simple loading text with a skeleton loader
  if (isLoading) {
    return (
      <div className="min-h-screen max-w-7xl mx-auto p-2 sm:p-4 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Product Image Skeleton */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-3xl shadow-lg h-full">
              <Skeleton className="h-8 w-1/3 mb-4" />
              <Skeleton className="h-[500px] w-full rounded-2xl" />
              <div className="flex gap-2 mt-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-20 w-20 rounded-lg" />
                ))}
              </div>
            </div>
          </div>

          {/* Product Details Skeleton */}
          <div className="lg:col-span-2 flex flex-col space-y-6">
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-3xl shadow-lg">
              <Skeleton className="h-10 w-3/4 mb-4" />
              <Skeleton className="h-8 w-1/4 mb-4" />
              <Skeleton className="h-24 w-full mb-6" />
              <div className="flex gap-2">
                <Skeleton className="h-12 flex-1" />
                <Skeleton className="h-12 w-[20%]" />
              </div>
              <Skeleton className="h-12 w-full mt-3" />
            </div>

            {/* Color and Size Selector Skeletons */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white dark:bg-zinc-800 p-4 rounded-3xl shadow-lg">
                <Skeleton className="h-6 w-20 mb-4" />
                <div className="flex space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-8 w-8 rounded-full" />
                  ))}
                </div>
              </div>
              <div className="bg-white dark:bg-zinc-800 p-4 rounded-3xl shadow-lg">
                <Skeleton className="h-6 w-16 mb-4" />
                <div className="flex space-x-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-10 w-10 rounded-full" />
                  ))}
                </div>
              </div>
            </div>

            {/* Quantity Selector Skeleton */}
            <div className="bg-white dark:bg-zinc-800 p-4 rounded-3xl shadow-lg flex items-center justify-between">
              <Skeleton className="h-6 w-24" />
              <div className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-6 w-6" />
                <Skeleton className="h-10 w-10" />
              </div>
            </div>
          </div>

          {/* Additional Info Skeletons */}
          <div className="lg:col-span-5 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-zinc-800 p-6 rounded-3xl shadow-lg">
                <Skeleton className="h-8 w-40 mb-4" />
                <Skeleton className="h-24 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (reviewLoad) {
    return <div>Loading reviews...</div>
  }

  if (!product || !allProduct) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Product not found.</p>
        <Link href="/">Go back to homepage</Link>
      </div>
    );
  }
  const relatedProduct = allProduct.filter(
    (p) => p.category?.id === product.category?.id && p.id !== product.id
  );
  if (!reviews || reviewsError) {
    console.log(reviewsError);
    return <div>Error loading reviews</div>

  }
  return (
    <div className="min-h-screen max-w-7xl bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 p-2 sm:p-4 lg:p-6 mx-auto">
      <Header />
      <div className=" ">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 ">
          {/* Main Product Display */}
          <div className="lg:col-span-3">
            <ProductDisplayCard product={product} />
          </div>

          {/* Sidebar with Details and Actions */}
          <div className="lg:col-span-2 flex  flex-col space-y-6">
            <ProductDetailsCard product={product} />
            <div className="grid grid-cols-2 gap-6">
              <ColorOptionsCard />
              <SizeSelectorCard />
            </div>
            <QuantitySelectorCard />
          </div>

          {/* Additional Info Grid */}
          <div className="lg:col-span-5 grid grid-cols-1 md:grid-cols-3 gap-6">
            <SpecificationsCard />
            <ShippingInfoCard />
            <CustomerReviewsCard reviews={reviews} />
          </div>

          {/* Related Products and Team/Bonus Cards */}
          <div className="lg:col-span-5 grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <AutoScrollProducts products={relatedProduct} />
            </div>
            <div className="lg:col-span-1 grid grid-cols-1 lg:grid-cols-1 gap-6">
              <TeamCard />
              <BonusCard />
            </div>
          </div>
          <div className="lg:col-span-5 grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <ReviewCard reviews={reviews} />
            </div></div>
        </div>
      </div>
    </div>
  );
};

const ProductDisplayCard = ({ product }: { product: ProductDetailed }) => {
  const [activeImage, setActiveImage] = useState(0);

  return (
    <div className="bg-white gap-2.5 dark:bg-zinc-800 p-6 rounded-3xl shadow-lg h-full flex flex-col">
      <h2 className="text-3xl font-bold text-zinc-400 dark:text-zinc-500">
        {product.category?.name}
      </h2>
      <div className="flex-grow flex justify-center items-center mt-4">
        <div className="relative w-full">
          <img
            src={product.images[activeImage]?.url}
            alt={product.name}
            className="bg-zinc-200 dark:bg-zinc-700 h-[500px] w-full rounded-2xl object-cover"
          />
          <div className="absolute top-4 right-4 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-lg p-2 rounded-full">
            <span className="text-yellow-500">⭐</span> {product.reviews.length}
          </div>
        </div>
      </div>
      <div className="flex  gap-2  pb-2">
        {product.images.map((image, idx) => (
          <Button
            key={image.id}
            onClick={() => setActiveImage(idx)}
            variant="outline"
            className={`relative  h-20 w-20 flex-shrink-0 rounded-lg 
            ${activeImage === idx ? 'ring-2 ring-black dark:ring-white' : ''}`}
          >
            <Image
              src={image.url}
              alt={`${product.name} view ${idx + 1}`}
              className="h-full w-full object-cover"
              width={80}
              height={80}
            />
          </Button>
        ))}
      </div>
    </div>
  );
};

const ProductDetailsCard = ({ product }: { product: ProductDetailed }) => (
  <div className="bg-white w-full h-full dark:bg-zinc-800 p-6 rounded-3xl shadow-lg flex flex-col">
    <h1 className="text-4xl font-bold">{product.name}</h1>
    <p className="text-2xl font-semibold mt-2">${Number(product.price)}</p>
    <p className="text-zinc-500 dark:text-zinc-400 mt-4 flex-grow">
      {product.description}
    </p>

    <div className="mt-6 flex gap-2 ">
      <Button className="flex-1 w-full" size="lg">
        <IconShoppingBag />
        Add to Cart
      </Button>
      <Button className="w-[20%] " variant="outline" size="lg">
        <IconHeart />
      </Button>
    </div>

    <Button href="Buy-Now" className="mt-3" variant="outline" size="lg">
      Buy Now
    </Button>
  </div>
);

const ColorOptionsCard = () => (
  <div className="bg-white dark:bg-zinc-800 p-4 rounded-3xl shadow-lg">
    <h4 className="font-bold text-lg mb-2">Color</h4>
    <div className="flex space-x-2">
      <div className="w-8 h-8 rounded-full bg-black border-2 border-zinc-300 cursor-pointer" />
      <div className="w-8 h-8 rounded-full bg-white border-2 border-zinc-300 cursor-pointer" />
      <div className="w-8 h-8 rounded-full bg-gray-500 border-2 border-zinc-300 cursor-pointer" />
      <div className="w-8 h-8 rounded-full bg-amber-800 border-2 border-zinc-300 cursor-pointer" />
    </div>
  </div>
);

const SizeSelectorCard = () => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const sizes = ["S", "M", "L"];
  return (
    <div className="bg-white dark:bg-zinc-800 p-4 rounded-3xl shadow-lg">
      <h4 className="font-bold text-lg mb-2">Size</h4>
      <div className="flex space-x-2">
        {sizes.map((size) => (
          <Button
            key={size}
            variant={"outline"}
            className={`rounded-full ${selectedSize === size
              ? "dark:bg-white bg-black text-black dark:hover:bg-white/90 dark:hover:text-black"
              : ""
              } `}
            onClick={() => setSelectedSize(size)}
          >
            {size}
          </Button>
        ))}
      </div>
    </div>
  );
};

const QuantitySelectorCard = () => {
  const [quantity, setQuantity] = useState(1);
  return (
    <div className="bg-white dark:bg-zinc-800 p-4 rounded-3xl shadow-lg flex items-center justify-between">
      <h4 className="font-bold text-lg">Quantity</h4>
      <div className="flex items-center space-x-3">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
        >
          <IconMinus />
        </Button>
        <span className="text-xl font-semibold">{quantity}</span>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setQuantity(quantity + 1)}
        >
          <IconPlus />
        </Button>
      </div>
    </div>
  );
};

const SpecificationsCard = () => (
  <div className="bg-white dark:bg-zinc-800 p-6 rounded-3xl shadow-lg">
    <h4 className="font-bold text-xl mb-3 flex items-center">
      <IconRuler className="mr-2" /> Specifications
    </h4>
    <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
      <li>
        <strong>Material:</strong> Oak Wood, Linen
      </li>
      <li>
        <strong>Dimensions:</strong> 85"W x 35"D x 30"H
      </li>
      <li>
        <strong>Weight:</strong> 150 lbs
      </li>
    </ul>
  </div>
);

const ShippingInfoCard = () => (
  <div className="bg-white dark:bg-zinc-800 p-6 rounded-3xl shadow-lg">
    <h4 className="font-bold text-xl mb-3 flex items-center">
      <IconTruck className="mr-2" /> Shipping
    </h4>
    <p className="text-zinc-600 dark:text-zinc-400">
      Free nationwide shipping. Arrives in 5-7 business days. White glove
      delivery available.
    </p>
  </div>
);

const CustomerReviewsCard = ({ reviews }: { reviews: ProductReview[] }) => {
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  return (
    <div className="bg-white dark:bg-zinc-800 p-6 rounded-3xl shadow-lg">
      <h4 className="font-bold text-xl mb-3 flex items-center">
        <IconMessageCircle className="mr-2" /> Customer Reviews
      </h4>
      <div className="flex items-center space-x-4">
        <span className="text-2xl font-bold">{averageRating.toFixed(1)}</span>
        <div className="flex items-center">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${star <= averageRating
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-zinc-300'
                  }`}
              />
            ))}
          </div>
          <span className="text-sm text-zinc-500 ml-2">({reviews.length} reviews)</span>
        </div>
      </div>
      {/* <p className="text-zinc-600 dark:text-zinc-400 mt-4">
        Read what our customers have to say about their experience with this product.
      </p> */}
      <Button
        variant="outline"
        className="mt-4"
        onClick={() => {
          document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        Read All Reviews
      </Button>
    </div>
  )
}

const AutoScrollProducts = ({ products }: { products: ProductDetailed[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        if (products.length > 1) {
          setCurrentIndex((prev) => (prev + 1) % products.length);
        }
      }, 3000); // Change slide every 3 seconds

      return () => clearInterval(interval);
    }
  }, [products.length, isPaused]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: currentIndex * (300 + 24), // card width + gap
        behavior: 'smooth',
      });
    }
  }, [currentIndex]);

  const scroll = (direction: 'prev' | 'next') => {
    setIsPaused(true); // Pause auto-scroll when manual navigation is used
    if (direction === 'prev') {
      setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
    } else {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }
  };

  return (
    <div className="relative group" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
      <div ref={scrollRef} className="overflow-x-hidden">
        <div className="flex gap-6 transition-transform duration-500 ease-in-out">
          {products.map((product, index) => (
            <div key={product.id} className="w-[300px] flex-shrink-0">
              <Link href={`/${product.slug}`}>
                <RelatedProductCard product={product} />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      {products.length > 1 && (
        <>
          <button
            onClick={() => scroll('prev')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white dark:bg-zinc-800 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Previous product"
          >
            <IconArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('next')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white dark:bg-zinc-800 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Next product"
          >
            <IconArrowRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dots indicator */}
      {/* <div className="flex justify-center gap-2 mt-4">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              setIsPaused(true);
            }}
            className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                ? 'bg-black dark:bg-white w-4'
                : 'bg-zinc-300 dark:bg-zinc-600'
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div> */}
    </div>
  );
};

const RelatedProductCard = ({ product }: { product: ProductDetailed }) => (
  <div className="block h-full">
    <div className="bg-white dark:bg-zinc-800 p-6 hover:ring-2 hover:ring-black hover:dark:ring-white/20 rounded-3xl shadow-lg cursor-pointer h-full transition-all duration-300 hover:scale-[0.98]">
      <span className="text-xs font-semibold bg-zinc-200 dark:bg-zinc-700 px-2 py-1 rounded-full self-start">
        {product.category?.name || 'RELATED'}
      </span>
      <h3 className="text-xl font-bold mt-4">{product.name}</h3>
      <div className="mt-4 h-48 bg-zinc-200 dark:bg-zinc-700 rounded-2xl">
        <img
          src={product.images[0]?.url}
          alt={product.name}
          className="w-full h-full object-cover rounded-2xl"
        />
      </div>
      <div className="mt-4 text-lg font-semibold">
        ${Number(product.price)}
      </div>
    </div>
  </div>
);

const TeamCard = () => (
  <div className="bg-white dark:bg-zinc-800 p-4 rounded-3xl block  shadow-lg">
    <h4 className="font-bold">OUR TEAM</h4>
    <p className="text-sm text-zinc-500 dark:text-zinc-400">
      Designers of luxurious minimalist furniture.
    </p>
    <div className="flex -space-x-2 mt-2">
      <div className="w-8 h-8 bg-zinc-300 rounded-full border-2 border-white dark:border-zinc-800" />
      <div className="w-8 h-8 bg-zinc-400 rounded-full border-2 border-white dark:border-zinc-800" />
      <div className="w-8 h-8 bg-zinc-500 rounded-full border-2 border-white dark:border-zinc-800" />
    </div>
  </div>
);

const BonusCard = () => (
  <div className="bg-white dark:bg-zinc-800 block  p-4 rounded-3xl shadow-lg">
    <h4 className="font-bold">GET A BONUS</h4>
    <p className="text-sm text-zinc-500 dark:text-zinc-400">
      Discover our latest exclusive deals.
    </p>
    <div className="flex mt-2">
      <input
        type="email"
        placeholder="Email"
        className="w-full px-3 py-2 bg-zinc-100 dark:bg-zinc-700 rounded-l-full focus:outline-none"
      />
      <button className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-r-full">
        Subscribe
      </button>
    </div>
  </div>
);

const ReviewCard = ({ reviews }: { reviews: ProductReview[] }) => {


  return (
    <>



      {reviews.map((u, idx) => (
        <div key={idx} className="bg-white hover:ring-2 hover:ring-black hover:dark:ring-white/20 dark:bg-zinc-800 p-4 lg rounded-3xl shadow-lg ">
          <div>

            <div className="flex items-center space-x-2 mb-2 ">
              <div className="bg-zinc-200 dark:bg-zinc-700 rounded-2xl">
                {u.user.image ? (
                  <img
                    src={u.user.image}
                    alt={' '}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <User className="w-8 h-8 p-1" />
                )}
              </div>
              <span className="font-semibold">{u.user.name}</span>
            </div>

          </div>
          <p className="text-zinc-600 dark:text-zinc-400">{u.comment}</p>
        </div>
      ))}

    </>
  )
}
export default ProductPage;

