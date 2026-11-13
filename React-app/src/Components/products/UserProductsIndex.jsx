import { Link, useSearchParams } from "react-router-dom";

// Sample data shared by the list page and the details page.
// Replace with your API data (keep the same field names, or adjust the components).

export const CURRENCY = "USD"; // change to "EGP", "EUR", etc.

export const formatPrice = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: CURRENCY,
    maximumFractionDigits: 0,
  }).format(value);

// Placeholder photos. Replace with your real product images.
const img = (seed) => `https://picsum.photos/seed/${seed}/900/675`;
const gallery = (slug) => [img(`${slug}-1`), img(`${slug}-2`), img(`${slug}-3`)];

export const products = [
  {
    id: 1,
    title: "Aurora Wireless Headphones",
    category: "Audio",
    price: 129,
    inStock: true,
    images: gallery("aurora"),
    description:
      "Over-ear headphones with active noise cancelling and a soft, breathable fit. Built for long flights, long workdays and everything in between.",
    specs: [
      { label: "Battery life", value: "40 hours" },
      { label: "Noise cancelling", value: "Active (ANC)" },
      { label: "Connectivity", value: "Bluetooth 5.3" },
      { label: "Weight", value: "250 g" },
      { label: "Charging", value: "USB-C" },
    ],
  },
  {
    id: 2,
    title: "Pulse Smartwatch",
    category: "Wearables",
    price: 199,
    inStock: true,
    images: gallery("pulse"),
    description:
      "A bright AMOLED smartwatch that tracks your workouts, sleep and heart rate, and lasts a full week between charges.",
    specs: [
      { label: "Display", value: '1.4" AMOLED' },
      { label: "Battery life", value: "7 days" },
      { label: "Water resistance", value: "5 ATM" },
      { label: "Sensors", value: "Heart rate, SpO2, GPS" },
      { label: "Compatibility", value: "Android and iOS" },
    ],
  },
  {
    id: 3,
    title: "Keystone Mechanical Keyboard",
    category: "Accessories",
    price: 89,
    inStock: true,
    images: gallery("keystone"),
    description:
      "A compact 75% keyboard with hot-swappable switches, so you can change how it feels without soldering. Connects to up to three devices.",
    specs: [
      { label: "Switches", value: "Hot-swappable, brown" },
      { label: "Layout", value: "75%" },
      { label: "Connectivity", value: "Bluetooth and 2.4 GHz" },
      { label: "Backlight", value: "RGB per key" },
      { label: "Battery", value: "4000 mAh" },
    ],
  },
  {
    id: 4,
    title: 'Vista 27" 4K Monitor',
    category: "Displays",
    price: 379,
    inStock: true,
    images: gallery("vista"),
    description:
      "A sharp 4K IPS monitor with accurate color for design and photo work, plus a USB-C port that charges your laptop while it displays.",
    specs: [
      { label: "Resolution", value: "3840 × 2160" },
      { label: "Panel", value: "IPS" },
      { label: "Refresh rate", value: "60 Hz" },
      { label: "Color coverage", value: "99% sRGB" },
      { label: "Ports", value: "HDMI 2.0, USB-C 65 W" },
    ],
  },
  {
    id: 5,
    title: "Lift Aluminum Laptop Stand",
    category: "Accessories",
    price: 39,
    inStock: true,
    images: gallery("lift"),
    description:
      "A sturdy aluminum stand that raises your screen to eye level and lets heat escape. Folds flat to slip into a bag.",
    specs: [
      { label: "Material", value: "Aluminum alloy" },
      { label: "Height", value: "6 adjustable levels" },
      { label: "Fits", value: '10–17" laptops' },
      { label: "Weight", value: "780 g" },
      { label: "Foldable", value: "Yes" },
    ],
  },
  {
    id: 6,
    title: "ClearView 1080p Webcam",
    category: "Video",
    price: 59,
    inStock: true,
    images: gallery("clearview"),
    description:
      "A plug-and-play webcam with autofocus and two noise-reducing microphones, so you look and sound clear on every call.",
    specs: [
      { label: "Resolution", value: "1080p at 30 fps" },
      { label: "Field of view", value: "90°" },
      { label: "Microphone", value: "Dual, noise-reducing" },
      { label: "Autofocus", value: "Yes" },
      { label: "Connection", value: "USB-A" },
    ],
  },
  {
    id: 7,
    title: "Echo Mini Portable Speaker",
    category: "Audio",
    price: 69,
    inStock: true,
    images: gallery("echo"),
    description:
      "A pocket-sized speaker with loud, balanced sound. Dust-proof and waterproof, so it comes along to the beach and the pool.",
    specs: [
      { label: "Battery life", value: "12 hours" },
      { label: "Water resistance", value: "IP67" },
      { label: "Output", value: "20 W" },
      { label: "Bluetooth", value: "5.2" },
      { label: "Weight", value: "540 g" },
    ],
  },
  {
    id: 8,
    title: "Glide Wireless Gaming Mouse",
    category: "Accessories",
    price: 74,
    inStock: true,
    images: gallery("glide"),
    description:
      "A lightweight wireless mouse with a high-precision sensor and six programmable buttons, tuned for fast, accurate control.",
    specs: [
      { label: "Sensor", value: "26,000 DPI" },
      { label: "Weight", value: "58 g" },
      { label: "Battery life", value: "70 hours" },
      { label: "Buttons", value: "6 programmable" },
      { label: "Connectivity", value: "2.4 GHz and Bluetooth" },
    ],
  },
  {
    id: 9,
    title: "Charge+ 20,000 mAh Power Bank",
    category: "Power",
    price: 45,
    inStock: true,
    images: gallery("charge"),
    description:
      "A high-capacity power bank that can charge a laptop, a phone and earbuds at the same time.",
    specs: [
      { label: "Capacity", value: "20,000 mAh" },
      { label: "Output", value: "65 W USB-C PD" },
      { label: "Ports", value: "2 USB-C, 1 USB-A" },
      { label: "Weight", value: "430 g" },
      { label: "Recharge time", value: "3.5 hours" },
    ],
  },
  {
    id: 10,
    title: 'Slate 11" Tablet',
    category: "Tablets",
    price: 449,
    inStock: false,
    images: gallery("slate"),
    description:
      "A smooth 120 Hz tablet for reading, sketching and streaming, with enough battery for a full day away from the charger.",
    specs: [
      { label: "Display", value: '11" 120 Hz LCD' },
      { label: "Storage", value: "128 GB" },
      { label: "Battery life", value: "10 hours" },
      { label: "Processor", value: "Octa-core" },
      { label: "Cameras", value: "13 MP rear, 8 MP front" },
    ],
  },
  {
    id: 11,
    title: "Ink Paper E-Reader",
    category: "Readers",
    price: 139,
    inStock: true,
    images: gallery("ink"),
    description:
      "A glare-free E Ink reader with an adjustable warm light. Waterproof, and the battery lasts for weeks.",
    specs: [
      { label: "Display", value: '6.8" E Ink' },
      { label: "Backlight", value: "Adjustable warm light" },
      { label: "Storage", value: "16 GB" },
      { label: "Battery life", value: "Up to 10 weeks" },
      { label: "Water resistance", value: "IPX8" },
    ],
  },
  {
    id: 12,
    title: "Halo Smart Desk Lamp",
    category: "Lighting",
    price: 55,
    inStock: true,
    images: gallery("halo"),
    description:
      "A slim desk lamp with adjustable brightness and color temperature, controlled by touch or from your phone.",
    specs: [
      { label: "Brightness", value: "800 lumens" },
      { label: "Color temperature", value: "2700–6500 K" },
      { label: "Control", value: "App and touch" },
      { label: "Power", value: "12 W" },
      { label: "Cable", value: "1.5 m USB-C" },
    ],
  },
];

