import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState
} from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  useParams
} from "react-router-dom";

import "./App.css";

/* =========================================================
   PRODUCT DATA
========================================================= */

const PRODUCTS = [
  {
    id: 1,
    name: "Essential White Tee",
    price: 799,
    oldPrice: 999,
    category: "Men",
    rating: 4.8,
    reviews: 124,
    badge: "BEST SELLER",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85",
    description:
      "A premium everyday essential crafted from soft breathable cotton. Designed with a clean silhouette that works perfectly with jeans, trousers or shorts."
  },
  {
    id: 2,
    name: "Urban Denim Jacket",
    price: 1899,
    oldPrice: 2399,
    category: "Men",
    rating: 4.7,
    reviews: 86,
    badge: "TRENDING",
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=85",
    description:
      "A timeless denim jacket with a modern relaxed fit. Layer it over your everyday outfits for an effortless street-style look."
  },
  {
    id: 3,
    name: "Floral Summer Dress",
    price: 1499,
    oldPrice: 1899,
    category: "Women",
    rating: 4.9,
    reviews: 173,
    badge: "POPULAR",
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=85",
    description:
      "A graceful floral dress made for sunny days, brunch dates and weekend getaways. Lightweight, elegant and incredibly comfortable."
  },
  {
    id: 4,
    name: "Signature Black Hoodie",
    price: 1299,
    oldPrice: 1599,
    category: "Men",
    rating: 4.6,
    reviews: 91,
    badge: "NEW",
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=85",
    description:
      "Premium heavyweight hoodie with a soft interior and contemporary fit. Your go-to layer for cooler evenings."
  },
  {
    id: 5,
    name: "Luna Leather Handbag",
    price: 2199,
    oldPrice: 2799,
    category: "Accessories",
    rating: 4.8,
    reviews: 108,
    badge: "EDITOR'S PICK",
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85",
    description:
      "A sophisticated everyday handbag featuring a structured silhouette and generous storage for your essentials."
  },
  {
    id: 6,
    name: "Street Runner Sneakers",
    price: 2499,
    oldPrice: 2999,
    category: "Footwear",
    rating: 4.9,
    reviews: 216,
    badge: "BEST SELLER",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85",
    description:
      "Lightweight everyday sneakers combining comfort, grip and contemporary streetwear styling."
  },
  {
    id: 7,
    name: "Modern Power Blazer",
    price: 1999,
    oldPrice: 2499,
    category: "Women",
    rating: 4.7,
    reviews: 64,
    badge: "TRENDING",
    image:
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=85",
    description:
      "A polished modern blazer designed to elevate your workwear and occasion wardrobe."
  },
  {
    id: 8,
    name: "Minimal Classic Watch",
    price: 1799,
    oldPrice: 2299,
    category: "Accessories",
    rating: 4.8,
    reviews: 139,
    badge: "POPULAR",
    image:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=85",
    description:
      "A minimalist timepiece with a refined dial and versatile design that transitions easily from casual to formal."
  }
];

/* =========================================================
   CART CONTEXT + REDUCER
========================================================= */

const CartContext = createContext();

const initialCart = JSON.parse(
  localStorage.getItem("shopease-cart") || "[]"
);

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const existing = state.find(
        (item) => item.id === action.product.id
      );

      if (existing) {
        return state.map((item) =>
          item.id === action.product.id
            ? {
                ...item,
                quantity: item.quantity + 1
              }
            : item
        );
      }

      return [
        ...state,
        {
          ...action.product,
          quantity: 1
        }
      ];
    }

    case "INCREASE":
      return state.map((item) =>
        item.id === action.id
          ? {
              ...item,
              quantity: item.quantity + 1
            }
          : item
      );

    case "DECREASE":
      return state
        .map((item) =>
          item.id === action.id
            ? {
                ...item,
                quantity: item.quantity - 1
              }
            : item
        )
        .filter((item) => item.quantity > 0);

    case "REMOVE":
      return state.filter(
        (item) => item.id !== action.id
      );

    case "CLEAR":
      return [];

    default:
      return state;
  }
}

