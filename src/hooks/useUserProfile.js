import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export const useUserProfile = () => {
  const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const token = await getAccessTokenSilently();

        // First, try to get the user from our API
        const response = await fetch(`/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        } else {
          // If that fails, use the Auth0 profile
          setProfile({
            _id: user.sub,
            name: user.name,
            username: user.nickname || user.email?.split("@")[0] || "user",
            email: user.email,
            avatar: user.picture,
          });
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [isAuthenticated, getAccessTokenSilently, user]);

  return { profile, loading, error };
};
