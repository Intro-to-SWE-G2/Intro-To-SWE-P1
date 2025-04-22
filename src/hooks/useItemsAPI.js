// src/hooks/useItemsAPI.js
import { useAuth0 } from "@auth0/auth0-react"

export const useItemsAPI = () => {
  const { getAccessTokenSilently } = useAuth0()

  const fetchItems = async () => {
    const token = await getAccessTokenSilently()
    const res = await fetch("/api/items", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!res.ok) throw new Error("Failed to fetch items")
    return await res.json()
  }

  const fetchItemById = async (id) => {
    const token = await getAccessTokenSilently()
    const res = await fetch(`/api/items/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!res.ok) throw new Error("Failed to fetch item")
    return await res.json()
  }

  const createItem = async (itemData) => {
    const token = await getAccessTokenSilently()
    const formData = new FormData()

    Object.entries(itemData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => formData.append(`${key}`, v))
      } else {
        formData.append(key, value)
      }
    })

    const res = await fetch("/api/items", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message || "Failed to create item")
    }

    return await res.json()
  }

  return { fetchItems, fetchItemById, createItem }
}
