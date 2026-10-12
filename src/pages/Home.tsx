import { useMemo } from "react";
import { useLoaderData } from "react-router";
import { Carousel } from "../components/Carousel";
import type { CarouselItem } from "../components/Carousel";
import { heroImages } from "./home-images";
import { Sale } from "../components/Sale";
import type { Product } from "../lib/api";
import { filterProducts } from "../lib/catalog";

const PER_GENDER = 5;

function interleave<T>(a: T[], b: T[]): T[] {
  const out: T[] = [];
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (i < a.length) out.push(a[i]);
    if (i < b.length) out.push(b[i]);
  }
  return out;
}

function featuredItems(products: Product[]): CarouselItem[] {
  const women = filterProducts(products, "women", "clothing").slice(0, PER_GENDER);
  const men = filterProducts(products, "men", "clothing").slice(0, PER_GENDER);
  return interleave(women, men).map((p) => ({
    src: p.image,
    alt: p.title,
    name: p.title,
    price: p.price,
    product: p,
  }));
}

export function Component() {
  const products = useLoaderData<Product[]>();
  const featured = useMemo(() => featuredItems(products), [products]);

  return (
    <>
      <Carousel items={heroImages} />
      <Sale />
      <Carousel items={featured} variant="product" title="Featured Products" />
    </>
  );
}
