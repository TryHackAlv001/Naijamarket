'use client';

import { useState } from "react";
import type { VendorProfile } from "@/types";

export function useVendor() {
  const [profile, setProfile] = useState<VendorProfile | null>(null);

  return {
    profile,
    loading: false,
    fetchProfile: async (vendorId: string) => {
      setProfile({
        id: vendorId,
        user_id: "",
        shop_name: "",
        shop_description: "",
        is_verified: false,
        rating: 0,
        total_sales: 0,
        created_at: new Date(),
      });
    },
  };
}
