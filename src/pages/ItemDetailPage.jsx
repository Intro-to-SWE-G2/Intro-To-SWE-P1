import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Star, MapPin, Calendar, ArrowLeft } from "lucide-react";
import MessageSeller from "../components/MessageSeller";
import ReviewForm from "../components/ReviewForm";
import ReviewList from "../components/ReviewList";
import { useEnsureUserCreated } from "../hooks/useEnsureUserCreated";

const ItemDetailPage = () => {
  // Use the hook to ensure user is created in the database
  useEnsureUserCreated();
  
  const { id } = useParams();
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  
  // Fetch item details
  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        console.log("🔍 Fetching item details for ID:", id);
        
        const response = await fetch(`/api/items/${id}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch item");
        }
        
        const data = await response.json();
        console.log("✅ Item details:", data);
        console.log("🔍 Seller info:", data.seller);
        
        setItem(data);
        setReviews(data.reviews || []);
        
      } catch (err) {
        console.error("❌ Error fetching item:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchItem();
  }, [id]);
  
  // Handle adding a review
  const handleReviewAdded = (updatedReviews) => {
    setReviews(updatedReviews);
    // Also update the item's average rating
    if (updatedReviews.length > 0) {
      const totalRating = updatedReviews.reduce((sum, review) => sum + review.rating, 0);
      const newAverageRating = totalRating / updatedReviews.length;
      setItem(prev => ({ ...prev, averageRating: newAverageRating }));
    }
  };
  
  // Handle deleting a review
  const handleReviewDeleted = async (reviewId) => {
    try {
      // Remove the review from the UI immediately
      const updatedReviews = reviews.filter(review => review._id !== reviewId);
      setReviews(updatedReviews);
      
      // Update the average rating
      if (updatedReviews.length > 0) {
        const totalRating = updatedReviews.reduce((sum, review) => sum + review.rating, 0);
        const newAverageRating = totalRating / updatedReviews.length;
        setItem(prev => ({ ...prev, averageRating: newAverageRating }));
      } else {
        setItem(prev => ({ ...prev, averageRating: 0 }));
      }
      
    } catch (err) {
      console.error("Error handling review deletion:", err);
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Loading item...</h2>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error loading item</h2>
          <p className="text-gray-600 mb-6">{error || "Item not found"}</p>
        </div>
      </div>
    );
  }

  // Get seller ID (handle different formats)
  const sellerId = item.seller?.id || item.seller?._id || 
    (typeof item.seller === 'string' ? item.seller : null);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <a href="/" className="inline-flex items-center text-blue-600 hover:underline">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to listings
        </a>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          {/* Image Gallery */}
          <div className="md:w-1/2 p-4">
            <div className="bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={item.images[0] || "/placeholder.svg"}
                alt={item.name}
                className="w-full h-96 object-contain"
              />
            </div>
            {item.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mt-2">
                {item.images.map((image, index) => (
                  <div key={index} className="bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={image}
                      alt={`${item.name} ${index + 1}`}
                      className="w-full h-20 object-cover cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Item Details */}
          <div className="md:w-1/2 p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{item.title || item.name}</h1>
            <div className="flex items-center mb-4">
              <p className="text-2xl font-bold text-blue-600 mr-3">${item.price.toFixed(2)}</p>
              {item.originalPrice && (
                <p className="text-gray-500 line-through">${item.originalPrice.toFixed(2)}</p>
              )}
            </div>

            <div className="flex items-center text-gray-600 text-sm mb-2">
              <MapPin className="h-4 w-4 mr-1" />
              {item.location || "Location not specified"}
            </div>

            <div className="flex items-center text-gray-600 text-sm mb-4">
              <Calendar className="h-4 w-4 mr-1" />
              Listed on {item.listedDate || "Unknown date"}
            </div>

            <div className="border-t border-gray-200 my-4 pt-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Description</h2>
              <p className="text-gray-600 mb-6 whitespace-pre-line">{item.description}</p>
            </div>

            {/* Seller Info */}
            <div className="border-t border-gray-200 my-4 pt-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Seller Information</h2>
              {sellerId ? (
                <div className="flex items-center mb-4">
                  <Link to={`/seller/${encodeURIComponent(sellerId)}`} className="flex items-center hover:text-blue-600">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                      {item.seller?.avatar ? (
                        <img
                          src={item.seller.avatar}
                          alt={item.seller?.username || "Seller"}
                          className="h-10 w-10 rounded-full"
                        />
                      ) : (
                        <span className="text-gray-500 text-sm">
                          {(item.seller?.username || "S")?.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {item.seller?.username || item.seller?.name || "Unknown Seller"}
                      </p>
                      {item.seller?.rating && (
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-sm text-gray-600">
                            {item.seller.rating} ({item.seller.reviewCount || 0} reviews)
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                </div>
              ) : (
                <div className="mb-4 text-gray-600">
                  <p>Seller information not available</p>
                </div>
              )}

              {/* Message Seller Button - only show if seller ID exists */}
              {sellerId && (
                <MessageSeller 
                  itemId={item.id || item._id} 
                  sellerId={sellerId} 
                  sellerName={item.seller?.username || item.seller?.name || "Seller"} 
                />
              )}
            </div>

            {/* Reviews Section */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Reviews</h2>
              
              <ReviewForm 
                itemId={id} 
                onReviewAdded={handleReviewAdded} 
              />
              
              <ReviewList 
                reviews={reviews} 
                itemId={id} 
                onReviewDeleted={handleReviewDeleted} 
              />
            </div>
          </div>
        </div>

        {/* Related Items */}
        {item.relatedItems && item.relatedItems.length > 0 && (
          <div className="p-6 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Related Items</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {item.relatedItems.map((relItem) => (
                <Link
                  key={relItem.id}
                  to={`/item/${relItem.id}`}
                  className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="h-40 bg-gray-200">
                    <img
                      src={relItem.image || "/placeholder.svg"}
                      alt={relItem.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="text-gray-800 font-medium truncate">{relItem.name}</h3>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-blue-600 font-semibold">${relItem.price.toFixed(2)}</span>
                      <span className="text-xs text-gray-500">{relItem.condition}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemDetailPage; 