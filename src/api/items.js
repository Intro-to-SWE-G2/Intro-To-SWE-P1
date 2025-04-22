const API_BASE = '/api/items'

export const fetchItems = async () => {
  const res = await fetch(API_BASE)
  if (!res.ok) throw new Error('Failed to fetch items')
  return await res.json()
}

export const fetchItemById = async (id) => {
  const res = await fetch(`${API_BASE}/${id}`)
  if (!res.ok) throw new Error('Failed to fetch item')
  return await res.json()
}

export const createItem = async (itemData) => {
  const formData = new FormData()

  Object.entries(itemData).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => formData.append(`${key}`, v))
    } else {
      formData.append(key, value)
    }
  })

  const res = await fetch(API_BASE, {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'Failed to create item')
  }

  return await res.json()
}