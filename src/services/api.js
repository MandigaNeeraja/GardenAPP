const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5134/api';
const TOKEN_KEY = 'gardening-store-token';

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Request failed (${response.status})`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function getCategories() {
  return request('/categories');
}

export function getProducts(params = {}) {
  const searchParams = new URLSearchParams();
  if (params.category) searchParams.set('category', params.category);
  if (params.search) searchParams.set('search', params.search);
  const query = searchParams.toString();
  return request(`/products${query ? `?${query}` : ''}`);
}

export function getProduct(id) {
  return request(`/products/${id}`);
}

export function createOrder(orderData) {
  return request('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
}

export function getOrder(id) {
  return request(`/orders/${id}`);
}

export function getMyOrders() {
  return request('/orders/my');
}

export function cancelOrder(id) {
  return request(`/orders/${id}/cancel`, { method: 'POST' });
}

export function register(data) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function login(data) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function getMe() {
  return request('/auth/me');
}

export function updateProfile(data) {
  return request('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function getWishlist() {
  return request('/wishlist');
}

export function addToWishlist(productId) {
  return request(`/wishlist/${productId}`, { method: 'POST' });
}

export function removeFromWishlist(productId) {
  return request(`/wishlist/${productId}`, { method: 'DELETE' });
}

export function getSellerProducts() {
  return request('/seller/products');
}

export function createSellerProduct(data) {
  return request('/seller/products', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateSellerProduct(id, data) {
  return request(`/seller/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteSellerProduct(id) {
  return request(`/seller/products/${id}`, { method: 'DELETE' });
}

export function getSellerOrders() {
  return request('/seller/orders');
}

export function updateSellerOrderItemStatus(orderId, itemId, status) {
  return request(`/seller/orders/${orderId}/items/${itemId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}
