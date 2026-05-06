export const LOCATIONS = [
  "United States",
  "United Kingdom",
  "Canada",
  "Germany",
  "France",
  "India",
  "Brazil",
  "Australia",
  "Nigeria",
  "Japan",
  "Mexico",
  "South Africa",
  "China",
  "Spain",
  "Italy",
];

export const PRODUCT_CATEGORIES = [
  "Electronics",
  "Fashion",
  "Food & Drinks",
  "Beauty",
  "Home & Kitchen",
  "Agriculture",
  "Services",
  "Others",
];

export function calculateDeliveryFee(location: string | undefined, subtotal: number) {
  const lowerLocation = location?.toLowerCase() ?? "";
  let baseFee = 20;

  if (["united states", "canada", "united kingdom", "australia", "europe"].some((region) => lowerLocation.includes(region))) {
    baseFee = 15;
  } else if (["india", "brazil", "nigeria", "south africa", "china", "japan", "mexico"].some((region) => lowerLocation.includes(region))) {
    baseFee = 18;
  }

  if (subtotal >= 2000) {
    return Math.max(0, baseFee - 5);
  }

  return baseFee;
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
