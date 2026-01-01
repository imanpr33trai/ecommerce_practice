"use client";

import Image from "@/components/AppImage";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import type React from "react";

import { Input } from "@comp/input";
import { Clock, X as CloseIcon, Heart, Loader2, LogIn, Menu, Search, ShoppingBag, UserIcon, X } from "lucide-react";

import { Cart } from "@/feature/cart";
import { Product } from "@/feature/product";
import { Wish } from "@/feature/wish";
import { useDebounce } from "@/hooks/useDebounce";
import { authClient } from "@/lib/auth-client";

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
      if (history) setSearchHistory(JSON.parse(history));
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
    if (!term.trim()) return;
    addToSearchHistory(term);
    router.push(`/search?q=${encodeURIComponent(term)}`);
    setIsFocused(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitSearch(searchQuery);
  };

  // --- DATA FETCHING (Non-Blocking) ---
  const { data: isAuthenticated, isPending: isAuthPending } = authClient.useSession();
  const wishCount = Wish.hooks.useWishListCount();
  // Only fetch cart if user is logged in
  const { data: cart } = Cart.hooks.useCart();
  const { data: suggestions, isLoading: isSuggestionsLoading } = Product.hooks.useSuggestions(deboucedQuery);

  const isActive = (path: string) => location === path;
  // if (!wishCount) {
  //   return <div>wishlist is undefined</div>;
  // }

  // Calculate count safely (default to 0 if loading/error/guest)
  const cartItemCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;
  return (
    <nav className="sticky top-0 z-50 py-4 px-4 md:px-8 bg-nest-bg/90 backdrop-blur-md transition-all duration-300 border-b border-gray-200/50">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 bg-white rounded-full px-6 py-3 shadow-sm min-w-max hover:shadow-md transition-all group"
          >
            <div className="w-6 h-6 bg-black rounded-full grid place-items-center group-hover:scale-110 transition-transform">
              <span className="text-white text-xs font-bold">N</span>
            </div>
            <span className="font-bold text-lg tracking-tight">Nestify</span>
          </Link>

          <div
            ref={searchRef}
            className="hidden md:block flex-1 max-w-2xl relative z-50"
          >
            <form
              onSubmit={handleFormSubmit}
              className="flex bg-white rounded-full p-1.5 shadow-sm items-center pl-6 hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-black/5 relative z-20"
            >
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsFocused(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search collection..."
                className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-gray-400 font-medium min-w-0"
              />
              <Button
                type="submit"
                size="icon"
                variant="primary"
                className="w-10! h-10! shrink-0"
              >
                {isSuggestionsLoading ? (
                  <Loader2
                    className="animate-spin"
                    size={18}
                  />
                ) : (
                  <Search size={18} />
                )}
              </Button>
            </form>

            {/* DROPDOWN RESULTS */}
            {isFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in z-10">
                {/* SCENARIO A: User is typing -> Show Live Suggestions */}
                {searchQuery.length > 0 ? (
                  <div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider px-4 py-2 bg-gray-50/50">Suggestions</div>

                    {suggestions && suggestions.length > 0
                      ? suggestions.map((product) => (
                          <Link
                            key={product.id}
                            href={`/product/${product.slug}`}
                            onClick={() => {
                              addToSearchHistory(searchQuery);
                              setIsFocused(false);
                            }}
                            className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors group"
                          >
                            <div className="relative w-10 h-10 rounded-md overflow-hidden bg-gray-100 shrink-0">
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate text-gray-900 group-hover:text-black">{product.name}</p>
                              <p className="text-xs text-gray-500">{product.category?.name}</p>
                            </div>
                            <span className="text-xs font-bold text-gray-400 group-hover:text-black transition-colors">${product.price}</span>
                          </Link>
                        ))
                      : !isSuggestionsLoading && <div className="p-4 text-center text-sm text-gray-500">No products found.</div>}

                    {/* "View All" Link */}
                    {suggestions && suggestions.length > 0 && (
                      <div
                        onClick={() => submitSearch(searchQuery)}
                        className="p-3 text-center border-t border-gray-100 cursor-pointer hover:bg-gray-50 text-xs font-bold text-blue-600 uppercase tracking-wide"
                      >
                        View all results for "{searchQuery}"
                      </div>
                    )}
                  </div>
                ) : (
                  /* SCENARIO B: Input Empty -> Show History */
                  searchHistory.length > 0 && (
                    <div>
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider px-4 py-2 bg-gray-50/50">Recent Searches</div>
                      {searchHistory.map((term, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setSearchQuery(term);
                            submitSearch(term);
                          }}
                          className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer group"
                        >
                          <div className="flex items-center gap-3 text-gray-600">
                            <Clock size={14} />
                            <span className="text-sm">{term}</span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => removeHistoryItem(e, term)}
                            className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                          >
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
              <Link href={{ pathname: "/account" }}>
                <Button
                  variant="icon"
                  className=" md:flex relative group hidden sm:flex max-h-[46] min-h-[46]"
                  active={isActive("/account")}
                >
                  <UserIcon size={20} />
                </Button>
              </Link>
            ) : (
              <Link href="/log-in">
                <Button
                  variant="icon"
                  size="sm"
                  className="max-h-[46] min-h-[46] md:flex relative group hidden sm:flex"
                >
                  <LogIn
                    size={16}
                    className="mr-2"
                  />{" "}
                  Sign In
                </Button>
              </Link>
            )}

            <Link href="/wish">
              <Button
                variant="icon"
                className="relative group hidden sm:flex"
                active={isActive("/wishlist")}
              >
                <Heart
                  size={20}
                  className={`transition-colors ${isActive("/wishlist") ? "fill-black" : "group-hover:fill-red-500 group-hover:text-red-500"}`}
                />
                {wishCount > 0 && <span className="absolute top-0 right-0 -mt-1 -mr-1 w-4 h-4 bg-black rounded-full text-white text-[10px] grid place-items-center border border-white">{wishCount}</span>}
              </Button>
            </Link>

            <Button
              variant="icon"
              className="relative hover:bg-black hover:text-white transition-colors"
              onClick={toggleCart}
            >
              <ShoppingBag size={20} />
              {cartItemCount > 0 && <span className="absolute top-0 right-0 -mt-1 -mr-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] grid place-items-center border border-white animate-fade-in">{cartItemCount}</span>}
            </Button>

            <Button
              variant="icon"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <CloseIcon size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-nest-bg p-4 shadow-xl rounded-b-3xl border-t border-gray-200 flex flex-col gap-4 animate-slide-up z-50">
          <form
            onSubmit={handleFormSubmit}
            className="flex gap-2"
          >
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="flex-1 bg-white rounded-2xl px-4 py-3 outline-none"
            />
            <Button
              type="submit"
              variant="primary"
            >
              <Search size={20} />
            </Button>
          </form>

          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="p-4 bg-white rounded-2xl font-medium"
          >
            Home
          </Link>
          <Link
            href="/product"
            onClick={() => setIsOpen(false)}
            className="p-4 bg-white rounded-2xl font-medium"
          >
            Shop Collection
          </Link>
          <Link
            href="/wish"
            onClick={() => setIsOpen(false)}
            className="p-4 bg-white rounded-2xl font-medium flex justify-between"
          >
            Wishlist
            {wishCount > 0 && <span className="bg-black text-white px-2 rounded-full text-xs py-1">{wishCount}</span>}
          </Link>

          {isAuthenticated?.session ? (
            <Link
              href={{ pathname: "/account" }}
              onClick={() => setIsOpen(false)}
              className="p-4 bg-white rounded-2xl font-medium"
            >
              Account
            </Link>
          ) : (
            <Link
              href="/log-in"
              onClick={() => setIsOpen(false)}
              className="p-4 bg-white rounded-2xl font-medium"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
