import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const MessagesPage = () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!isAuthenticated) return;

      try {
        const token = await getAccessTokenSilently();
        const response = await fetch("/api/messages/conversations", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch conversations");
        }

        const data = await response.json();
        setConversations(data);
      } catch (err) {
        console.error("Error fetching conversations:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [isAuthenticated, getAccessTokenSilently]);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Please log in to view your messages
          </h2>
          <p className="text-gray-600 mb-6">
            You need to be logged in to access your messages.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Loading conversations...</h2>
        </div>
      </div>
    );
  }

  // Helper function to safely get unread count
  const getUnreadCount = (conversation, userId) => {
    if (!conversation.unreadCount) return 0;
    
    // Handle if unreadCount is a Map object
    if (typeof conversation.unreadCount.get === 'function') {
      return conversation.unreadCount.get(userId) || 0;
    }
    
    // Handle if unreadCount is a plain object (from JSON)
    if (typeof conversation.unreadCount === 'object') {
      return conversation.unreadCount[userId] || 0;
    }
    
    return 0;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Messages</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}

      {conversations.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">No conversations yet</h2>
          <p className="text-gray-600">
            When you message a seller or someone messages you, your conversations will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {conversations.map((conversation) => {
              const otherUser = conversation.participants[0];
              const lastMessage = conversation.lastMessage;
              const unreadCount = getUnreadCount(conversation, conversation.participants[1]?._id);
              
              return (
                <li key={conversation._id} className="hover:bg-gray-50">
                  <Link
                    to={`/messages/${conversation._id}`}
                    className="block p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                          {otherUser?.avatar ? (
                            <img
                              src={otherUser.avatar}
                              alt={otherUser.username}
                              className="h-10 w-10 rounded-full"
                            />
                          ) : (
                            <span className="text-gray-500 text-sm">
                              {otherUser?.username?.charAt(0) || "?"}
                            </span>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">
                            {otherUser?.username || "Unknown User"}
                          </h3>
                          {conversation.item && (
                            <p className="text-xs text-gray-500">
                              Re: {conversation.item.title || conversation.item.name}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {lastMessage?.createdAt && (
                          <span>
                            {formatDistanceToNow(new Date(lastMessage.createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between">
                      <div className="text-sm text-gray-600 max-w-md truncate">
                        {lastMessage ? (
                          <p className={unreadCount > 0 ? "font-semibold" : ""}>
                            {lastMessage.content}
                          </p>
                        ) : (
                          <p className="text-gray-400 italic">No messages yet</p>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <div className="ml-2 flex-shrink-0">
                          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-600 text-white text-xs">
                            {unreadCount}
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MessagesPage; 