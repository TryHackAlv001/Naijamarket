'use client';

import { useState } from "react";
import type { CartItem } from "@/types";

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: CartItem) => setItems((current) => [...current, item]);
  const removeItem = (id: string) => setItems((current) => current.filter((item) => item.id !== id));

  return { items, addItem, removeItem };
}
