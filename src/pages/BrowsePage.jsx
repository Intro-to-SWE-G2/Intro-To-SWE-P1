import { useState, useEffect } from "react"
import { SearchIcon, FilterIcon, StarIcon } from "../icons/HomePageIcons"
import { items, categories, conditions, sortOptions } from "../mocks/mockData"
import Navbar from "./Navbar";

const BrowsePage = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedCondition, setSelectedCondition] = useState("All")
  const [sortBy, setSortBy] = useState("newest")
  const [priceRange, setPriceRange] = useState({ min: 0, max: 200 })
  const [filteredItems, setFilteredItems] = useState(items)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Apply filters and sorting
  useEffect(() => {
    let result = [...items]

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply category filter
    if (selectedCategory !== "All") {
      result = result.filter((item) => item.category === selectedCategory)
    }

    // Apply condition filter
    if (selectedCondition !== "All") {
      result = result.filter((item) => item.condition === selectedCondition)
    }

    // Apply price range filter
    result = result.filter(
      (item) => item.price >= priceRange.min && item.price <= priceRange.max
    )

    // Apply sorting
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate))
        break
      case "oldest":
        result.sort((a, b) => new Date(a.postedDate) - new Date(b.postedDate))
        break
      case "priceLow":
        result.sort((a, b) => a.price - b.price)
        break
      case "priceHigh":
        result.sort((a, b) => b.price - a.price)
        break
      default:
        break
    }

    setFilteredItems(result)
  }, [searchTerm, selectedCategory, selectedCondition, sortBy, priceRange])

  const resetFilters = () => {
    setSearchTerm("")
    setSelectedCategory("All")
    setSelectedCondition("All")
    setSortBy("newest")
    setPriceRange({ min: 0, max: 200 })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <Navbar />
      </header>

      {/* Browse Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800">Browse Items</h1>
          <p className="text-gray-600 mt-2">Find exactly what you need from our marketplace</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters - Mobile Toggle */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-700 font-medium"
            >
              <FilterIcon className="h-5 w-5" />
              {isFilterOpen ? "Hide Filters" : "Show Filters"}
            </button>
          </div>

          {/* Filters Sidebar */}
          <div className={`${isFilterOpen ? 'block' : 'hidden'} lg:block lg:w-1/4`}>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Search</h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search items..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <SearchIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Category</h3>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="All">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Condition</h3>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                  value={selectedCondition}
                  onChange={(e) => setSelectedCondition(e.target.value)}
                >
                  {conditions.map((condition) => (
                    <option key={condition} value={condition}>
                      {condition}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Price Range</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-gray-600">$</span>
                  <input
                    type="number"
                    min="0"
                    max={priceRange.max}
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                  <span className="text-gray-600">to</span>
                  <span className="text-gray-600">$</span>
                  <input
                    type="number"
                    min={priceRange.min}
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>$0</span>
                  <span>$100</span>
                  <span>$200+</span>
                </div>
              </div>

              <button
                onClick={resetFilters}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Items Grid */}
          <div className="lg:w-3/4">
            {/* Sort Controls */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex flex-col sm:flex-row justify-between items-center">
              <p className="text-gray-600 mb-3 sm:mb-0">
                <span className="font-medium">{filteredItems.length}</span> items found
              </p>
              <div className="flex items-center gap-2">
                <label htmlFor="sort" className="text-gray-600 whitespace-nowrap">
                  Sort by:
                </label>
                <select
                  id="sort"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Items Grid */}
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No items found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters to find what you're looking for.</p>
                <button
                  onClick={resetFilters}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
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
                  <a href="/" className="text-gray-300 hover:text-white">
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
const ItemCard = ({ item }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className="relative">
        <img 
          src={item.image || "/placeholder.svg?height=200&width=300"} 
          alt={item.title} 
          className="w-full h-48 object-cover"
        />
        {item.featured && (
          <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
            Featured
          </div>
        )}
        {item.recommended && (
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
          <a 
            href={`/item`} 
            className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors"
          >
            View Details
          </a>
        </div>
      </div>
    </div>
  )
}

export default BrowsePage