// src/hooks/useItemsAPI.js
import { useAuth0 } from '@auth0/auth0-react';

const API_BASE = process.env.REACT_APP_API_BASE_URL || '';
const AUDIENCE = process.env.REACT_APP_AUTH0_AUDIENCE;  // e.g. https://campusmarket.example.com

export function useItemsAPI() {
  const { getAccessTokenSilently } = useAuth0();

  // Public endpoints
  const fetchItems = async (page = 1, limit = 10) => {
    const res = await fetch(`${API_BASE}/api/items?page=${page}&limit=${limit}`);
    if (!res.ok) throw new Error('Failed to fetch items');
    return await res.json();  // { data, page, totalPages, totalCount }
  };

  const fetchItemById = async (id) => {
    const res = await fetch(`${API_BASE}/api/items/${id}`);
    if (!res.ok) throw new Error('Failed to fetch item');
    return await res.json();
  };

  // Protected endpoints
  const createItem = async (itemData) => {
    const token = await getAccessTokenSilently({
      authorizationParams: { audience: AUDIENCE }
    });

    //testing
    const [, payloadBase64] = token.split('.');
    const payloadJson     = atob(payloadBase64);
    const payload         = JSON.parse(payloadJson);
    console.log('Decoded JWT audience:', payload.aud);

    const res = await fetch(`${API_BASE}/api/items-secure`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(itemData),
    });
    if (!res.ok) throw new Error('Failed to create item');
    return await res.json();
  };

  const rateItem = async (itemId, rating) => {
    const token = await getAccessTokenSilently({
      authorizationParams: { audience: AUDIENCE }
    });
    const res = await fetch(`${API_BASE}/api/items-secure/${itemId}/rate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ rating }),
    });
    if (!res.ok) throw new Error('Failed to rate item');
    return await res.json();
  };

  const addReview = async (itemId, reviewData) => {
    const token = await getAccessTokenSilently({
      authorizationParams: { audience: AUDIENCE }
    });
    const res = await fetch(`${API_BASE}/api/items-secure/${itemId}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reviewData),
    });
    if (!res.ok) throw new Error('Failed to add review');
    return await res.json();
  };

  const fetchItemsBySeller = async (sellerId) => {
    const token = await getAccessTokenSilently({ authorizationParams: { audience: AUDIENCE } });

    const res = await fetch(`${API_BASE}/api/items-secure/seller/${sellerId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Failed to fetch seller items");
    return res.json();
  };

  const deleteItem = async (itemId) => {
    const token = await getAccessTokenSilently({ authorizationParams: { audience: AUDIENCE } });

    const res = await fetch(`${API_BASE}/api/items-secure/${itemId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Failed to delete item");
    return res.json();
  };

  return {
    fetchItems,
    fetchItemById,
    createItem,
    rateItem,
    addReview,
    fetchItemsBySeller,
    deleteItem
  };
}
