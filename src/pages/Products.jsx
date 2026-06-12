import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getCategories, getProducts } from '../services/api';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      setError('');
      try {
        const data = await getProducts({
          category: category || undefined,
          search: search || undefined,
        });
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [category, search]);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set('search', value);
    } else {
      next.delete('search');
    }
    setSearchParams(next);
  };

  const handleCategoryChange = (slug) => {
    const next = new URLSearchParams(searchParams);
    if (slug) {
      next.set('category', slug);
    } else {
      next.delete('category');
    }
    setSearchParams(next);
  };

  return (
    <div className="container section">
      <div className="section-header">
        <h1>Shop</h1>
        <p>Browse our collection of pots, equipment, and flowers.</p>
      </div>

      <div className="filters">
        <input
          type="search"
          placeholder="Search products..."
          value={search}
          onChange={handleSearchChange}
          className="search-input"
        />

        <div className="category-filters">
          <button
            type="button"
            className={`filter-chip ${!category ? 'active' : ''}`}
            onClick={() => handleCategoryChange('')}
          >
            All
          </button>
          {categories.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`filter-chip ${category === item.slug ? 'active' : ''}`}
              onClick={() => handleCategoryChange(item.slug)}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      {loading && <p className="status-message">Loading products...</p>}
      {error && <p className="status-message error">{error}</p>}

      {!loading && !error && products.length === 0 && (
        <p className="status-message">No products found.</p>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
