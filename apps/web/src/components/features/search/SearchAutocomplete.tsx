"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search, ChevronRight } from "lucide-react";

import { useSearchSuggestionsQuery } from "@/hooks/queries/useSearchSuggestionsQuery";
import Button from "@/components/Button";

interface SearchSuggestionItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: string;
  compareAtPrice: string | null;
  sku: string;
  stock: number;
  images: string[];
  categoryId: string;
  brandId: string;
  isActive: boolean;
  isFeatured: boolean;
  rating: string;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  brand?: {
    id: string;
    name: string;
    slug: string;
  };
  variants?: Array<{
    id: string;
    color: string;
    size: string;
    stock: number;
    price: string;
  }>;
}

interface SearchAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchAutocomplete({
  value,
  onChange,
  onSubmit,
  placeholder = "Search products...",
  className = "",
}: SearchAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const { data: suggestions, isLoading, isError } = useSearchSuggestionsQuery(value);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const items = suggestions?.data?.items || [];
      const maxIndex = items.length - 1;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
          break;
        case "Enter":
          e.preventDefault();
          if (highlightedIndex >= 0 && items[highlightedIndex]) {
            onSubmit(items[highlightedIndex].slug);
          } else if (value.trim()) {
            onSubmit(value.trim());
          }
          setIsOpen(false);
          setHighlightedIndex(-1);
          break;
        case "Escape":
          setIsOpen(false);
          setHighlightedIndex(-1);
          inputRef.current?.blur();
          break;
        case "Tab":
          setIsOpen(false);
          setHighlightedIndex(-1);
          break;
      }
    },
    [suggestions, highlightedIndex, value, onSubmit],
  );

  // Handle input change
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      onChange(newValue);
      setIsOpen(newValue.length >= 2);
      setHighlightedIndex(-1);
    },
    [onChange],
  );

  // Handle form submit
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (value.trim()) {
        onSubmit(value.trim());
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    },
    [value, onSubmit],
  );

  // Focus management
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const items = suggestions?.data?.items || [];

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative" role="search" aria-label="Search products">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            ref={inputRef}
            type="search"
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => value.length >= 2 && setIsOpen(true)}
            placeholder={placeholder}
            autoComplete="off"
            className="w-full h-12 pl-12 pr-40 text-base bg-white border border-gray-200 rounded-xl focus:border-black focus:ring-2 focus:ring-black/10 focus:outline-none transition-all"
            aria-autocomplete="list"
            aria-controls="search-suggestions"
            aria-expanded={isOpen && items.length > 0}
            role="combobox"
          />
          <Button
            type="submit"
            variant="icon"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg"
            aria-label="Search"
          >
            <ChevronRight size={18} />
          </Button>
        </div>

        {/* Suggestions Dropdown */}
        {isOpen && (items.length > 0 || isLoading) && (
          <ul
            ref={listRef}
            id="search-suggestions"
            role="listbox"
            className="absolute z-50 top-full left-0 right-0 mt-2 rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden animate-fade-in"
          >
            {isLoading && (
              <li className="px-4 py-3 text-center text-gray-500 text-sm">
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-black"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Searching...
                </div>
              </li>
            )}

            {!isLoading && items.length === 0 && (
              <li className="px-4 py-3 text-center text-gray-500 text-sm">
                No suggestions found
              </li>
            )}

            {items.map((item: SearchSuggestionItem, index) => (
              <li
                key={item.id}
                role="option"
                aria-selected={index === highlightedIndex}
                className={`px-4 py-3 cursor-pointer transition-colors ${
                  index === highlightedIndex ? "bg-gray-50" : "hover:bg-gray-50"
                }`}
                onClick={() => onSubmit(item.slug)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <Link
                  href={`/product/${item.slug}`}
                  className="flex items-center gap-3 w-full"
                  onClick={(e) => {
                    e.preventDefault();
                    onSubmit(item.slug);
                  }}
                >
                  <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    {item.images && item.images[0] && (
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{item.name}</p>
                    {item.category && (
                      <p className="text-gray-500 text-sm truncate">{item.category.name}</p>
                    )}
                  </div>
                  <span className="font-bold text-gray-900 whitespace-nowrap">
                    ${item.price}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </form>
    </div>
  );
}

export default SearchAutocomplete;