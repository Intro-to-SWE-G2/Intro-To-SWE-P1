import { useState } from "react"
import { Link, Navigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { categories as CATEGORIES } from "../mocks/mockData"
import { useAuth0 } from "@auth0/auth0-react"
import { useItemsAPI } from "../hooks/useItemsAPI"

export default function NewListing() {
  const { isAuthenticated, user } = useAuth0()
  const { createItem } = useItemsAPI()

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "",
    condition: "used",
    location: "",
    images: []
  })
  const [errors, setErrors] = useState({})
  const [previewImages, setPreviewImages] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  if (!isAuthenticated) return <Navigate to="/" replace />

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }))
  }

  const handleImageChange = e => {
    const files = Array.from(e.target.files)
    if (files.length > 5) {
      setErrors(prev => ({ ...prev, images: "Maximum 5 images allowed" }))
      return
    }
    setPreviewImages(files.map(f => URL.createObjectURL(f)))
    setFormData(prev => ({ ...prev, images: files }))
    if (errors.images) setErrors(prev => ({ ...prev, images: null }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = "Title is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0)
      newErrors.price = "Valid price is required"
    if (!formData.originalPrice || isNaN(formData.originalPrice) || Number(formData.originalPrice) <= 0)
      newErrors.originalPrice = "Valid original price is required"
    if (!formData.category) newErrors.category = "Category is required"
    if (!formData.location.trim()) newErrors.location = "Location is required"
    if (formData.images.length === 0) newErrors.images = "At least one image required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!validateForm()) return
    setIsSubmitting(true)
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: parseFloat(formData.originalPrice),
        images: ["/placeholder.svg?height=600&width=600"],
        sellerId: user.sub,
        userEmail: user.email,
        userName: user.name
      }
      const response = await createItem(payload)
      if (response.success) {
        setSuccess(true)
        setFormData({ name: "", description: "", price: "", originalPrice: "", category: "", condition: "used", location: "", images: [] })
        setPreviewImages([])
      }
    } catch (err) {
      setErrors(prev => ({ ...prev, submit: "Failed to create listing" }))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link to="/home" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to listings
      </Link>
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6">Create New Listing</h1>

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            <p className="font-medium">Your item has been listed!</p>
            <button onClick={() => setSuccess(false)} className="mt-2 text-blue-600 hover:underline">
              List another item
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Description *</label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${errors.description ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Prices & Location */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Price ($) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${errors.price ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Original Price ($) *</label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${errors.originalPrice ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.originalPrice && <p className="text-red-500 text-sm mt-1">{errors.originalPrice}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location *</label>
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${errors.location ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
            </div>
          </div>

          {/* Category & Condition */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${errors.category ? 'border-red-500' : 'border-gray-300'}`}>
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Condition *</label>
              <div className="flex gap-4">
                {["new","like-new","good","fair","used"].map(cond => (
                  <label key={cond} className="inline-flex items-center">
                    <input
                      type="radio"
                      name="condition"
                      value={cond}
                      checked={formData.condition===cond}
                      onChange={handleChange}
                      className="form-radio h-4 w-4 text-blue-600" />
                    <span className="ml-2 capitalize">{cond.replace("-"," ")}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-1">Images *</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}
            {previewImages.length>0 && (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {previewImages.map((src,i)=>(
                  <img key={i} src={src} alt={`preview ${i}`} className="h-24 w-full object-cover rounded" />
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          {errors.submit && <p className="text-red-500 text-sm">{errors.submit}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 ${isSubmitting?"opacity-70":""}`}
          >
            {isSubmitting?"Creating...":"Create Listing"}
          </button>
        </form>
      </div>
    </div>
  )
}
