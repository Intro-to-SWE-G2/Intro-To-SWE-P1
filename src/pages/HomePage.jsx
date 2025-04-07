import { useState } from "react"
import { SearchIcon, FilterIcon, StarIcon } from "../icons/HomePageIcons"
import { items as MOCK_ITEMS } from "../mocks/mockData"
import { categories as CATEGORIES } from "../mocks/mockData"
import Navbar from "./Navbar";

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  // Filter items based on search term and category
  const filteredItems = MOCK_ITEMS.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Get featured items
  const featuredItems = MOCK_ITEMS.filter((item) => item.featured)

  // Get recommended items
  const recommendedItems = MOCK_ITEMS.filter((item) => item.recommended)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <Navbar />
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Find What You Need, Sell What You Don't</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            The marketplace for students, by students. Buy and sell textbooks, electronics, dorm essentials, and more!
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search for items..."
                className="w-full px-4 py-3 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <SearchIcon className="absolute right-3 top-3 h-6 w-6 text-gray-400" />
            </div>
            <div className="relative">
              <select
                className="appearance-none bg-white text-gray-800 font-medium py-3 px-4 pr-8 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {CATEGORIES.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              <FilterIcon className="absolute right-3 top-3 h-5 w-5 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items */}
      {featuredItems.length > 0 && (
        <section className="py-10 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Featured Items</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredItems.map((item) => (
                <ItemCard key={item.id} item={item} featured={true} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Listings */}
      <section className="py-10 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">All Listings</h2>
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500 text-lg">No items found matching your search criteria.</p>
              <button
                className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("All")
                }}
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Recommended Items */}
      {recommendedItems.length > 0 && (
        <section className="py-10 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Recommended For You</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recommendedItems.slice(0, 4).map((item) => (
                <ItemCard key={item.id} item={item} recommended={true} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">CampusMarket</h3>
              <p className="text-gray-300">The trusted marketplace for students to buy and sell items on campus.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Browse Categories
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Sell an Item
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    My Account
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <p className="text-gray-300">Have questions or feedback? Reach out to our team.</p>
              <a href="mailto:support@campusmarket.com" className="text-blue-400 hover:text-blue-300 mt-2 inline-block">
                support@campusmarket.com
              </a>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} CampusMarket. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Item Card Component
const ItemCard = ({ item, featured = false, recommended = false }) => {
  return (
    <div
      className={`bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow ${featured ? "border-2 border-blue-500" : ""}`}
    >
      <div className="relative">
        <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-48 object-cover" />
        {featured && (
          <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
            Featured
          </div>
        )}
        {recommended && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded flex items-center">
            <StarIcon className="h-3 w-3 mr-1" />
            Recommended
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.title}</h3>
          <p className="font-bold text-blue-600">${item.price.toFixed(2)}</p>
        </div>
        <p className="text-sm text-gray-500 mb-2">
          {item.category} • {item.condition}
        </p>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-500">Posted by {item.seller}</p>
          <a href="/item" className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors">
            View Details
          </a>
        </div>
      </div>
    </div>
  )
}

export default HomePage

