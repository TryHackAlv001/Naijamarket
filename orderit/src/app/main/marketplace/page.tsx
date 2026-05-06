import { createSupabaseServerClient } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/product/ProductCard";
import { VendorCard } from "@/components/vendor/VendorCard";
import { ProductCardSkeleton, VendorCardSkeleton, CategoryCardSkeleton } from "@/components/skeletons";
import Link from "next/link";
import { Search } from "lucide-react";

async function getFeaturedProducts() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      vendor:users(full_name)
    `)
    .eq("is_active", true)
    .order("rating", { ascending: false })
    .limit(10);

  if (error) throw error;
  return data;
}

async function getTopVendors() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("vendor_profiles")
    .select(`
      *,
      user:users(full_name),
      _count:products(count)
    `)
    .order("rating", { ascending: false })
    .order("total_sales", { ascending: false })
    .limit(6);

  if (error) throw error;
  return data;
}

async function getRecentProducts() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      vendor:users(full_name)
    `)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(8);

  if (error) throw error;
  return data;
}

async function getCategories() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .limit(8);

  if (error) throw error;
  return data;
}

export default async function MarketplacePage() {
  const [featuredProducts, topVendors, recentProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getTopVendors(),
    getRecentProducts(),
    getCategories(),
  ]);

  return (
    <div className="space-y-12">
      {/* Hero Banner */}
      <section className="rounded-[2rem] bg-gradient-to-br from-emerald-900 via-slate-900 to-[#0f4f36] px-6 py-12 text-white sm:px-12 sm:py-16">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="space-y-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Shop From Verified Global Sellers
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-emerald-100 sm:text-xl">
              Discover authentic products from trusted vendors around the world. Quality, worldwide, and secure.
            </p>
          </div>

          <div className="mx-auto max-w-2xl space-y-6">
            <div className="flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm">
              <Search className="h-5 w-5 text-emerald-200" />
              <input
                className="flex-1 bg-transparent text-white placeholder:text-emerald-200 focus:outline-none"
                type="search"
                placeholder="Search products, vendors..."
              />
              <Button className="bg-emerald-600 hover:bg-emerald-700">Search</Button>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {["Electronics", "Fashion", "Food & Drinks", "Beauty", "Home & Kitchen"].map((category) => (
                <Link
                  key={category}
                  href={`/marketplace?category=${encodeURIComponent(category)}`}
                  className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-emerald-100 hover:bg-white/20"
                >
                  {category}
                </Link>
              ))}
            </div>

            <div className="text-center">
              <Link href="/register">
                <Button className="bg-emerald-600 hover:bg-emerald-700">Start Selling</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold">Shop by Category</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories?.map((category) => (
            <Link
              key={category.id}
              href={`/marketplace?category=${encodeURIComponent(category.name)}`}
              className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-2xl">
                  {category.icon || "📦"}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{category.name}</h3>
                  <p className="text-sm text-slate-600">Browse products</p>
                </div>
              </div>
            </Link>
          )) || Array.from({ length: 8 }).map((_, i) => <CategoryCardSkeleton key={i} />)}
        </div>
      </section>

      {/* Featured Products */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold">Featured Products</h2>
        <div className="flex gap-6 overflow-x-auto pb-4">
          {featuredProducts?.map((product) => (
            <ProductCard key={product.id} product={product} />
          )) || Array.from({ length: 5 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      </section>

      {/* Top Vendors */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold">Top Vendors</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {topVendors?.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} />
          )) || Array.from({ length: 6 }).map((_, i) => <VendorCardSkeleton key={i} />)}
        </div>
      </section>

      {/* Recently Added */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold">Recently Added</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {recentProducts?.map((product) => (
            <ProductCard key={product.id} product={product} />
          )) || Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      </section>
    </div>
  );
}
