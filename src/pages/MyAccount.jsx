// MyAccount.jsx
import { useEffect, useState } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import { Navigate } from "react-router-dom"
import { useItemsAPI } from "../hooks/useItemsAPI"
import ItemGrid from "../components/ItemGrid"
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"

const MyAccount = () => {
  const { isAuthenticated, user } = useAuth0()
  const { fetchItems } = useItemsAPI()
  const [myItems, setMyItems] = useState([])

  useEffect(() => {
    const loadUserItems = async () => {
      try {
        const allItems = await fetchItems()
        const userItems = allItems.filter((item) => item.userId === user.sub)
        setMyItems(userItems)
      } catch (err) {
        console.error("Error loading user's items:", err)
      }
    }
    if (isAuthenticated && user) loadUserItems()
  }, [isAuthenticated, user, fetchItems])

  if (!isAuthenticated) return <Navigate to="/" replace />

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-10">
        <div className="mb-10 text-center">
          <img
            src={user.picture}
            alt={user.name}
            className="w-24 h-24 rounded-full mx-auto border-4 border-blue-500"
          />
          <h1 className="text-3xl font-bold text-gray-800 mt-4">{user.name}</h1>
          <p className="text-gray-600">{user.email}</p>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">My Listings</h2>
        <ItemGrid items={myItems} emptyMessage="You haven’t listed anything yet." />
      </div>

      <Footer />
    </div>
  )
}

export default MyAccount
