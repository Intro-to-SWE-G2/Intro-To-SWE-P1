// File: src/pages/BrowsePage.jsx
import { useEffect, useState, useMemo } from "react"
import { FilterIcon } from "../icons/HomePageIcons"
import { sortOptions } from "../mocks/mockData"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import FiltersSidebar from "../components/FiltersSidebar"
import ItemGrid from "../components/ItemGrid"
import { useItemsAPI } from "../hooks/useItemsAPI"

const BrowsePage = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedCondition, setSelectedCondition] = useState("All")
  const [sortBy, setSortBy] = useState("newest")
  const [priceRange, setPriceRange] = useState({ min: 0, max: 200 })
  const [allItems, setAllItems] = useState([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { fetchItems } = useItemsAPI()

  useEffect(() => {
    const loadItems = async () => {
      try {
        const response = await fetchItems()
        const itemsArray = response.data || []  // extract array from response
        setAllItems(itemsArray)
      } catch (err) {
        console.error("Error fetching items:", err)
      } finally {
        setIsLoading(false)
      }
    }
    loadItems()
  }, [fetchItems])

  const filteredItems = useMemo(() => {
    let result = [...allItems]

    if (searchTerm) {
      result = result.filter(
        (item) =>
          item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory !== "All") {
      result = result.filter((item) => item.category === selectedCategory)
    }

    if (selectedCondition !== "All") {
      result = result.filter((item) => item.condition === selectedCondition)
    }

    result = result.filter(
      (item) => item.price >= priceRange.min && item.price <= priceRange.max
    )

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

    return result
  }, [searchTerm, selectedCategory, selectedCondition, sortBy, priceRange, allItems])

  const resetFilters = () => {
    setSearchTerm("")
    setSelectedCategory("All")
    setSelectedCondition("All")
    setSortBy("newest")
    setPriceRange({ min: 0, max: 200 })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <Navbar />
      </header>

      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800">Browse Items</h1>
          <p className="text-gray-600 mt-2">Find exactly what you need from our marketplace</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-700 font-medium"
            >
              <FilterIcon className="h-5 w-5" />
              {isFilterOpen ? "Hide Filters" : "Show Filters"}
            </button>
          </div>

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

          <div className="lg:w-3/4">
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

            {isLoading ? (
              <div className="text-center text-gray-500 py-6">Loading items...</div>
            ) : (
              <ItemGrid items={filteredItems} emptyMessage="No items found" />
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default BrowsePage