function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(
    cartReducer,
    initialCart
  );

  useEffect(() => {
    localStorage.setItem(
      "shopease-cart",
      JSON.stringify(cart)
    );
  }, [cart]);

  const cartCount = useMemo(
    () =>
      cart.reduce(
        (total, item) => total + item.quantity,
        0
      ),
    [cart]
  );

  const cartTotal = useMemo(
    () =>
      cart.reduce(
        (total, item) =>
          total + item.price * item.quantity,
        0
      ),
    [cart]
  );

  const value = {
    cart,
    cartCount,
    cartTotal,

    addToCart: (product) =>
      dispatch({
        type: "ADD",
        product
      }),

    increase: (id) =>
      dispatch({
        type: "INCREASE",
        id
      }),

    decrease: (id) =>
      dispatch({
        type: "DECREASE",
        id
      }),

    remove: (id) =>
      dispatch({
        type: "REMOVE",
        id
      }),

    clearCart: () =>
      dispatch({
        type: "CLEAR"
      })
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

function useCart() {
  return useContext(CartContext);
}

/* =========================================================
   HELPERS
========================================================= */

function money(value) {
  return `₹${value.toLocaleString("en-IN")}`;
}

/* =========================================================
   NAVBAR
========================================================= */

function Navbar({ wishlistCount }) {
  const { cartCount } = useCart();

  return (
    <header className="navbar">

      <div className="nav-inner">

        <Link to="/" className="brand">
          <span className="brand-mark">S</span>
          <span>
            Shop<span>Ease</span>
          </span>
        </Link>

        <nav className="nav-links">
          <Link to="/">Home</Link>

          <Link to="/#shop">
            Shop
          </Link>

          <Link to="/wishlist" className="nav-icon-link">
            ♡
            {wishlistCount > 0 && (
              <span className="nav-count">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link
            to="/cart"
            className="nav-cart"
          >
            🛒

            {cartCount > 0 && (
              <span className="nav-count">
                {cartCount}
              </span>
            )}
          </Link>
        </nav>

      </div>
    </header>
  );
}

/* =========================================================
   HOME
========================================================= */

function Home({ wishlist, toggleWishlist }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] =
    useState("All");
  const [sort, setSort] =
    useState("featured");

  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    if (category !== "All") {
      result = result.filter(
        (product) =>
          product.category === category
      );
    }

    if (search.trim()) {
      result = result.filter((product) =>
        product.name
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    if (sort === "low") {
      result.sort(
        (a, b) => a.price - b.price
      );
    }

    if (sort === "high") {
      result.sort(
        (a, b) => b.price - a.price
      );
    }

    if (sort === "rating") {
      result.sort(
        (a, b) => b.rating - a.rating
      );
    }

    return result;
  }, [search, category, sort]);

  return (
    <>

      {/* HERO */}

      <section className="hero-section">

        <div className="hero-overlay" />

        <div className="hero-content">

          <div className="hero-pill">
            ✦ NEW SEASON 2026
          </div>

          <h1>
            Style that feels
            <br />
            <em>uniquely yours.</em>
          </h1>

          <p>
            Discover curated fashion essentials
            designed for your everyday confidence.
          </p>

          <div className="hero-actions">

            <a
              href="#shop"
              className="btn btn-primary"
            >
              Explore Collection
              <span>→</span>
            </a>

            <Link
              to="/wishlist"
              className="btn btn-outline"
            >
              View Wishlist
            </Link>

          </div>

          <div className="hero-stats">

            <div>
              <strong>8K+</strong>
              <span>Happy Customers</span>
            </div>

            <div>
              <strong>4.9/5</strong>
              <span>Customer Rating</span>
            </div>

            <div>
              <strong>24h</strong>
              <span>Fast Dispatch</span>
            </div>

          </div>

        </div>
      </section>

      {/* TRUST STRIP */}

      <section className="trust-strip">

        <div>
          <span>✦</span>
          Free Shipping over ₹999
        </div>

        <div>
          <span>↻</span>
          Easy 7-Day Returns
        </div>

        <div>
          <span>✓</span>
          Secure Checkout
        </div>

        <div>
          <span>◈</span>
          Premium Quality
        </div>

      </section>

      {/* SHOP */}

      <section
        className="shop-section"
        id="shop"
      >

        <div className="shop-heading">

          <div>
            <p className="eyebrow">
              THE COLLECTION
            </p>

            <h2>
              Curated for
              <em> you.</em>
            </h2>
          </div>

          <p className="shop-intro">
            Thoughtfully selected pieces that
            make everyday dressing effortless.
          </p>

        </div>

        {/* SEARCH / FILTER */}

        <div className="filter-bar">

          <div className="search-box">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

          <div className="category-tabs">

            {[
              "All",
              "Men",
              "Women",
              "Accessories",
              "Footwear"
            ].map((item) => (
              <button
                key={item}
                className={
                  category === item
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setCategory(item)
                }
              >
                {item}
              </button>
            ))}

          </div>

          <select
            className="sort-select"
            value={sort}
            onChange={(e) =>
              setSort(e.target.value)
            }
          >
            <option value="featured">
              Featured
            </option>

            <option value="low">
              Price: Low → High
            </option>

            <option value="high">
              Price: High → Low
            </option>

            <option value="rating">
              Highest Rated
            </option>
          </select>

        </div>

        {/* PRODUCT GRID */}

        <div className="product-grid">

          {filteredProducts.map(
            (product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlist.includes(
                  product.id
                )}
                toggleWishlist={
                  toggleWishlist
                }
              />
            )
          )}

        </div>

        {filteredProducts.length === 0 && (
          <div className="no-products">
            <div>⌕</div>
            <h3>
              No products found
            </h3>
            <p>
              Try another search or category.
            </p>
          </div>
        )}

      </section>

      {/* PROMO BANNER */}

      <section className="promo-section">

        <div className="promo-content">

          <p className="eyebrow">
            THIS WEEK ONLY
          </p>

          <h2>
            Get 10% off your
            <br />
            first order.
          </h2>

          <p>
            Use code
            <strong> WELCOME10 </strong>
            at checkout.
          </p>

          <Link
            to="/cart"
            className="btn btn-light"
          >
            Start Shopping →
          </Link>

        </div>

        <div className="promo-decoration">
          10%
        </div>

      </section>

      {/* NEWSLETTER */}

      <section className="newsletter">

        <div>
          <p className="eyebrow">
            STAY IN THE LOOP
          </p>

          <h2>
            Get style inspiration
            <br />
            in your inbox.
          </h2>
        </div>

        <div className="newsletter-form">

          <input
            placeholder="Your email address"
            type="email"
          />

          <button>
            Subscribe →
          </button>

        </div>

      </section>

    </>
  );
}

/* =========================================================
   PRODUCT CARD
========================================================= */

function ProductCard({
  product,
  isWishlisted,
  toggleWishlist
}) {
  const { addToCart } = useCart();

  return (
    <article className="product-card">

      <Link
        to={`/product/${product.id}`}
        className="product-image-wrap"
      >

        <img
          src={product.image}
          alt={product.name}
        />

        <span className="product-badge">
          {product.badge}
        </span>

      </Link>

      <button
        className={`wishlist-button ${
          isWishlisted ? "liked" : ""
        }`}
        onClick={() =>
          toggleWishlist(product.id)
        }
      >
        {isWishlisted ? "♥" : "♡"}
      </button>

      <div className="product-card-body">

        <p className="product-category">
          {product.category}
        </p>

        <Link
          to={`/product/${product.id}`}
          className="product-name"
        >
          {product.name}
        </Link>

        <div className="rating">
          <span>★</span>
          {product.rating}
          <small>
            ({product.reviews})
          </small>
        </div>

        <div className="product-price-row">

          <div>
            <strong>
              {money(product.price)}
            </strong>

            <del>
              {money(product.oldPrice)}
            </del>
          </div>

          <button
            className="quick-add"
            onClick={() =>
              addToCart(product)
            }
          >
            +
          </button>

        </div>

      </div>

    </article>
  );
}

/* =========================================================
   PRODUCT DETAILS
========================================================= */

function ProductDetails({
  wishlist,
  toggleWishlist
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const product = PRODUCTS.find(
    (item) => item.id === Number(id)
  );

  const [quantity, setQuantity] =
    useState(1);

  if (!product) {
    return (
      <div className="not-found">
        <h1>Product not found</h1>
        <Link to="/" className="btn btn-primary">
          Back to Shop
        </Link>
      </div>
    );
  }

  const isLiked = wishlist.includes(
    product.id
  );

  const addProduct = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }

    navigate("/cart");
  };

  return (
    <section className="details-page">

      <Link
        to="/"
        className="back-link"
      >
        ← Back to collection
      </Link>

      <div className="details-layout">

        <div className="details-image">

          <img
            src={product.image}
            alt={product.name}
          />

          <span className="details-badge">
            {product.badge}
          </span>

        </div>

        <div className="details-info">

          <p className="product-category">
            {product.category}
          </p>

          <h1>{product.name}</h1>

          <div className="details-rating">
            <span>★</span>
            {product.rating}
            <span>
              · {product.reviews} reviews
            </span>
          </div>

          <div className="details-price">

            <strong>
              {money(product.price)}
            </strong>

            <del>
              {money(product.oldPrice)}
            </del>

            <span>
              {Math.round(
                (1 -
                  product.price /
                    product.oldPrice) *
                  100
              )}
              % OFF
            </span>

          </div>

          <p className="details-description">
            {product.description}
          </p>

          <div className="product-features">

            <div>
              <span>✓</span>
              Premium Quality
            </div>

            <div>
              <span>✓</span>
              Easy 7-Day Returns
            </div>

            <div>
              <span>✓</span>
              Fast Delivery
            </div>

          </div>

          <div className="detail-actions">

            <div className="quantity-control">

              <button
                onClick={() =>
                  setQuantity(
                    Math.max(
                      1,
                      quantity - 1
                    )
                  )
                }
              >
                −
              </button>

              <span>{quantity}</span>

              <button
                onClick={() =>
                  setQuantity(
                    quantity + 1
                  )
                }
              >
                +
              </button>

            </div>

            <button
              className="btn btn-primary add-detail"
              onClick={addProduct}
            >
              Add to Cart →
            </button>

            <button
              className={`detail-wishlist ${
                isLiked ? "liked" : ""
              }`}
              onClick={() =>
                toggleWishlist(
                  product.id
                )
              }
            >
              {isLiked ? "♥" : "♡"}
            </button>

          </div>

          <div className="delivery-box">

            <div>
              <span>🚚</span>

              <div>
                <strong>
                  Free shipping
                </strong>
                <p>
                  On orders above ₹999
                </p>
              </div>
            </div>

            <div>
              <span>↻</span>

              <div>
                <strong>
                  Easy returns
                </strong>
                <p>
                  Within 7 days
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

/* =========================================================
   CART
========================================================= */

function Cart() {
  const {
    cart,
    cartTotal,
    increase,
    decrease,
    remove
  } = useCart();

  const navigate = useNavigate();

  const [coupon, setCoupon] =
    useState("");

  const [couponApplied, setCouponApplied] =
    useState(false);

  const discount =
    couponApplied && cartTotal >= 999
      ? Math.round(cartTotal * 0.1)
      : 0;

  const finalTotal =
    cartTotal - discount;

  if (cart.length === 0) {
    return (
      <div className="empty-state">

        <div className="empty-icon">
          🛒
        </div>

        <p className="eyebrow">
          YOUR CART
        </p>

        <h1>
          Nothing here yet.
        </h1>

        <p>
          Discover something you'll love
          and add it to your cart.
        </p>

        <Link
          to="/"
          className="btn btn-primary"
        >
          Explore Products →
        </Link>

      </div>
    );
  }

  return (
    <section className="cart-page">

      <div className="page-title">

        <div>
          <p className="eyebrow">
            YOUR SHOPPING BAG
          </p>

          <h1>
            Your Cart
          </h1>
        </div>

        <span>
          {cart.length} product
          {cart.length > 1 ? "s" : ""}
        </span>

      </div>

      <div className="cart-layout">

        <div className="cart-list">

          {cart.map((item) => (
            <div
              className="cart-row"
              key={item.id}
            >

              <Link
                to={`/product/${item.id}`}
              >
                <img
                  src={item.image}
                  alt={item.name}
                />
              </Link>

              <div className="cart-product-info">

                <p className="product-category">
                  {item.category}
                </p>

                <h3>
                  {item.name}
                </h3>

                <p>
                  {money(item.price)}
                </p>

                <button
                  className="remove-link"
                  onClick={() =>
                    remove(item.id)
                  }
                >
                  Remove
                </button>

              </div>

              <div className="cart-quantity">

                <button
                  onClick={() =>
                    decrease(item.id)
                  }
                >
                  −
                </button>

                <span>
                  {item.quantity}
                </span>

                <button
                  onClick={() =>
                    increase(item.id)
                  }
                >
                  +
                </button>

              </div>

              <strong className="cart-item-total">
                {money(
                  item.price *
                    item.quantity
                )}
              </strong>

            </div>
          ))}

        </div>

        <aside className="order-summary">

          <h2>
            Order Summary
          </h2>

          <div className="summary-line">
            <span>Subtotal</span>
            <span>
              {money(cartTotal)}
            </span>
          </div>

          {discount > 0 && (
            <div className="summary-line discount">
              <span>WELCOME10</span>
              <span>
                -{money(discount)}
              </span>
            </div>
          )}

          <div className="summary-line">
            <span>Shipping</span>
            <span className="free">
              FREE
            </span>
          </div>

          <div className="coupon-box">

            <input
              placeholder="Coupon code"
              value={coupon}
              onChange={(e) =>
                setCoupon(
                  e.target.value.toUpperCase()
                )
              }
            />

            <button
              onClick={() => {
                if (
                  coupon ===
                    "WELCOME10" &&
                  cartTotal >= 999
                ) {
                  setCouponApplied(true);
                } else {
                  alert(
                    "Use WELCOME10 on orders above ₹999"
                  );
                }
              }}
            >
              Apply
            </button>

          </div>

          <div className="summary-total">

            <span>Total</span>

            <strong>
              {money(finalTotal)}
            </strong>

          </div>

          <button
            className="checkout-full"
            onClick={() =>
              navigate("/checkout")
            }
          >
            Proceed to Checkout →
          </button>

          <div className="secure-note">
            🔒 Secure checkout · No payment
            details stored
          </div>

        </aside>

      </div>

    </section>
  );
}

/* =========================================================
   WISHLIST
========================================================= */

function Wishlist({
  wishlist,
  toggleWishlist
}) {
  const savedProducts =
    PRODUCTS.filter((product) =>
      wishlist.includes(product.id)
    );

  return (
    <section className="wishlist-page">

      <div className="page-title">

        <div>
          <p className="eyebrow">
            SAVED FOR LATER
          </p>

          <h1>
            Your Wishlist
          </h1>
        </div>

      </div>

      {savedProducts.length === 0 ? (
        <div className="empty-state wishlist-empty">

          <div className="empty-icon">
            ♡
          </div>

          <h1>
            Your wishlist is empty.
          </h1>

          <p>
            Save pieces you love and
            come back to them later.
          </p>

          <Link
            to="/"
            className="btn btn-primary"
          >
            Discover Products →
          </Link>

        </div>
      ) : (
        <div className="product-grid">

          {savedProducts.map(
            (product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={true}
                toggleWishlist={
                  toggleWishlist
                }
              />
            )
          )}

        </div>
      )}

    </section>
  );
}

/* =========================================================
   CHECKOUT
========================================================= */

function Checkout() {
  const {
    cart,
    cartTotal,
    clearCart
  } = useCart();

  const [form, setForm] =
    useState({
      name: "",
      email: "",
      phone: "",
      address: ""
    });

  const [errors, setErrors] =
    useState({});

  const [orderPlaced, setOrderPlaced] =
    useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

    setErrors({
      ...errors,
      [e.target.name]: ""
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name =
        "Full name is required";
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email
      )
    ) {
      newErrors.email =
        "Please enter a valid email";
    }

    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      newErrors.phone =
        "Enter a valid 10-digit Indian phone number";
    }

    if (!form.address.trim()) {
      newErrors.address =
        "Delivery address is required";
    }

    return newErrors;
  };

  const submitOrder = (e) => {
    e.preventDefault();

    const validationErrors =
      validate();

    if (
      Object.keys(validationErrors)
        .length > 0
    ) {
      setErrors(validationErrors);
      return;
    }

    setOrderPlaced(true);
    clearCart();
  };

  if (orderPlaced) {
    return (
      <div className="success-page">

        <div className="success-icon">
          ✓
        </div>

        <p className="eyebrow">
          ORDER CONFIRMED
        </p>

        <h1>
          Thank you,
          <br />
          {form.name}.
        </h1>

        <p>
          Your ShopEase order has been
          successfully placed. We'll send
          confirmation details to
          <strong> {form.email}</strong>.
        </p>

        <Link
          to="/"
          className="btn btn-primary"
        >
          Continue Shopping →
        </Link>

      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="empty-state">
        <h1>
          Your cart is empty.
        </h1>

        <Link
          to="/"
          className="btn btn-primary"
        >
          Shop Now →
        </Link>
      </div>
    );
  }

  return (
    <section className="checkout-page">

      <Link
        to="/cart"
        className="back-link"
      >
        ← Back to cart
      </Link>

      <div className="checkout-layout">

        <div className="checkout-card">

          <p className="eyebrow">
            SECURE CHECKOUT
          </p>

          <h1>
            Almost there.
          </h1>

          <p className="checkout-subtitle">
            Enter your details to complete
            your order.
          </p>

          <form
            onSubmit={submitOrder}
          >

            <div className="form-row">

              <div className="form-field">
                <label>
                  Full Name
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                />

                {errors.name && (
                  <small>
                    {errors.name}
                  </small>
                )}
              </div>

              <div className="form-field">
                <label>
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                />

                {errors.email && (
                  <small>
                    {errors.email}
                  </small>
                )}
              </div>

            </div>

            <div className="form-field">
              <label>
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="10-digit mobile number"
              />

              {errors.phone && (
                <small>
                  {errors.phone}
                </small>
              )}
            </div>

            <div className="form-field">
              <label>
                Delivery Address
              </label>

              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="House / Flat, Street, City, State, PIN"
                rows="5"
              />

              {errors.address && (
                <small>
                  {errors.address}
                </small>
              )}
            </div>

            <button
              className="checkout-full"
              type="submit"
            >
              Place Order ·{" "}
              {money(cartTotal)}
            </button>

          </form>

        </div>

        <aside className="checkout-order">

          <h2>
            Your Order
          </h2>

          {cart.map((item) => (
            <div
              className="mini-product"
              key={item.id}
            >

              <img
                src={item.image}
                alt={item.name}
              />

              <div>
                <strong>
                  {item.name}
                </strong>

                <span>
                  Qty: {item.quantity}
                </span>
              </div>

              <b>
                {money(
                  item.price *
                    item.quantity
                )}
              </b>

            </div>
          ))}

          <hr />

          <div className="summary-total">
            <span>Total</span>

            <strong>
              {money(cartTotal)}
            </strong>
          </div>

          <div className="secure-note">
            🔒 Your information is protected
          </div>

        </aside>

      </div>

    </section>
  );
}

