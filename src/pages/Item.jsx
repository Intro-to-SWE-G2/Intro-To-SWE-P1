import { useState } from "react"
import { ChevronLeft, ChevronRight, MessageCircle, Star, MapPin, Calendar, ArrowLeft } from "lucide-react"
import { mockItem } from "../mocks/mockData"

export default function ItemPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === mockItem.images.length - 1 ? 0 : prevIndex + 1))
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? mockItem.images.length - 1 : prevIndex - 1))
  }

  const selectImage = (index) => {
    setCurrentImageIndex(index)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back button */}
      <a href="/home" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to listings
      </a>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={mockItem.images[currentImageIndex] || "/placeholder.svg"}
              alt={mockItem.title}
              className="object-cover w-full h-full"
            />

            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="flex space-x-2 overflow-x-auto pb-2">
            {mockItem.images.map((image, index) => (
              <button
                key={index}
                onClick={() => selectImage(index)}
                className={`relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0 border-2 ${
                  index === currentImageIndex ? "border-blue-500" : "border-transparent"
                }`}
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`Product thumbnail ${index + 1}`}
                  className="object-cover w-full h-full"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{mockItem.title}</h1>
            <div className="mt-2 flex items-center">
              <span className="text-2xl font-bold text-blue-600">${mockItem.price.toFixed(2)}</span>
              {mockItem.originalPrice && (
                <span className="ml-2 text-sm text-gray-500 line-through">${mockItem.originalPrice.toFixed(2)}</span>
              )}
              <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                {Math.round((1 - mockItem.price / mockItem.originalPrice) * 100)}% off
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-1" />
              {mockItem.location}
            </div>
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-1" />
              Listed {new Date(mockItem.listedDate).toLocaleDateString()}
            </div>
            <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">{mockItem.condition}</div>
          </div>

          <div className="border-t border-b py-4">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-gray-700">{mockItem.description}</p>
          </div>

          {/* Seller Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-start">
              <div className="relative h-12 w-12 rounded-full overflow-hidden mr-3">
                <img
                  src={mockItem.seller.avatar || "/placeholder.svg"}
                  alt={mockItem.seller.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{mockItem.seller.name}</h3>
                <div className="flex items-center mt-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(mockItem.seller.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-1 text-sm text-gray-600">
                    {mockItem.seller.rating} ({mockItem.seller.reviewCount} reviews)
                  </span>
                </div>
                <div className="text-sm text-gray-600 mt-1">Member since {mockItem.seller.joinedDate}</div>
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-colors">
                <MessageCircle className="h-5 w-5 mr-2" />
                Message Seller
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-6">Reviews</h2>

        <div className="space-y-6">
          {mockItem.reviews.map((review) => (
            <div key={review.id} className="border-b pb-6">
              <div className="flex items-start">
                <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3">
                  <img
                    src={review.user.avatar || "/placeholder.svg"}
                    alt={review.user.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="font-medium">{review.user.name}</h3>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-sm text-gray-600">{new Date(review.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex mt-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Related Items */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-6">You might also like</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mockItem.relatedItems.map((item) => (
            <a href={`/item/${item.id}`} key={item.id} className="group">
              <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative aspect-square">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <div className="mt-1 flex justify-between items-center">
                    <span className="font-bold text-blue-600">${item.price.toFixed(2)}</span>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">{item.condition}</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
