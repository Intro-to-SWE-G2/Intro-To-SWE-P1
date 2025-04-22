import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { useItemsAPI } from "../hooks/useItemsAPI"
import ItemGrid from "../components/ItemGrid"
import { Star } from "lucide-react"

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

  if (loading) return <div className="text-center py-10 text-gray-500">Loading item...</div>
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Images Carousel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {item.images.map((src, idx) => (
              <img key={idx} src={src} alt={`${item.name} ${idx + 1}`} className="w-full h-48 object-cover rounded" />
            ))}
          </div>

          {/* Product Info */}
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Product Info</h2>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">{item.name}</h1>
          <p className="text-sm text-gray-500 mb-4">
            {item.category} &bull; {item.condition}
          </p>
          <div className="flex items-baseline gap-4 mb-4">
            <p className="text-2xl font-bold text-blue-600">${item.price.toFixed(2)}</p>
            {item.originalPrice && (
              <p className="text-sm line-through text-gray-500">${item.originalPrice.toFixed(2)}</p>
            )}
          </div>
          <p className="text-gray-700 mb-4">{item.description}</p>
          <p className="text-sm text-gray-600">Listed on {item.listedDate} at {item.location}</p>

          {/* Seller Info */}
          <h2 className="text-xl font-semibold text-gray-700 my-6">Seller Info</h2>
          <div className="flex items-center gap-4">
            <img src={item.seller.avatar} alt={item.seller.username} className="w-16 h-16 rounded-full" />
            <div>
              <p className="font-medium text-gray-800">{item.seller.username}</p>
              <p className="text-sm text-gray-500">
                <Star className="inline-block h-4 w-4 text-yellow-500" /> {item.seller.rating} ({item.seller.reviewCount} reviews)
              </p>
              <p className="text-sm text-gray-500">Joined {item.seller.joinedDate}</p>
              <p className="text-sm text-gray-500">Response Rate: {item.seller.responseRate}</p>
              <p className="text-sm text-gray-500">Response Time: {item.seller.responseTime}</p>
            </div>
          </div>

          {/* Reviews */}
          <h2 className="text-xl font-semibold text-gray-700 my-6">Reviews</h2>
          {item.reviews.length ? (
            item.reviews.map((r) => (
              <div key={r.id} className="mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <img src={r.user.avatar} alt={r.user.name} className="w-6 h-6 rounded-full" />
                  <p className="text-sm font-medium text-gray-800">{r.user.name}</p>
                  <p className="text-xs text-gray-500">{r.date}</p>
                </div>
                <p className="text-sm text-yellow-500">
                  {Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="inline-block h-4 w-4" />)}
                </p>
                <p className="text-gray-700">{r.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No reviews yet.</p>
          )}

          {/* Related Items */}
          <h2 className="text-xl font-semibold text-gray-700 my-6">Related Items</h2>
          <ItemGrid items={item.relatedItems} emptyMessage="No related items" />
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default ItemPage