/* =========================================================
   APP
========================================================= */

function App() {
  const [wishlist, setWishlist] =
    useState(() => {
      return JSON.parse(
        localStorage.getItem(
          "shopease-wishlist"
        ) || "[]"
      );
    });

  useEffect(() => {
    localStorage.setItem(
      "shopease-wishlist",
      JSON.stringify(wishlist)
    );
  }, [wishlist]);

  const toggleWishlist = (id) => {
    setWishlist((current) =>
      current.includes(id)
        ? current.filter(
            (item) => item !== id
          )
        : [...current, id]
    );
  };

  return (
    <BrowserRouter>

      <CartProvider>

        <div className="app">

          <Navbar
            wishlistCount={
              wishlist.length
            }
          />

          <Routes>

            <Route
              path="/"
              element={
                <Home
                  wishlist={wishlist}
                  toggleWishlist={
                    toggleWishlist
                  }
                />
              }
            />

            <Route
              path="/product/:id"
              element={
                <ProductDetails
                  wishlist={wishlist}
                  toggleWishlist={
                    toggleWishlist
                  }
                />
              }
            />

            <Route
              path="/cart"
              element={<Cart />}
            />

            <Route
              path="/wishlist"
              element={
                <Wishlist
                  wishlist={wishlist}
                  toggleWishlist={
                    toggleWishlist
                  }
                />
              }
            />

            <Route
              path="/checkout"
              element={<Checkout />}
            />

          </Routes>

          <footer className="footer">

            <div className="footer-main">

              <div>
                <Link
                  to="/"
                  className="brand footer-brand"
                >
                  <span className="brand-mark">
                    S
                  </span>

                  <span>
                    Shop<span>Ease</span>
                  </span>
                </Link>

                <p>
                  Curated fashion for
                  <br />
                  everyday confidence.
                </p>
              </div>

              <div className="footer-column">

                <h4>SHOP</h4>

                <Link to="/">
                  New Arrivals
                </Link>

                <Link to="/">
                  Best Sellers
                </Link>

                <Link to="/wishlist">
                  Wishlist
                </Link>

              </div>

              <div className="footer-column">

                <h4>HELP</h4>

                <span>
                  Shipping
                </span>

                <span>
                  Returns
                </span>

                <span>
                  Contact
                </span>

              </div>

              <div className="footer-column">

                <h4>FOLLOW</h4>

                <span>
                  Instagram
                </span>

                <span>
                  Pinterest
                </span>

                <span>
                  Facebook
                </span>

              </div>

            </div>

            <div className="footer-bottom">
              <span>
                © 2026 ShopEase
              </span>

              <span>
                Made with care ✦
              </span>
            </div>

          </footer>

        </div>

      </CartProvider>

    </BrowserRouter>
  );
}

export default App;
