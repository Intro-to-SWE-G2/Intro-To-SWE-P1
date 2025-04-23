// Navbar.jsx
import React, { useState } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import { Link } from "react-router-dom"
import { Menu, X, MessageSquare } from "lucide-react"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isAuthenticated, isLoading, loginWithRedirect, logout, user } = useAuth0()

  if (isLoading) return null

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-blue-600">CampusMarket</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-gray-700 hover:text-blue-600">
              Home
            </Link>
            <Link to="/browse" className="text-gray-700 hover:text-blue-600">
              Browse
            </Link>
            <Link to="/sell" className="text-gray-700 hover:text-blue-600">
              Sell an Item
            </Link>
            {isAuthenticated && (
              <Link to="/messages" className="text-gray-700 hover:text-blue-600 flex items-center">
                <MessageSquare className="h-5 w-5 mr-1" />
                Messages
              </Link>
            )}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center text-gray-700 hover:text-blue-600">
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                    {user?.picture ? (
                      <img
                        src={user.picture}
                        alt={user.name}
                        className="h-8 w-8 rounded-full"
                      />
                    ) : (
                      <span>{user?.name?.charAt(0) || "U"}</span>
                    )}
                  </div>
                  <span>{user?.name || "User"}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                  <button
                    onClick={() => logout({ returnTo: window.location.origin })}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => loginWithRedirect()}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 hover:text-blue-600 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-3 border-t border-gray-200">
            <Link
              to="/"
              className="block py-2 px-4 text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/browse"
              className="block py-2 px-4 text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Browse
            </Link>
            <Link
              to="/sell"
              className="block py-2 px-4 text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Sell an Item
            </Link>
            {isAuthenticated && (
              <Link
                to="/messages"
                className="block py-2 px-4 text-gray-700 hover:bg-gray-100 flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <MessageSquare className="h-5 w-5 mr-2" />
                Messages
              </Link>
            )}
            {isAuthenticated ? (
              <button
                onClick={() => {
                  setIsMenuOpen(false)
                  logout({ returnTo: window.location.origin })
                }}
                className="block w-full text-left py-2 px-4 text-gray-700 hover:bg-gray-100"
              >
                Sign Out ({user?.name})
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsMenuOpen(false)
                  loginWithRedirect()
                }}
                className="block w-full text-left py-2 px-4 text-blue-600 hover:bg-gray-100"
              >
                Sign In
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
