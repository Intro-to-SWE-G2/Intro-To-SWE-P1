// Navbar.jsx
import React from "react"
import { useAuth0 } from "@auth0/auth0-react"
import { Link } from "react-router-dom"

const Navbar = () => {
  const { isAuthenticated, isLoading, loginWithRedirect, logout } = useAuth0()

  if (isLoading) return null

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600">CampusMarket</Link>
        </div>

        {/* Main Nav Links */}
        <nav className="hidden md:flex space-x-6">
          <Link to="/home" className="text-gray-700 hover:text-blue-600 font-medium">
            Home
          </Link>
          <Link to="/browse" className="text-gray-700 hover:text-blue-600 font-medium">
            Browse
          </Link>
          <Link to="/account" className="text-gray-700 hover:text-blue-600 font-medium">
            My Account
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          <Link
            to="/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            List an Item
          </Link>

          {isAuthenticated ? (
            <button
              onClick={() => logout({ returnTo: window.location.origin })}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-medium"
            >
              Log Out
            </button>
          ) : (
            <>
              <button
                onClick={() => loginWithRedirect({ screen_hint: "signup" })}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-medium"
              >
                Sign Up
              </button>
              <button
                onClick={() => loginWithRedirect()}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium ml-2"
              >
                Log In
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
