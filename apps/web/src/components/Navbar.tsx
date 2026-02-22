"use client";

import type React from "react";

import { Input } from "@comp/input";
import { Clock, Heart, Loader2, LogIn, Menu, Search, ShoppingBag, UserIcon, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";

import { useCartListItemsQuery } from "@/data/cart";
import { useProductSuggestionQuery } from "@/data/product";
import { useSessionQuery } from "@/data/user/session-query";
import { useWishListCountQuery } from "@/data/wish";
import { useDebounce } from "@/hooks/useDebounce";

import { LayoutContext } from "../context/LayoutContext";
import Button from "./Button";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const deboucedQuery = useDebounce(searchQuery, 300);

  const searchRef = useRef<HTMLDivElement>(null);
  const location = usePathname();
  const router = useRouter();

  const { toggleCart } = useContext(LayoutContext);
  // const { wishlist } = useShop();
  // const { user, isAuthenticated } = ;
  // --- Search History Logic ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      const history = localStorage.getItem("nestify_search_history");
      if (history) {
        setSearchHistory(JSON.parse(history));
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchHistory(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addToSearchHistory = (query: string) => {
    const newHistory = [query, ...searchHistory.filter((h) => h !== query)].slice(0, 5);
    setSearchHistory(newHistory);
    localStorage.setItem("nestify_search_history", JSON.stringify(newHistory));
  };

  const removeHistoryItem = (e: React.MouseEvent, item: string) => {
    e.stopPropagation();
    const newHistory = searchHistory.filter((h) => h !== item);
    setSearchHistory(newHistory);
    localStorage.setItem("nestify_search_history", JSON.stringify(newHistory));
  };

  const submitSearch = (term: string) => {
    if (!term.trim()) {
      return;
    }
    addToSearchHistory(term);
    router.push(`/search?q=${encodeURIComponent(term)}`);
    setIsFocused(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitSearch(searchQuery);
  };

  // --- DATA FETCHING (Non-Blocking) ---
  const { data: isAuthenticated } = useSessionQuery();
  const {
    data: wishCount,
    isLoading: isWishListCountLoading,
    error: errorWishListCount,
  } = useWishListCountQuery();
  // Only fetch cart if user is logged in
  const { data: cart } = useCartListItemsQuery();
  const { data: suggestions, isLoading: isSuggestionsLoading } =
    useProductSuggestionQuery(deboucedQuery);

  const isActive = (path: string) => location === path;

  // if (isWishListCountLoading) {
  //   return <div>wishCount is loading</div>;
  // }

  // const renderWishlistBadge = () => {
  //   if (isWishListCountLoading) {
  //     return (
  //       <Loader2
  //         className="animate-spin text-gray-400"
  //         size={16}
  //       />
  //     );
  //   }
  //   if (!wishCount) {
  //     return <span>!</span>;
  //   }
  //
  //   const count = wishCount.data.length;
  //   if (count > 0) {
  //     return (
  //       <span className="absolute -top-1 -right-1 rounded-full bg-black px-1.5 py-0.5 text-[10px] text-white">
  //         {count}
  //       </span>
  //     );
  //   }
  //   return null;
  // };
  //
  // console.log("error wishcoutn", errorWishListCount);

  // Calculate count safely (default to 0 if loading/error/guest)
  const cartItemCount = cart?.data.items.reduce((acc, item) => acc + item.quantity, 0) || 0;
  return (
    <nav className="sticky top-0 z-50 border-gray-200/50 border-b bg-nest-bg/90 px-4 py-4 backdrop-blur-md transition-all duration-300 md:px-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="group flex min-w-max items-center gap-2 rounded-full bg-white px-6 py-3 shadow-sm transition-all hover:shadow-md">
            <div className="grid h-6 w-6 place-items-center rounded-full bg-black transition-transform group-hover:scale-110">
              <span className="font-bold text-white text-xs">N</span>
            </div>
            <span className="font-bold text-lg tracking-tight">Nestify</span>
          </Link>

          <div ref={searchRef} className="relative z-50 hidden max-w-2xl flex-1 md:block">
            <form
              onSubmit={handleFormSubmit}
              className="relative z-20 flex items-center rounded-full bg-white p-1.5 pl-6 shadow-sm transition-shadow focus-within:ring-2 focus-within:ring-black/5 hover:shadow-md">
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsFocused(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search collection..."
                className="min-w-0 flex-1 border-none bg-transparent font-medium text-sm outline-none placeholder:text-gray-400"
              />
              <Button type="submit" size="icon" variant="primary" className="h-10! w-10! shrink-0">
                {isSuggestionsLoading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Search size={18} />
                )}
              </Button>
            </form>

            {/* DROPDOWN RESULTS */}
            {isFocused && (
              <div className="absolute top-full right-0 left-0 z-10 mt-2 animate-fade-in overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
                {/* SCENARIO A: User is typing -> Show Live Suggestions */}
                {searchQuery.length > 0 ? (
                  <div>
                    <div className="bg-gray-50/50 px-4 py-2 font-bold text-gray-400 text-xs uppercase tracking-wider">
                      Suggestions
                    </div>

                    {suggestions && suggestions.data.items.length > 0
                      ? suggestions.data.items.map((product) => (
                          <Link
                            key={product.id}
                            href={`/product/${product.slug}`}
                            onClick={() => {
                              addToSearchHistory(searchQuery);
                              setIsFocused(false);
                            }}
                            className="group flex items-center gap-4 px-4 py-3 transition-colors hover:bg-gray-50">
                            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-gray-100">
                              <Image
                                src={product.images.at(0)?.url || "images/caroline.jpg"}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-medium text-gray-900 text-sm group-hover:text-black">
                                {product.name}
                              </p>
                              <p className="text-gray-500 text-xs">{product.category?.name}</p>
                            </div>
                            <span className="font-bold text-gray-400 text-xs transition-colors group-hover:text-black">
                              ${product.price}
                            </span>
                          </Link>
                        ))
                      : !isSuggestionsLoading && (
                          <div className="p-4 text-center text-gray-500 text-sm">
                            No products found.
                          </div>
                        )}

                    {/* "View All" Link */}
                    {suggestions && suggestions.data.items.length > 0 && (
                      <div
                        onClick={() => submitSearch(searchQuery)}
                        className="cursor-pointer border-gray-100 border-t p-3 text-center font-bold text-blue-600 text-xs uppercase tracking-wide hover:bg-gray-50">
                        View all results for "{searchQuery}"
                      </div>
                    )}
                  </div>
                ) : (
                  /* SCENARIO B: Input Empty -> Show History */
                  searchHistory.length > 0 && (
                    <div>
                      <div className="bg-gray-50/50 px-4 py-2 font-bold text-gray-400 text-xs uppercase tracking-wider">
                        Recent Searches
                      </div>
                      {searchHistory.map((term, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setSearchQuery(term);
                            submitSearch(term);
                          }}
                          className="group flex cursor-pointer items-center justify-between px-4 py-3 hover:bg-gray-50">
                          <div className="flex items-center gap-3 text-gray-600">
                            <Clock size={14} />
                            <span className="text-sm">{term}</span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => removeHistoryItem(e, term)}
                            className="text-gray-300 opacity-0 transition-all hover:text-red-500 group-hover:opacity-100">
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated?.session ? (
              <>
                <Link href={{ pathname: "/account" }}>
                  <Button
                    variant="icon"
                    className="group relative hidden max-h-[46] min-h-[46] sm:flex md:flex"
                    active={isActive("/account")}>
                    <UserIcon size={20} />
                  </Button>
                </Link>
                <Link href="/wish">
                  <Button
                    variant="icon"
                    className="group relative hidden sm:flex"
                    active={isActive("/wishlist")}>
                    <Heart
                      size={20}
                      className={`transition-colors ${isActive("/wishlist") ? "fill-black" : "group-hover:fill-red-500 group-hover:text-red-500"}`}
                    />
                    {isWishListCountLoading ? (
                      <span className="absolute top-0 right-0 -mt-1 -mr-1 grid h-4 w-4 place-items-center rounded-full border border-white bg-black text-[10px] text-white">
                        <Loader2 className="animate-spin text-white-400" size={10} />
                      </span>
                    ) : !wishCount ? (
                      <div>!</div>
                    ) : (
                      wishCount.data.length > 0 && (
                        <span className="absolute top-0 right-0 -mt-1 -mr-1 grid h-4 w-4 place-items-center rounded-full border border-white bg-black text-[10px] text-white">
                          {wishCount.data.length}
                        </span>
                      )
                    )}
                  </Button>
                </Link>
                <Button
                  variant="icon"
                  className="relative transition-colors hover:bg-black hover:text-white"
                  onClick={toggleCart}>
                  <ShoppingBag size={20} />
                  {cartItemCount > 0 && (
                    <span className="absolute top-0 right-0 -mt-1 -mr-1 grid h-4 w-4 animate-fade-in place-items-center rounded-full border border-white bg-red-500 text-[10px] text-white">
                      {cartItemCount}
                    </span>
                  )}
                </Button>

                <Button variant="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
                  {isOpen ? <X size={20} /> : <Menu size={20} />}
                </Button>
              </>
            ) : (
              <Link href="/log-in">
                <Button
                  variant="secondary"
                  size="sm"
                  className="group relative hidden max-h-[46] min-h-[46] sm:flex md:flex">
                  <LogIn size={16} className="mr-2" /> Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 z-50 flex w-full animate-slide-up flex-col gap-4 rounded-b-3xl border-gray-200 border-t bg-nest-bg p-4 shadow-xl md:hidden">
          <form onSubmit={handleFormSubmit} className="flex gap-2">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="flex-1 rounded-2xl bg-white px-4 py-3 outline-none"
            />
            <Button type="submit" variant="primary">
              <Search size={20} />
            </Button>
          </form>

          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="rounded-2xl bg-white p-4 font-medium">
            Home
          </Link>
          <Link
            href="/product"
            onClick={() => setIsOpen(false)}
            className="rounded-2xl bg-white p-4 font-medium">
            Shop Collection
          </Link>
          <Link
            href="/wish"
            onClick={() => setIsOpen(false)}
            className="flex justify-between rounded-2xl bg-white p-4 font-medium">
            Wishlist
            {isWishListCountLoading ? (
              <div className="flex h-64 items-center justify-center">
                <Loader2 className="animate-spin text-gray-400" size={32} />
              </div>
            ) : !wishCount ? (
              <div>!</div>
            ) : (
              wishCount.data.length > 0 && (
                <span className="rounded-full bg-black px-2 py-1 text-white text-xs">
                  {wishCount.data.length}
                </span>
              )
            )}
          </Link>

          {isAuthenticated?.session ? (
            <Link
              href={{ pathname: "/account" }}
              onClick={() => setIsOpen(false)}
              className="rounded-2xl bg-white p-4 font-medium">
              Account
            </Link>
          ) : (
            <Link
              href="/log-in"
              onClick={() => setIsOpen(false)}
              className="rounded-2xl bg-white p-4 font-medium">
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
