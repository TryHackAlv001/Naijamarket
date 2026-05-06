'use client';

import { useState } from "react";
import { Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useCartStore } from "@/store/cartStore";
import { formatCurrency } from "@/constants";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product & { vendor: { full_name: string } };
}

export function ProductCard({ product }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = async () => {
    setIsAdding(true);
    addItem({ id: product.id, product, quantity: 1 });
    setTimeout(() => setIsAdding(false), 600);
  };

  const isOutOfStock = product.stock_quantity === 0;

  return (
    <article className="group relative w-72 shrink-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-lg">
      {isOutOfStock ? (
        <Badge className="absolute left-4 top-4 bg-red-100 text-red-800">Out of Stock</Badge>
      ) : null}

      <div className="aspect-square overflow-hidden rounded-2xl bg-slate-100">
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400">No Image</div>
        )}
      </div>

      <div className="mt-4 space-y-2">
        <h3 className="line-clamp-2 text-lg font-semibold text-slate-900">{product.name}</h3>
        <p className="text-sm text-slate-600">by {product.vendor.full_name}</p>

        <div className="flex items-center gap-1">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
              />
            ))}
          </div>
          <span className="text-sm text-slate-600">({product.review_count})</span>
        </div>

        <p className="text-xl font-bold text-slate-900">{formatCurrency(product.price)}</p>

        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAdding}
          className={`w-full transition ${isAdding ? "bg-emerald-600" : ""}`}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {isAdding ? "Added!" : isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>
      </div>
    </article>
  );
}
