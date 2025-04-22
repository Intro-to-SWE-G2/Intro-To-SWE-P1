import ItemCard from "./ItemCard"

const ItemGrid = ({ items = [], emptyMessage = "No items found", onDelete }) => {
  if (!items.length) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{emptyMessage}</h3>
        <p className="text-gray-600 mb-6">Try adjusting your filters to find what you're looking for.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item) => (
        <ItemCard key={item._id || item.id} item={item} onDelete={onDelete} />
      ))}
    </div>
  )
}

export default ItemGrid;
