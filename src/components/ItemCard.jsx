import { Star } from "lucide-react"
import { Link } from "react-router-dom"
import { useAuth0 } from "@auth0/auth0-react"


const ItemCard = ({ item, featured = false, recommended = false, onDelete }) => {
  const { user } = useAuth0()

  const sellerId =
    item.seller?.id ||
    item.seller?._id ||
    (typeof item.seller === "string" ? item.seller : null)

  const isOwner = sellerId === user?.sub

  return (
    <div
      className={`bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow ${
        featured ? "border-2 border-blue-500" : ""
      }`}
    >
      <div className="relative">
        <img
          src={item.image || item.images?.[0] || "/placeholder.svg"}
          alt={item.name || item.title}
          className="w-full h-48 object-cover"
        />
        {featured && (
          <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
            Featured
          </div>
        )}
        {recommended && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded flex items-center">
            <Star className="h-3 w-3 mr-1" /> Recommended
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.name || item.title}</h3>
          <p className="font-bold text-blue-600">
            ${item.price.toFixed(2)}
          </p>
        </div>
        <p className="text-sm text-gray-500 mb-2">
          {item.category} • {item.condition}
        </p>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {item.description}
        </p>
        <div className="flex justify-between items-center">
          <Link 
            to={`/seller/${sellerId}`}
            className="text-xs text-gray-500 hover:text-blue-600"
          >
            Posted by {item.seller?.username || item.seller?.name || "Anonymous"}
          </Link>
          {isOwner && onDelete && (
            <button
              className="mt-2 text-sm text-red-600 hover:underline"
              onClick={() => onDelete(item._id)}
            >
              Delete
            </button>
          )}
          <Link
            to={`/item/${item.id || item._id}`}
            className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ItemCard
