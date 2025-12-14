"use client"
import React from 'react';

export const LayoutContext = React.createContext({
  isCartOpen: false,
  toggleCart: () => {},
});