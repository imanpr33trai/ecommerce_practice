import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import ModalQuickView from './ModalQuickView';
import ModalCompare from './ModalCompare';
import { LayoutContext } from '../context/LayoutContext';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  return (
    <LayoutContext.Provider value={{ isCartOpen, toggleCart }}>
      <div className="flex flex-col min-h-screen bg-nest-bg text-nest-text font-sans selection:bg-black selection:text-white">
        <Navbar />
        <main className="flex-1 w-full relative">
          {children}
        </main>
        <Footer />
        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        <ModalQuickView />
        <ModalCompare />
      </div>
    </LayoutContext.Provider>
  );
}