const PAGE_SIZE = 9;
const CARD_SPEC_COUNT = 3; // how many specifications to show on each card

// Builds the pagination items, e.g. [1, "…", 4, 5, 6, "…", 12]
function getPageItems(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const items = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) items.push("…");
  for (let i = start; i <= end; i += 1) items.push(i);
  if (end < total - 1) items.push("…");
  items.push(total);

  return items;
}

export default function UserProductsIndex() {
  // The current page lives in the URL (?page=2), so going back from a
  // product page returns you to the same page of the list.
  const [searchParams, setSearchParams] = useSearchParams();

  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const requestedPage = Number(searchParams.get("page")) || 1;
  const page = Math.min(Math.max(1, requestedPage), totalPages);

  const startIndex = (page - 1) * PAGE_SIZE;
  const visibleProducts = products.slice(startIndex, startIndex + PAGE_SIZE);

  const goToPage = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === page) return;
    setSearchParams({ page: String(nextPage) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="products-page">
      <header className="products-header">
        <h1 className="products-title">Products</h1>
        <p className="products-count">{products.length} items</p>
      </header>

      <section className="products-grid" aria-label="Products">
        {visibleProducts.map((product) => (
          <article className="product-card" key={product.id}>
            <Link
              to={`/products/${product.id}`}
              state={{ fromPage: page }}
              className="product-card__media"
              tabIndex={-1}
              aria-hidden="true"
            >
              <img
                className="product-card__image"
                src={product.images[0]}
                alt=""
                loading="lazy"
              />
              <span className="product-card__category">{product.category}</span>
            </Link>

            <div className="product-card__body">
              <h2 className="product-card__title">{product.title}</h2>

              <ul className="product-card__specs">
                {product.specs.slice(0, CARD_SPEC_COUNT).map((spec) => (
                  <li className="product-spec" key={spec.label}>
                    <span className="product-spec__label">{spec.label}</span>
                    <span className="product-spec__dots" aria-hidden="true" />
                    <span className="product-spec__value">{spec.value}</span>
                  </li>
                ))}
              </ul>

              <div className="product-card__footer">
                <span className="product-card__price">{formatPrice(product.price)}</span>
                <Link
                  to={`/products/${product.id}`}
                  state={{ fromPage: page }}
                  className="products-btn"
                  aria-label={`View more about ${product.title}`}
                >
                  View more
                </Link>
              </div>
            </div>
          </article>
        ))}
      </section>

      {totalPages > 1 && (
        <div className="products-pagination-wrap">
          <p className="products-showing">
            Showing {startIndex + 1}–{startIndex + visibleProducts.length} of {products.length}
          </p>

          <nav className="products-pagination" aria-label="Products pagination">
            <button
              type="button"
              className="products-page-btn"
              onClick={() => goToPage(page - 1)}
              disabled={page === 1}
            >
              Previous
            </button>

            {getPageItems(page, totalPages).map((item, index) =>
              item === "…" ? (
                <span className="products-page-gap" key={`gap-${index}`} aria-hidden="true">
                  …
                </span>
              ) : (
                <button
                  type="button"
                  key={item}
                  className={`products-page-btn${item === page ? " is-active" : ""}`}
                  onClick={() => goToPage(item)}
                  aria-label={`Page ${item}`}
                  aria-current={item === page ? "page" : undefined}
                >
                  {item}
                </button>
              )
            )}

            <button
              type="button"
              className="products-page-btn"
              onClick={() => goToPage(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </main>
  );
}
