// File: src/pages/HomePage.jsx
import { useEffect, useState } from "react"
import ItemGrid from "../components/ItemGrid"
import { useItemsAPI } from "../hooks/useItemsAPI"

const HomePage = () => {
  const { fetchItems } = useItemsAPI()
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetchItems()
        const itemsArray = response.data || []  // extract array from response
        const featuredItems = itemsArray.filter((i) => i.featured)
        setItems(featuredItems)
      } catch (err) {
        console.error("Error loading featured items:", err)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [fetchItems])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-10 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to CampusMarket</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Buy, sell, and discover great items within your student community. Sustainable shopping starts here.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Featured Listings</h2>
        {isLoading ? (
          <div className="text-center text-gray-500 py-6">Loading items...</div>
        ) : (
          <ItemGrid items={items} emptyMessage="No featured listings at the moment." />
        )}
      </div>
    </div>
  )
}

export default HomePage