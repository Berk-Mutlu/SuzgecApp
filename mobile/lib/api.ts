import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const API_URL = 'https://suzgecbackend.vercel.app/v1';

// ─── In-Memory API Cache ───
const cache = new Map<string, { data: any; timestamp: number }>();

function getCached(key: string, ttlMs: number): any | null {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < ttlMs) return entry.data;
  cache.delete(key);
  return null;
}

function setCache(key: string, data: any) {
  cache.set(key, { data, timestamp: Date.now() });
}

function invalidateCache(prefix: string) {
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) cache.delete(key);
  }
}

const TTL = {
  LISTS: 30_000,
  NOTIFICATIONS: 60_000,
  PRODUCT: 120_000,
  SEARCH_HISTORY: 60_000,
};

// Token storage helpers
async function getToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync('token');
  } catch {
    return null;
  }
}

export async function setToken(token: string) {
  await SecureStore.setItemAsync('token', token);
}

export async function removeToken() {
  await SecureStore.deleteItemAsync('token');
}

export async function getUser(): Promise<any | null> {
  try {
    const raw = await SecureStore.getItemAsync('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function setUser(user: any) {
  await SecureStore.setItemAsync('user', JSON.stringify(user));
}

export async function removeUser() {
  await SecureStore.deleteItemAsync('user');
}

async function getHeaders() {
  const token = await getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const api = {
  async login(credentials: { email: string; password: string }) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (data.success && data.token) {
      await setToken(data.token);
      await setUser(data);
    }
    return data;
  },

  async register(info: any) {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify(info),
    });
    return res.json();
  },

  async getUserProfile(userId: string) {
    const res = await fetch(`${API_URL}/users/${userId}`, { headers: await getHeaders() });
    return res.json();
  },

  async updateUserProfile(userId: string, data: any) {
    const res = await fetch(`${API_URL}/users/${userId}`, {
      method: 'PUT',
      headers: await getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteUserProfile(userId: string) {
    const res = await fetch(`${API_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: await getHeaders(),
    });
    return res.status === 204 ? { success: true } : res.json();
  },

  async searchProducts(query: string = '', limit?: number, page?: number) {
    const token = await getToken();
    const endpoint = token ? `${API_URL}/products/search` : `${API_URL}/products/search/public`;
    let url = `${endpoint}?q=${encodeURIComponent(query)}`;
    if (limit) url += `&limit=${limit}`;
    if (page) url += `&page=${page}`;
    const res = await fetch(url, { headers: await getHeaders() });
    return res.json();
  },

  async getSearchHistory() {
    const cached = getCached('searchHistory', TTL.SEARCH_HISTORY);
    if (cached) return cached;
    const res = await fetch(`${API_URL}/users/history/searches`, { headers: await getHeaders() });
    const data = await res.json();
    setCache('searchHistory', data);
    return data;
  },

  async getProduct(id: string) {
    const cacheKey = `product:${id}`;
    const cached = getCached(cacheKey, TTL.PRODUCT);
    if (cached) return cached;
    const res = await fetch(`${API_URL}/products/${id}`);
    const data = await res.json();
    setCache(cacheKey, data);
    return data;
  },

  async getProductSellers(id: string) {
    const res = await fetch(`${API_URL}/products/${id}/sellers`);
    return res.json();
  },

  async resolveAdUrl(id: string, clickUrl: string, siteName?: string) {
    const res = await fetch(`${API_URL}/products/${id}/resolve-url`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify({ url: clickUrl, productId: id, siteName }),
    });
    return res.json();
  },

  async getLists() {
    const cached = getCached('lists', TTL.LISTS);
    if (cached) return cached;
    const res = await fetch(`${API_URL}/lists`, { headers: await getHeaders() });
    const data = await res.json();
    setCache('lists', data);
    return data;
  },

  async getListById(id: string) {
    const cacheKey = `list:${id}`;
    const cached = getCached(cacheKey, TTL.LISTS);
    if (cached) return cached;
    const res = await fetch(`${API_URL}/lists/${id}`, { headers: await getHeaders() });
    const data = await res.json();
    setCache(cacheKey, data);
    return data;
  },

  async getNotifications() {
    const cached = getCached('notifications', TTL.NOTIFICATIONS);
    if (cached) return cached;
    const res = await fetch(`${API_URL}/notifications`, { headers: await getHeaders() });
    const data = await res.json();
    setCache('notifications', data);
    return data;
  },

  async markNotificationRead(id: string) {
    invalidateCache('notifications');
    const res = await fetch(`${API_URL}/notifications/${id}/read`, {
      method: 'PUT',
      headers: await getHeaders(),
    });
    return res.json();
  },

  async deleteNotification(id: string) {
    invalidateCache('notifications');
    const res = await fetch(`${API_URL}/notifications/${id}`, {
      method: 'DELETE',
      headers: await getHeaders(),
    });
    return res.status === 204 ? { success: true } : res.json();
  },

  async getStockAlerts() {
    const res = await fetch(`${API_URL}/stock-alerts`, { headers: await getHeaders() });
    return res.json();
  },

  async getPriceAlerts() {
    const res = await fetch(`${API_URL}/price-alerts`, { headers: await getHeaders() });
    return res.json();
  },

  async addPriceAlert(data: { productId: string; targetPrice: number }) {
    const res = await fetch(`${API_URL}/price-alerts`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updatePriceAlert(id: string, data: { targetPrice?: number; enabled?: boolean }) {
    const res = await fetch(`${API_URL}/price-alerts/${id}`, {
      method: 'PUT',
      headers: await getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deletePriceAlert(id: string) {
    const res = await fetch(`${API_URL}/price-alerts/${id}`, {
      method: 'DELETE',
      headers: await getHeaders(),
    });
    return res.status === 204 ? { success: true } : res.json();
  },

  async addStockAlert(data: { productId: string }) {
    const res = await fetch(`${API_URL}/stock-alerts`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteStockAlert(id: string) {
    const res = await fetch(`${API_URL}/stock-alerts/${id}`, {
      method: 'DELETE',
      headers: await getHeaders(),
    });
    return res.status === 204 ? { success: true } : res.json();
  },

  async addProductToList(listId: string, productId: string) {
    invalidateCache('lists');
    invalidateCache('list:');
    const res = await fetch(`${API_URL}/lists/${listId}/items`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify({ productId }),
    });
    return res.json();
  },

  async removeProductFromList(listId: string, productId: string) {
    invalidateCache('lists');
    invalidateCache('list:');
    const res = await fetch(`${API_URL}/lists/${listId}/items/${productId}`, {
      method: 'DELETE',
      headers: await getHeaders(),
    });
    return res.status === 204 ? { success: true } : res.json();
  },

  async createList(name: string, color?: string, icon?: string) {
    invalidateCache('lists');
    const res = await fetch(`${API_URL}/lists`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify({ name, color, icon }),
    });
    return res.json();
  },

  async deleteList(id: string) {
    invalidateCache('lists');
    invalidateCache('list:');
    const res = await fetch(`${API_URL}/lists/${id}`, {
      method: 'DELETE',
      headers: await getHeaders(),
    });
    return res.status === 204 ? { success: true } : res.json();
  },

  async updateList(id: string, name: string, color?: string, icon?: string) {
    invalidateCache('lists');
    invalidateCache('list:');
    const res = await fetch(`${API_URL}/lists/${id}`, {
      method: 'PUT',
      headers: await getHeaders(),
      body: JSON.stringify({ name, color, icon }),
    });
    return res.json();
  },

  async getComparison() {
    const res = await fetch(`${API_URL}/comparisons`, { headers: await getHeaders() });
    return res.json();
  },

  async addToComparison(productId: string) {
    const res = await fetch(`${API_URL}/comparisons/items`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify({ productId }),
    });
    return res.json();
  },

  async removeFromComparison(productId: string) {
    const res = await fetch(`${API_URL}/comparisons/items/${productId}`, {
      method: 'DELETE',
      headers: await getHeaders(),
    });
    return res.json();
  },

  async getProductReviews(productId: string) {
    try {
      const res = await fetch(`${API_URL}/reviews/${productId}`, { headers: await getHeaders() });
      if (!res.ok) return { success: false, data: [] };
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.indexOf('application/json') !== -1) {
        return await res.json();
      }
      return { success: false, data: [] };
    } catch {
      return { success: false, data: [] };
    }
  },

  async addReview(productId: string, rating: number, comment: string) {
    try {
      const res = await fetch(`${API_URL}/reviews/${productId}`, {
        method: 'POST',
        headers: await getHeaders(),
        body: JSON.stringify({ rating, comment }),
      });
      if (!res.ok) return { success: false, message: 'Sunucu hatası veya desteklenmiyor.' };
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.indexOf('application/json') !== -1) {
        return await res.json();
      }
      return { success: false, message: 'Geçersiz yanıt formatı' };
    } catch {
      return { success: false, message: 'Bağlantı hatası' };
    }
  },

  async deleteReview(reviewId: string) {
    try {
      const res = await fetch(`${API_URL}/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: await getHeaders(),
      });
      return res.status === 204 ? { success: true } : await res.json().catch(() => ({ success: false }));
    } catch {
      return { success: false };
    }
  },

  async aiCompareProducts(products: any[]) {
    try {
      const res = await fetch(`${API_URL}/ai/compare`, {
        method: 'POST',
        headers: await getHeaders(),
        body: JSON.stringify({ products }),
      });
      return await res.json();
    } catch {
      return { success: false, error: 'Yapay zeka servisiyle iletişim kurulamadı.' };
    }
  },
};
