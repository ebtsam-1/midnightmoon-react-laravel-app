import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { products, formatPrice } from "./UserProductsIndex";

function BackLink({ to }) {
  return (
    <Link to={to} className="products-back">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M10 3 5 8l5 5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Back to products
    </Link>
  );
}

export default function ProductDetails() {
  const { id } = useParams();
  const location = useLocation();
  const [activeImage, setActiveImage] = useState(0);

  // Return to the same list page the visitor came from
  const fromPage = location.state?.fromPage ?? 1;
  const backTo = `/products?page=${fromPage}`;

  const product = products.find((item) => String(item.id) === id);

  // Start at the top, with the first photo selected, whenever the product changes
  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveImage(0);
  }, [id]);

  if (!product) {
    return (
      <main className="products-page">
        <div className="products-empty">
          <h1 className="products-empty__title">Product not found</h1>
          <p className="products-empty__text">
            This product may have been removed or the link is incorrect.
          </p>
          <Link to="/products" className="products-btn">
            Browse all products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="products-page">
      <BackLink to={backTo} />

      <article className="product-detail">
        <div className="product-detail__gallery">
          <div className="product-detail__hero">
            <img
              className="product-detail__hero-image"
              src={product.images[activeImage]}
              alt={`${product.title}, photo ${activeImage + 1}`}
            />
          </div>

          {product.images.length > 1 && (
            <div className="product-detail__thumbs" role="group" aria-label="Product photos">
              {product.images.map((src, index) => (
                <button
                  type="button"
                  key={src}
                  className={`product-detail__thumb${index === activeImage ? " is-active" : ""}`}
                  onClick={() => setActiveImage(index)}
                  aria-label={`Show photo ${index + 1}`}
                  aria-pressed={index === activeImage}
                >
                  <img src={src} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="product-detail__info">
          <span className="product-detail__category">{product.category}</span>
          <h1 className="product-detail__title">{product.title}</h1>

          <div className="product-detail__price-row">
            <span className="product-detail__price">{formatPrice(product.price)}</span>
            <span
              className={`product-detail__stock${product.inStock ? " is-in" : " is-out"}`}
            >
              {product.inStock ? "In stock" : "Out of stock"}
            </span>
          </div>

          <p className="product-detail__description">{product.description}</p>

          <h2 className="product-detail__specs-title">Specifications</h2>
          <dl className="product-detail__specs">
            {product.specs.map((spec) => (
              <div className="product-detail__spec-row" key={spec.label}>
                <dt>{spec.label}</dt>
                <dd>{spec.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </article>
    </main>
  );
}
