"use client";

import React from "react";

interface LayoutContextType {
  isCartOpen: boolean;
  toggleCart: () => void;
}

export const LayoutContext = React.createContext<LayoutContextType>({
  isCartOpen: false,
  toggleCart: () => {},
});
