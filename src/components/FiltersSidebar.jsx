import { SearchIcon } from "../icons/HomePageIcons"
import { categories, conditions } from "../mocks/mockData"

const FiltersSidebar = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedCondition,
  setSelectedCondition,
  priceRange,
  setPriceRange,
  resetFilters
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Search */}
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

      {/* Category */}
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

      {/* Condition */}
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

      {/* Price Range */}
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
  )
}

export default FiltersSidebar
