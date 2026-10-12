import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, MouseEvent, PointerEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router";

import { WishlistButton } from "./WishlistButton";
import type { Product } from "../lib/api";
import "./Carousel.css";

const DRAG_THRESHOLD_PX = 5;

export type CarouselItem = {
  src: string;
  alt: string;
  name?: string;
  price?: number;
  product?: Product;
};

type CarouselProps = {
  items: CarouselItem[];
  visible?: number;
  variant?: "image" | "product";
  title?: string;
};

export function Carousel({ items, visible = 5, variant = "image", title }: CarouselProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; scrollLeft: number } | null>(null);
  const moved = useRef(false);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(Math.max(1, Math.ceil(items.length / visible)));
  const [dragging, setDragging] = useState(false);

  const goTo = (target: number) => {
    const el = contentRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    el.scrollTo({ left: Math.min(target * el.clientWidth, maxScroll), behavior: "smooth" });
  };

  const syncPage = useCallback(() => {
    const el = contentRef.current;
    if (!el || el.clientWidth === 0) return;
    const count = Math.max(1, Math.ceil((el.scrollWidth - 1) / el.clientWidth));
    const maxScroll = el.scrollWidth - el.clientWidth;
    const next = el.scrollLeft >= maxScroll - 1 ? count - 1 : Math.round(el.scrollLeft / el.clientWidth);
    setPageCount(count);
    setPage(Math.min(Math.max(next, 0), count - 1));
  }, []);

  useEffect(() => {
    syncPage();
    window.addEventListener("resize", syncPage);
    return () => window.removeEventListener("resize", syncPage);
  }, [syncPage]);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    if ((e.target as HTMLElement).closest("button")) return;
    drag.current = { x: e.clientX, scrollLeft: e.currentTarget.scrollLeft };
    moved.current = false;
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const delta = e.clientX - drag.current.x;
    // Capturing the pointer only once a real drag starts keeps plain clicks reaching links.
    if (!moved.current) {
      if (Math.abs(delta) < DRAG_THRESHOLD_PX) return;
      moved.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);
      setDragging(true);
    }
    e.currentTarget.scrollLeft = drag.current.scrollLeft - delta;
  };

  const endDrag = () => {
    if (!drag.current) return;
    drag.current = null;
    setDragging(false);
  };

  const onClickCapture = (e: MouseEvent<HTMLDivElement>) => {
    if (!moved.current) return;
    moved.current = false;
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <section className={`carousel-section carousel-${variant}`}>
      {title && <h2 className="carousel-title">{title}</h2>}
      <div className="carousel" style={{ "--carousel-visible": visible } as CSSProperties}>
        <button
          className="carousel-prev"
          onClick={() => goTo(page - 1)}
          disabled={page === 0}
          aria-label="Previous"
        >
          <ChevronLeft />
        </button>
        <div
          ref={contentRef}
          className={`carousel-content${dragging ? " dragging" : ""}`}
          onScroll={syncPage}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onClickCapture={onClickCapture}
        >
          {items.map((item) => (
            <div className="carousel-item" key={item.src}>
              {item.product ? (
                <>
                  <Link className="carousel-product-link" to={`/product/${item.product.id}`}>
                    <div className="carousel-image-wrapper">
                      <img src={item.src} alt={item.alt} draggable={false} />
                    </div>
                    {(item.name || item.price !== undefined) && (
                      <div className="carousel-caption">
                        {item.name && <span className="carousel-item-name">{item.name}</span>}
                        {item.price !== undefined && (
                          <span className="carousel-item-price">${item.price.toFixed(2)}</span>
                        )}
                      </div>
                    )}
                  </Link>
                  <WishlistButton product={item.product} />
                </>
              ) : (
                <>
                  <div className="carousel-image-wrapper">
                    <img src={item.src} alt={item.alt} draggable={false} />
                  </div>
                  {(item.name || item.price !== undefined) && (
                    <div className="carousel-caption">
                      {item.name && <span className="carousel-item-name">{item.name}</span>}
                      {item.price !== undefined && (
                        <span className="carousel-item-price">${item.price.toFixed(2)}</span>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
        <button
          className="carousel-next"
          onClick={() => goTo(page + 1)}
          disabled={page >= pageCount - 1}
          aria-label="Next"
        >
          <ChevronRight />
        </button>
        <div className="carousel-pagination">
          <div className="carousel-dots">
            {Array.from({ length: pageCount }, (_, i) => (
              <button
                key={i}
                className={`carousel-pagination-dot${i === page ? " active" : ""}`}
                onClick={() => goTo(i)}
                aria-label={`Go to page ${i + 1}`}
                aria-current={i === page}
              />
            ))}
          </div>
          <span className="carousel-counter" aria-hidden="true">
            {page + 1} / {pageCount}
          </span>
        </div>
      </div>
    </section>
  );
}
