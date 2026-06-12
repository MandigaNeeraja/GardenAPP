import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getCategories, getProducts } from '../services/api';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [categoryData, productData] = await Promise.all([
          getCategories(),
          getProducts(),
        ]);
        setCategories(categoryData);
        setFeatured(productData.slice(0, 4));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return <p className="status-message">Loading store...</p>;
  }

  if (error) {
    return <p className="status-message error">{error}</p>;
  }

  return (
    <div>
      <section className="hero">
        <div className="container hero-content">
          <p className="eyebrow">Welcome to GreenThumb Garden</p>
          <h1>Everything you need to grow something beautiful</h1>
          <p>
            Shop pots, gardening tools, and seasonal flowers for your home,
            balcony, or backyard.
          </p>
          <Link to="/products" className="btn btn-primary">
            Browse all products
          </Link>
        </div>
      </section>

      <section className="container section">
        <div className="section-header">
          <h2>Shop by category</h2>
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/products?category=${category.slug}`}
              className="category-card"
            >
              <h3>{category.name}</h3>
              <span>Explore</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="section-header">
          <h2>Featured products</h2>
          <Link to="/products" className="text-link">
            View all
          </Link>
        </div>
        <div className="product-grid">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
