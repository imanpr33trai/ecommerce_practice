"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import type React from "react";

import { Input } from "@comp/input";
import { Clock, X as CloseIcon, Heart, LogIn, Menu, Search, ShoppingBag, User as UserIcon, X } from "lucide-react";

import { Cart } from "@/feature/cart";

import { useAuth } from "../context/AuthContext";
import { LayoutContext } from "../context/LayoutContext";
import { useShop } from "../context/ShopContext";
import Button from "./ui/Button";

const Navbar: React.FC = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [showSearchHistory, setShowSearchHistory] = useState(false);
	const [searchHistory, setSearchHistory] = useState<string[]>([]);

	const searchRef = useRef<HTMLDivElement>(null);
	const location = usePathname();
	const navigate = useRouter();

	const { toggleCart } = useContext(LayoutContext);
	const { wishlist } = useShop();
	const { user, isAuthenticated } = useAuth();

	useEffect(() => {
		const history = localStorage.getItem("nestify_search_history");
		if (history) {
			setSearchHistory(JSON.parse(history));
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

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			addToSearchHistory(searchQuery);
			navigate.push(`/search?q=${encodeURIComponent(searchQuery)}`);
			setIsOpen(false);
			setShowSearchHistory(false);
		}
	};

	const { data: cart, isLoading, isError, error } = Cart.hooks.useCart();
	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (isError || !cart || error) {
		return <div>{error?.message}</div>;
	}

	const isActive = (path: string) => location === path;
	const cartItemCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);

	return (
		<nav className="sticky top-0 z-50 py-4 px-4 md:px-8 bg-nest-bg/90 backdrop-blur-md transition-all duration-300 border-b border-gray-200/50">
			<div className="flex flex-col gap-4">
				<div className="flex items-center justify-between gap-4">
					<Link href="/" className="flex items-center gap-2 bg-white rounded-full px-6 py-3 shadow-sm min-w-max hover:shadow-md transition-all group">
						<div className="w-6 h-6 bg-black rounded-full grid place-items-center group-hover:scale-110 transition-transform">
							<span className="text-white text-xs font-bold">N</span>
						</div>
						<span className="font-bold text-lg tracking-tight">Nestify</span>
					</Link>

					<div ref={searchRef} className="hidden md:block flex-1 max-w-2xl relative z-50">
						<form onSubmit={handleSearch} className="flex bg-white rounded-full p-1.5 shadow-sm items-center pl-6 hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-black/5 relative z-20">
							<input type="text" value={searchQuery} onFocus={() => setShowSearchHistory(true)} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search collection..." className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-gray-400 font-medium min-w-0" />
							<Button type="submit" size="icon" variant="primary" className="!w-10 !h-10 shrink-0">
								<Search size={18} />
							</Button>
						</form>

						{showSearchHistory && searchHistory.length > 0 && (
							<div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in z-10 p-2">
								<div className="text-xs font-bold text-gray-400 uppercase tracking-wider px-4 py-2">Recent Searches</div>
								{searchHistory.map((term, idx) => (
									<div
										key={idx}
										onClick={() => {
											setSearchQuery(term);
											navigate.push(`/search?q=${encodeURIComponent(term)}`);
											setShowSearchHistory(false);
										}}
										className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 rounded-xl cursor-pointer group"
									>
										<div className="flex items-center gap-3 text-gray-600">
											<Clock size={14} />
											<span className="text-sm">{term}</span>
										</div>
										<button onClick={(e) => removeHistoryItem(e, term)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
											<CloseIcon size={14} />
										</button>
									</div>
								))}
							</div>
						)}
					</div>

					<div className="flex items-center gap-2">
						{isAuthenticated ? (
							<Link href="/account">
								<Button variant="icon" className=" md:flex relative group hidden sm:flex max-h-[46] min-h-[46]" active={isActive("/account")}>
									<UserIcon size={20} />
								</Button>
							</Link>
						) : (
							<Link href="/log-in">
								<Button variant="secondary" size="sm" className="max-h-[46] min-h-[46] md:flex relative group hidden sm:flex">
									<LogIn size={16} className="mr-2" /> Sign In
								</Button>
							</Link>
						)}

						<Link href="/wish">
							<Button variant="icon" className="relative group hidden sm:flex" active={isActive("/wishlist")}>
								<Heart size={20} className={`transition-colors ${isActive("/wishlist") ? "fill-black" : "group-hover:fill-red-500 group-hover:text-red-500"}`} />
								{wishlist.length > 0 && <span className="absolute top-0 right-0 -mt-1 -mr-1 w-4 h-4 bg-black rounded-full text-white text-[10px] grid place-items-center border border-white">{wishlist.length}</span>}
							</Button>
						</Link>

						<Button variant="icon" className="relative hover:bg-black hover:text-white transition-colors" onClick={toggleCart}>
							<ShoppingBag size={20} />
							{cartItemCount > 0 && <span className="absolute top-0 right-0 -mt-1 -mr-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] grid place-items-center border border-white animate-fade-in">{cartItemCount}</span>}
						</Button>

						<Button variant="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
							{isOpen ? <X size={20} /> : <Menu size={20} />}
						</Button>
					</div>
				</div>
			</div>

			{isOpen && (
				<div className="md:hidden absolute top-full left-0 w-full bg-nest-bg p-4 shadow-xl rounded-b-3xl border-t border-gray-200 flex flex-col gap-4 animate-slide-up z-50">
					<form onSubmit={handleSearch} className="flex gap-2">
						<Input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." className="flex-1 bg-white rounded-2xl px-4 py-3 outline-none" />
						<Button type="submit" variant="primary">
							<Search size={20} />
						</Button>
					</form>

					<Link href="/" onClick={() => setIsOpen(false)} className="p-4 bg-white rounded-2xl font-medium">
						Home
					</Link>
					<Link href="/product" onClick={() => setIsOpen(false)} className="p-4 bg-white rounded-2xl font-medium">
						Shop Collection
					</Link>
					<Link href="/wish" onClick={() => setIsOpen(false)} className="p-4 bg-white rounded-2xl font-medium flex justify-between">
						Wishlist
						{wishlist.length > 0 && <span className="bg-black text-white px-2 rounded-full text-xs py-1">{wishlist.length}</span>}
					</Link>

					{isAuthenticated ? (
						<Link href="/account" onClick={() => setIsOpen(false)} className="p-4 bg-white rounded-2xl font-medium">
							Account
						</Link>
					) : (
						<Link href="/log-in" onClick={() => setIsOpen(false)} className="p-4 bg-white rounded-2xl font-medium">
							Sign In
						</Link>
					)}
				</div>
			)}
		</nav>
	);
};

export default Navbar;
