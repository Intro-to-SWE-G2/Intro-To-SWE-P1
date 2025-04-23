import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export const useEnsureUserCreated = () => {
  const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();

  useEffect(() => {
    const createUser = async () => {
      if (!isAuthenticated || !user) return;

      try {
        console.log("🔍 Ensuring user is created in database");
        const token = await getAccessTokenSilently();

        const response = await fetch("/api/users/profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: user.name,
            username: user.nickname || user.email?.split("@")[0] || "user",
            email: user.email,
            avatar: user.picture,
          }),
        });

        if (response.ok) {
          console.log("✅ User profile ensured in database");
        } else {
          console.error("❌ Failed to ensure user profile");
        }
      } catch (err) {
        console.error("❌ Error ensuring user profile:", err);
      }
    };

    createUser();
  }, [isAuthenticated, getAccessTokenSilently, user]);
};
