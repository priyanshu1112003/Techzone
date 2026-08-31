"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Check, ChevronDown, Minus, Plus, Search, ShoppingBag, Sparkles, Trash2, Zap } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Toaster } from "@/components/ui/sonner";

type Product = { id: number; name: string; category: string; price: number; description: string; image: string; badge?: string };
type CartItem = Product & { quantity: number };

const products: Product[] = [
  { id: 1, name: "iPhone 15 Pro", category: "Phones", price: 1199, description: "Titanium design. Pro camera system.", image: "https://m.media-amazon.com/images/I/81dT7CUY6GL._AC_UF1000,1000_QL80_.jpg", badge: "Best seller" },
  { id: 2, name: "MacBook Pro M2", category: "Laptops", price: 1999, description: "Pro power in a beautifully portable build.", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlSZkKntjhyrrhQlIsHG2-KCUSfMXa6pPtxw&s", badge: "Creator pick" },
  { id: 3, name: "PlayStation 5", category: "Gaming", price: 499, description: "Lightning-fast gaming, reimagined.", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtmLcFtGB9ghKbp7FSvcKA14YuWSH9lJAxQQ&s" },
  { id: 4, name: "Xbox Series X", category: "Gaming", price: 499, description: "True 4K gaming with next-gen speed.", image: "https://m.media-amazon.com/images/I/61JGKhqxHxL._SL1500_.jpg" },
  { id: 5, name: "Noise Cancelling Headphones", category: "Audio", price: 199, description: "Immersive sound. Distraction-free listening.", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTM3jfMlaQCkgV-C5Yk4c9lnvN9e4sv1TEnbg&s" },
  { id: 6, name: "Fast Charging Adapter", category: "Accessories", price: 29, description: "Compact, reliable everyday charging.", image: "https://ambraneindia.com/cdn/shop/files/ACCGZ6Q2VWVUHGC2_1_jpg.webp?v=1712208811&width=1000" },
  { id: 7, name: "Samsung Galaxy S24", category: "Phones", price: 899, description: "Galaxy AI meets an iconic camera.", image: "https://m.media-amazon.com/images/I/81cHpJNr07L._AC_SL1500_.jpg", badge: "New" },
  { id: 8, name: "20000mAh Power Bank", category: "Accessories", price: 49, description: "More power for longer journeys.", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrG2ZANgnrF8LrvlP9R8DmRk4zfheU60OxeA&s" },
  { id: 9, name: "Nintendo Switch", category: "Gaming", price: 299, description: "Play at home or take the fun anywhere.", image: "https://m.media-amazon.com/images/I/61-PblYntsL._AC_SL1500_.jpg" },
];

const categories = ["All", "Phones", "Laptops", "Audio", "Gaming", "Accessories"];
const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export default function Home() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = products.filter((product) =>
      (category === "All" || product.category === category) &&
      (product.name.toLowerCase().includes(query) || product.category.toLowerCase().includes(query))
    );
    if (sort === "price-low") return [...filtered].sort((a, b) => a.price - b.price);
    if (sort === "price-high") return [...filtered].sort((a, b) => b.price - a.price);
    return filtered;
  }, [category, search, sort]);

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const addToCart = (product: Product) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      return existing
        ? current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...current, { ...product, quantity: 1 }];
    });
    toast.success(`${product.name} added to your cart`);
  };

  const updateQuantity = (id: number, change: number) => {
    setCart((current) => current.map((item) => item.id === id ? { ...item, quantity: item.quantity + change } : item).filter((item) => item.quantity > 0));
  };

  const checkout = () => {
    if (!cart.length) return;
    const methodLabel = paymentMethod === "cod" ? "Cash on delivery" : paymentMethod === "upi" ? "UPI" : "Card";
    setCart([]);
    setCartOpen(false);
    toast.success(`Order placed with ${methodLabel}`, { description: "This is a demo checkout—no payment was charged." });
  };

  return (
    <main>
      <Toaster position="top-center" richColors />
      <header className="site-header">
        <a href="#top" className="brand" aria-label="TechZone home">TECH<span>ZONE</span><i /></a>
        <nav className="desktop-nav" aria-label="Main navigation"><a href="#top">Home</a><a href="#products">Products</a><a href="#about">About</a></nav>
        <Sheet open={cartOpen} onOpenChange={setCartOpen}>
          <SheetTrigger asChild>
            <Button className="cart-trigger" aria-label={`Open cart with ${itemCount} items`}><ShoppingBag /><span className="cart-label">Cart</span><b>{itemCount}</b></Button>
          </SheetTrigger>
          <SheetContent className="cart-sheet">
            <SheetHeader className="cart-sheet-header">
              <SheetTitle>Your cart</SheetTitle>
              <SheetDescription>{itemCount ? `${itemCount} item${itemCount === 1 ? "" : "s"} ready to go.` : "Your next upgrade starts here."}</SheetDescription>
            </SheetHeader>
            <div className="cart-content">
              {!cart.length ? (
                <div className="empty-cart"><div><ShoppingBag /></div><h3>Your cart is empty</h3><p>Add something futuristic. We&apos;ll keep it safe here.</p><Button onClick={() => setCartOpen(false)}>Browse products</Button></div>
              ) : cart.map((item) => (
                <article className="cart-item" key={item.id}>
                  <img src={item.image} alt="" />
                  <div className="cart-item-copy"><h3>{item.name}</h3><p>{money.format(item.price)}</p><div className="quantity-control" aria-label={`Quantity for ${item.name}`}><button onClick={() => updateQuantity(item.id, -1)} aria-label="Decrease quantity"><Minus /></button><span>{item.quantity}</span><button onClick={() => updateQuantity(item.id, 1)} aria-label="Increase quantity"><Plus /></button></div></div>
                  <button className="remove-item" onClick={() => setCart((current) => current.filter((product) => product.id !== item.id))} aria-label={`Remove ${item.name}`}><Trash2 /></button>
                </article>
              ))}
            </div>
            {!!cart.length && (
              <SheetFooter className="cart-footer">
                <div className="subtotal"><span>Subtotal</span><strong>{money.format(subtotal)}</strong></div><p>Taxes and shipping calculated at checkout.</p>
                <div className="payment-methods" role="group" aria-label="Payment method">
                  {[["card", "Card"], ["upi", "UPI"], ["cod", "Cash"]].map(([value, label]) => <button key={value} className={paymentMethod === value ? "active" : ""} onClick={() => setPaymentMethod(value)}>{paymentMethod === value && <Check />} {label}</button>)}
                </div>
                <Button className="checkout-button" onClick={checkout}>Place demo order <ArrowRight /></Button>
              </SheetFooter>
            )}
          </SheetContent>
        </Sheet>
      </header>

      <section className="hero" id="top">
        <div className="hero-grid" /><div className="orb orb-one" /><div className="orb orb-two" />
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles /> Curated tech. Zero noise.</div>
          <h1>THE FUTURE<br /><span>LOOKS GOOD</span><br />ON YOU.</h1>
          <p>Flagship devices, gaming powerhouses and everyday essentials—carefully selected in one electric storefront.</p>
          <a href="#products" className="hero-cta">Explore the drop <ArrowRight /></a>
        </div>
        <div className="hero-feature" aria-label="Featured product">
          <span className="feature-index">01 / FEATURED</span><div className="hero-product-glow" /><img src={products[0].image} alt="iPhone 15 Pro" />
          <div className="feature-meta"><div><span>Phone</span><h2>iPhone 15 Pro</h2></div><strong>{money.format(products[0].price)}</strong></div>
          <button onClick={() => addToCart(products[0])}>Quick add <Plus /></button>
        </div>
        <div className="hero-stat stat-one"><Zap /><span><b>09</b> curated products</span></div>
        <div className="hero-stat stat-two"><span>Smart picks<br /><b>Fast checkout</b></span><ChevronDown /></div>
      </section>

      <section className="store-section" id="products">
        <div className="section-heading"><div><p className="section-kicker">THE EDIT / 2026</p><h2>Find your next<br />favourite device.</h2></div><p>Search the collection, narrow it down by category, and add products directly to your cart.</p></div>
        <div className="store-toolbar">
          <label className="search-box"><Search /><span className="sr-only">Search products</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products..." />{search && <button onClick={() => setSearch("")} aria-label="Clear search">×</button>}</label>
          <div className="category-tabs" role="group" aria-label="Product categories">{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={category === item ? "active" : ""}>{item}</button>)}</div>
          <Select value={sort} onValueChange={setSort}><SelectTrigger className="sort-select" aria-label="Sort products"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="featured">Featured</SelectItem><SelectItem value="price-low">Price: low to high</SelectItem><SelectItem value="price-high">Price: high to low</SelectItem></SelectContent></Select>
        </div>
        <div className="results-row"><span>{visibleProducts.length.toString().padStart(2, "0")} products</span>{(category !== "All" || search) && <button onClick={() => { setCategory("All"); setSearch(""); }}>Reset filters</button>}</div>
        {visibleProducts.length ? (
          <div className="product-grid">{visibleProducts.map((product, index) => (
            <article className="product-card" key={product.id}>
              <div className="product-image-wrap"><span className="product-number">{String(index + 1).padStart(2, "0")}</span>{product.badge && <span className="product-badge">{product.badge}</span>}<img src={product.image} alt={product.name} loading="lazy" /><button className="quick-add" onClick={() => addToCart(product)} aria-label={`Add ${product.name} to cart`}><Plus /> Add to cart</button></div>
              <div className="product-copy"><p>{product.category}</p><div><h3>{product.name}</h3><strong>{money.format(product.price)}</strong></div><span>{product.description}</span></div>
            </article>
          ))}</div>
        ) : <div className="empty-results"><Search /><h3>No products found</h3><p>Try a different search or reset the filters.</p><Button onClick={() => { setSearch(""); setCategory("All"); }}>Show all products</Button></div>}
      </section>

      <footer id="about"><div className="footer-brand">TECH<span>ZONE</span><i /></div><p>A sharper, faster way to discover the tech you actually want.</p><div className="footer-links"><a href="https://www.linkedin.com/in/priyanshu-rajput-49508532a" target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="https://www.instagram.com/_px.iyanshu_" target="_blank" rel="noreferrer">Instagram ↗</a></div><div className="footer-bottom"><span>© 2026 TechZone</span><span>Demo storefront · No real payments</span></div></footer>
    </main>
  );
}
