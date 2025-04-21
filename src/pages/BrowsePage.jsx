import { useState, useEffect } from "react"
import { FilterIcon } from "../icons/HomePageIcons"
import { items, sortOptions } from "../mocks/mockData"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import FiltersSidebar from "../components/FiltersSidebar"
import ItemGrid from "../components/ItemGrid"

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
            <FiltersSidebar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedCondition={selectedCondition}
              setSelectedCondition={setSelectedCondition}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              resetFilters={resetFilters}
            />
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
            <ItemGrid
              items={filteredItems}
              emptyMessage="No items found"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default BrowsePage