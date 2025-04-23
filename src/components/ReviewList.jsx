import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Star, Trash2 } from "lucide-react";
import { format } from "date-fns";

const ReviewList = ({ reviews, itemId, onReviewDeleted }) => {
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  const handleDeleteReview = async (reviewId) => {
    if (!isAuthenticated) return;
    
    setIsDeleting(true);
    setError(null);
    
    try {
      console.log("🔍 Deleting review:", reviewId);
      const token = await getAccessTokenSilently();
      
      const response = await fetch(`/api/items/${itemId}/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete review");
      }
      
      console.log("✅ Review deleted successfully");
      
      // Notify parent component
      if (onReviewDeleted) {
        onReviewDeleted(reviewId);
      }
      
    } catch (err) {
      console.error("❌ Error deleting review:", err);
      setError(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!reviews || reviews.length === 0) {
    return <p className="text-gray-600 italic">No reviews yet. Be the first to review!</p>;
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md mb-4">
          {error}
        </div>
      )}
      
      {reviews.map((review) => (
        <div key={review._id} className="border-b border-gray-200 pb-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                {review.user?.avatar ? (
                  <img
                    src={review.user.avatar}
                    alt={review.user?.username || "User"}
                    className="h-10 w-10 rounded-full"
                  />
                ) : (
                  <span className="text-gray-500 text-sm">
                    {(review.user?.username || "U")?.charAt(0)}
                  </span>
                )}
              </div>
              <div>
                <p className="font-medium text-gray-800">
                  {review.user?.username || review.user?.name || "Anonymous User"}
                </p>
                <div className="flex items-center">
                  <div className="flex mr-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    {review.createdAt && format(new Date(review.createdAt), "MMM d, yyyy")}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Delete button - only show for the review author */}
            {isAuthenticated && user?.sub === review.user?._id && (
              <button
                onClick={() => handleDeleteReview(review._id)}
                disabled={isDeleting}
                className="text-gray-500 hover:text-red-600"
                aria-label="Delete review"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            )}
          </div>
          
          {review.comment && (
            <p className="mt-2 text-gray-700">{review.comment}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReviewList; 