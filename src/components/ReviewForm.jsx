import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Star } from "lucide-react";
import { useEnsureUserCreated } from "../hooks/useEnsureUserCreated";

const ReviewForm = ({ itemId, onReviewAdded }) => {
  // Use the hook to ensure user is created in the database
  useEnsureUserCreated();
  
  const { isAuthenticated, loginWithRedirect, getAccessTokenSilently } = useAuth0();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      loginWithRedirect({
        appState: { returnTo: window.location.pathname }
      });
      return;
    }
    
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      console.log("🔍 Submitting review for item:", itemId);
      const token = await getAccessTokenSilently();
      
      const response = await fetch(`/api/items/${itemId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          rating,
          comment
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit review");
      }
      
      const updatedReviews = await response.json();
      console.log("✅ Review submitted successfully");
      
      // Reset form
      setRating(0);
      setComment("");
      
      // Notify parent component
      if (onReviewAdded) {
        onReviewAdded(updatedReviews);
      }
      
    } catch (err) {
      console.error("❌ Error submitting review:", err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <p className="text-gray-700 mb-3">Please sign in to leave a review</p>
        <button
          onClick={() => loginWithRedirect({
            appState: { returnTo: window.location.pathname }
          })}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Write a Review</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Rating</label>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-6 w-6 cursor-pointer ${
                  star <= (hoveredRating || rating)
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-gray-300"
                }`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
              />
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="comment" className="block text-gray-700 mb-2">
            Comment (optional)
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            placeholder="Share your thoughts about this item..."
          ></textarea>
        </div>
        
        {error && (
          <div className="mb-4 text-red-600">{error}</div>
        )}
        
        <button
          type="submit"
          disabled={isSubmitting || rating === 0}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm; 