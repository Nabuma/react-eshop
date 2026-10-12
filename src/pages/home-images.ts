import type { CarouselItem } from "../components/Carousel";

const imagePaths = (prefix: string, count: number) =>
  Array.from({ length: count }, (_, i) => `/images/${prefix}-${String(i + 1).padStart(2, "0")}.webp`);

// Alternate women/men; leftovers of the larger set go at the end.
const interleave = <T,>(a: T[], b: T[]) => {
  const out: T[] = [];
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (i < a.length) out.push(a[i]);
    if (i < b.length) out.push(b[i]);
  }
  return out;
};

export const heroImages: CarouselItem[] = interleave(imagePaths("women", 12), imagePaths("men", 8)).map(
  (src, i) => ({ src, alt: `Carousel Item ${i + 1}` }),
);
