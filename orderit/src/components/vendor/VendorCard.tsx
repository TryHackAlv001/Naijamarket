'use client';

import { Star, MapPin, Package, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import type { VendorProfile } from "@/types";

interface VendorCardProps {
  vendor: VendorProfile & { user: { full_name: string }; _count: { products: number } };
}

export function VendorCard({ vendor }: VendorCardProps) {
  return (
    <article className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-lg">
      <div className="flex items-start gap-4">
        <div className="aspect-square w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100">
          {vendor.logo_url ? (
            <img
              src={vendor.logo_url}
              alt={vendor.shop_name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-400 text-sm">Logo</div>
          )}
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold text-slate-900">{vendor.shop_name}</h3>
            {vendor.is_verified && (
              <Badge className="bg-emerald-100 text-emerald-800">Verified</Badge>
            )}
          </div>

          <p className="text-sm text-slate-600 line-clamp-2">{vendor.shop_description}</p>

          <div className="flex items-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {vendor.location}
            </div>
            <div className="flex items-center gap-1">
              <Package className="h-4 w-4" />
              {vendor._count.products} products
            </div>
          </div>

          <div className="flex items-center gap-1">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.floor(vendor.rating) ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
                />
              ))}
            </div>
            <span className="text-sm text-slate-600">({vendor.rating.toFixed(1)})</span>
          </div>

          <Link href={`/vendor/${vendor.id}`}>
            <Button className="w-full">
              <ExternalLink className="mr-2 h-4 w-4" />
              Visit Store
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
