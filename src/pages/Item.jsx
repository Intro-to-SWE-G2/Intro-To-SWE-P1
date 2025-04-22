// Item.jsx
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { useItemsAPI } from "../hooks/useItemsAPI"

const ItemPage = () => {
  const { id } = useParams()
  const { fetchItemById } = useItemsAPI()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadItem = async () => {
      try {
        const data = await fetchItemById(id)
        setItem(data)
      } catch (err) {
        setError("Item not found")
      } finally {
        setLoading(false)
      }
    }
    loadItem()
  }, [id, fetchItemById])

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Loading item...</div>
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Product Info</h2>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">{item.name}</h1>
          <p className="text-sm text-gray-500 mb-4">
            {item.category} • {item.condition} • ${item.price.toFixed(2)}
          </p>
          <p className="text-gray-700 mb-6">{item.description}</p>

          <h2 className="text-xl font-semibold text-gray-700 mb-2 mt-8">Seller Info</h2>
          <div className="text-sm text-gray-600 mb-4">
            Posted by: {item.seller?.username || "Unknown"}
          </div>

          <h2 className="text-xl font-semibold text-gray-700 mb-2 mt-8">Reviews</h2>
          <p className="text-sm text-gray-500 mb-4">(Ratings and reviews coming soon)</p>

          <h2 className="text-xl font-semibold text-gray-700 mb-2 mt-8">Related Items</h2>
          <p className="text-sm text-gray-500">(You might also like...)</p>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default ItemPage
