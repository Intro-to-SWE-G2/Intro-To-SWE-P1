// HomePage.jsx
import { useState } from "react"
import { SearchIcon, FilterIcon } from "../icons/HomePageIcons"
import { categories as CATEGORIES } from "../mocks/mockData"
import Navbar from "../components/Navbar"
import ItemGrid from "../components/ItemGrid"
import Footer from "../components/Footer"

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

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
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Featured Items</h2>
          <ItemGrid query="featured" />
        </div>
      </section>

      {/* Recommended Items */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Recommended For You</h2>
          <ItemGrid query="recommended" />
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default HomePage
