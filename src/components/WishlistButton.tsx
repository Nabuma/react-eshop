import { Heart } from "lucide-react";
import { useWishlist } from "../lib/wishlist";
import type { Product } from "../lib/api";
import "./WishlistButton.css";

export function WishlistButton({ product }: { product: Product }) {
  const wishlist = useWishlist();
  const active = wishlist.has(product.id);

  return (
    <button
      className="wishlist-button"
      onClick={() => wishlist.toggle(product)}
      aria-pressed={active}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart className="wishlist-icon" fill={active ? "currentColor" : "none"} aria-hidden="true" />
    </button>
  );
}
