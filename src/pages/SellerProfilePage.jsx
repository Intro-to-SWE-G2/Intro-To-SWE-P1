import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Star, Calendar, ArrowLeft, Mail } from "lucide-react";
import ItemGrid from "../components/ItemGrid";
import { format } from "date-fns";
import { useEnsureUserCreated } from "../hooks/useEnsureUserCreated";

const SellerProfilePage = () => {
  // Use the hook to ensure user is created in the database
  useEnsureUserCreated();
  
  const { sellerId } = useParams();
  const decodedSellerId = decodeURIComponent(sellerId); // Decode the URL-encoded ID
  
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [seller, setSeller] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        setLoading(true);
        console.log("🔍 Fetching data for seller with Auth0 ID:", decodedSellerId);
        
        // Fetch seller profile using decoded Auth0 ID
        const profileResponse = await fetch(`/api/users/${decodedSellerId}`);
        if (!profileResponse.ok) {
          const errorData = await profileResponse.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed to fetch seller profile: ${profileResponse.status}`);
        }
        const profileData = await profileResponse.json();
        console.log("✅ Seller profile:", profileData);
        setSeller(profileData);
        
        // Fetch seller's items using decoded Auth0 ID
        const itemsResponse = await fetch(`/api/users/${decodedSellerId}/items`);
        if (!itemsResponse.ok) {
          const errorData = await itemsResponse.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed to fetch seller items: ${itemsResponse.status}`);
        }
        const itemsData = await itemsResponse.json();
        console.log(`✅ Seller items (${itemsData.length}):`, itemsData);
        setItems(itemsData);
        
      } catch (err) {
        console.error("❌ Error fetching seller data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSellerData();
  }, [decodedSellerId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Loading seller profile...</h2>
        </div>
      </div>
    );
  }

  if (error || !seller) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error loading seller profile</h2>
          <p className="text-gray-600 mb-6">{error || "Seller not found"}</p>
          <Link to="/" className="text-blue-600 hover:underline">
            Return to homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center text-blue-600 hover:underline">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to listings
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center">
            {/* Seller Avatar */}
            <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center mr-6 mb-4 md:mb-0">
              {seller.avatar ? (
                <img
                  src={seller.avatar}
                  alt={seller.name}
                  className="h-24 w-24 rounded-full object-cover"
                />
              ) : (
                <span className="text-gray-500 text-2xl">{seller.name?.charAt(0) || "?"}</span>
              )}
            </div>

            {/* Seller Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{seller.name}</h1>
              <div className="flex items-center mb-2">
                <Star className="h-5 w-5 text-yellow-500 mr-1" />
                <span className="text-gray-700">
                  {seller.overallRating?.toFixed(1) || "No ratings yet"} 
                  {seller.reviewCount ? ` (${seller.reviewCount} reviews)` : ""}
                </span>
              </div>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Username:</span> {seller.username}
              </p>
              {seller.joinedDate && (
                <p className="text-gray-600 mb-2">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Member since {format(new Date(seller.joinedDate), "MMMM yyyy")}
                </p>
              )}
              {seller.responseRate && (
                <p className="text-gray-600 mb-2">
                  <span className="font-medium">Response rate:</span> {seller.responseRate}
                </p>
              )}
              {seller.responseTime && (
                <p className="text-gray-600">
                  <span className="font-medium">Response time:</span> {seller.responseTime}
                </p>
              )}
            </div>

            {/* Contact Button */}
            <div className="mt-4 md:mt-0">
              <Link
                to={`/messages?seller=${decodedSellerId}`}
                className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                <Mail className="h-5 w-5 mr-2" />
                Contact Seller
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Seller's Items */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Items for Sale</h2>
        {items.length > 0 ? (
          <ItemGrid items={items} />
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">This seller doesn't have any items listed right now.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerProfilePage; 