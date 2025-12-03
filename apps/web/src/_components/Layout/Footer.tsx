import { Twitter, Instagram, Facebook } from "lucide-react";
import MaxWidthWrapper from "../max-width-wrapper";
import Link from "next/link";
const Footer = () => {
    return (
        <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-black">
            <MaxWidthWrapper className="py-12">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {/* Brand Info */}
                    <div className="md:col-span-2 lg:col-span-1">
                        <h3 className="text-lg font-bold">Nestify</h3>
                        <p className="mt-4 text-sm text-muted-foreground">
                            Creating timeless furniture for the modern home.
                        </p>
                        <div className="mt-6 flex space-x-4">
                            <Link href="#" className="text-muted-foreground hover:text-primary"><Twitter className="h-5 w-5" /></Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary"><Instagram className="h-5 w-5" /></Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary"><Facebook className="h-5 w-5" /></Link>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="space-y-4">
                        <h4 className="font-semibold">Shop</h4>
                        <div className="flex flex-col space-y-2 text-sm">
                            <Link href="/categories/sofas" className="text-muted-foreground hover:text-primary">Sofas</Link>
                            <Link href="/categories/chairs" className="text-muted-foreground hover:text-primary">Chairs</Link>
                            <Link href="/categories/tables" className="text-muted-foreground hover:text-primary">Tables</Link>
                            <Link href="/products" className="text-muted-foreground hover:text-primary">All Products</Link>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h4 className="font-semibold">About</h4>
                        <div className="flex flex-col space-y-2 text-sm">
                            <Link href="/about" className="text-muted-foreground hover:text-primary">Our Story</Link>
                            <Link href="/about/sustainability" className="text-muted-foreground hover:text-primary">Sustainability</Link>
                            <Link href="/careers" className="text-muted-foreground hover:text-primary">Careers</Link>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h4 className="font-semibold">Support</h4>
                        <div className="flex flex-col space-y-2 text-sm">
                            <Link href="/contact" className="text-muted-foreground hover:text-primary">Contact Us</Link>
                            <Link href="/faq" className="text-muted-foreground hover:text-primary">FAQ</Link>
                            <Link href="/shipping" className="text-muted-foreground hover:text-primary">Shipping & Returns</Link>
                        </div>
                    </div>
                </div>

                <div className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col items-center justify-between text-sm text-muted-foreground md:flex-row">
                    <p>&copy; {new Date().getFullYear()} Nestify. All Rights Reserved.</p>
                    <div className="mt-4 flex space-x-6 md:mt-0">
                        <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-primary">Terms of Service</Link>
                    </div>
                </div>
            </MaxWidthWrapper>
        </footer>
    );
};

export default Footer;