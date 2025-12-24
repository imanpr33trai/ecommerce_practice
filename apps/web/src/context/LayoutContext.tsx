"use client";

import React from "react";

interface LayoutContextType {
  isCartOpen: boolean;
  toggleCart: () => void;
  isAuthModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
}

export const LayoutContext = React.createContext<LayoutContextType>({
  isCartOpen: false,
  toggleCart: () => { }, isAuthModalOpen: false, setAuthModalOpen: () => { }
});
