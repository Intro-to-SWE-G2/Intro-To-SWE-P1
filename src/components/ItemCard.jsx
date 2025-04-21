import { Star } from "lucide-react"

const ItemCard = ({ item, featured = false, recommended = false }) => {
  return (
    <div
      className={`bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow ${featured ? "border-2 border-blue-500" : ""}`}
    >
      <div className="relative">
        <img
          src={item.image || "/placeholder.svg"}
          alt={item.title}
          className="w-full h-48 object-cover"
        />
        {featured && (
          <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
            Featured
          </div>
        )}
        {recommended && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded flex items-center">
            <Star className="h-3 w-3 mr-1" />
            Recommended
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.title}</h3>
          <p className="font-bold text-blue-600">${item.price.toFixed(2)}</p>
        </div>
        <p className="text-sm text-gray-500 mb-2">
          {item.category} • {item.condition}
        </p>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-500">Posted by {item.seller}</p>
          <a
            href={`/item/${item.id}`}
            className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors"
          >
            View Details
          </a>
        </div>
      </div>
    </div>
  )
}

export default ItemCard
