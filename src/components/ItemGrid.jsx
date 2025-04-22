import { useEffect, useState } from "react"
import ItemCard from "./ItemCard"
import { fetchItems } from "../api/items"

const ItemGrid = ({ items = null, query = null, emptyMessage = "No items found" }) => {
  const [loading, setLoading] = useState(!items)
  const [fetchedItems, setFetchedItems] = useState([])

  useEffect(() => {
    if (items) return // skip fetch if static list provided

    const load = async () => {
      setLoading(true)
      try {
        const data = await fetchItems()
        let filtered = data
        if (query === "featured") filtered = data.filter((i) => i.featured)
        else if (query === "recommended") filtered = data.filter((i) => i.recommended)
        setFetchedItems(filtered)
      } catch (err) {
        console.error("Error loading items:", err)
        setFetchedItems([])
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [items, query])

  const list = items || fetchedItems

  if (loading) return <div className="text-center text-gray-500 py-8">Loading items...</div>

  if (!list.length) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{emptyMessage}</h3>
        <p className="text-gray-600 mb-6">Try adjusting your filters to find what you're looking for.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {list.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  )
}

export default ItemGrid