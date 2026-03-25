import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getProductById,
  addProduct,
  updateProduct
} from '../services/productService';
import { getAllCategories } from '../services/categoryService';
import LoadingSpinner from '../components/LoadingSpinner';
import { uploadImageToS3 } from "../utils/s3Upload";

// Firebase imports
import { db } from "../firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  
  // New state for design, shape, materials
  const [designs, setDesigns] = useState([]);
  const [shapes, setShapes] = useState([]);
  const [materials, setMaterials] = useState([]);

  // Multiple images state
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const [formData, setFormData] = useState({
    productId: '',   // New field for product ID
    name: '',
    price: '',
    offerPrice: '',
    category: '',
    subCategory: '',
    design: '',     
    shape: '',      
    material: '',   
    description: '',
    images: [],     
    stock: 0,       // New field for stock quantity
    popular: false,
    features: [],
    specifications: {},
    searchKeywords: [] 
  });

  // Function to generate search keywords from product data
  const generateSearchKeywords = (data) => {
    const keywords = [];
    
    // Add product name (split into words)
    if (data.name) {
      const nameWords = data.name.toLowerCase().split(' ');
      keywords.push(...nameWords);
      keywords.push(data.name.toLowerCase());
    }
    
    // Add productId
    if (data.productId) {
      keywords.push(data.productId.toLowerCase());
    }
    
    // Add category
    if (data.category) {
      keywords.push(data.category.toLowerCase());
    }
    
    // Add subcategory
    if (data.subCategory) {
      keywords.push(data.subCategory.toLowerCase());
    }
    
    // Add design
    if (data.design) {
      keywords.push(data.design.toLowerCase());
    }
    
    // Add shape
    if (data.shape) {
      keywords.push(data.shape.toLowerCase());
    }
    
    // Add material
    if (data.material) {
      keywords.push(data.material.toLowerCase());
    }
    
    // Add description (split into words)
    if (data.description) {
      const descWords = data.description.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(' ')
        .filter(word => word.length > 2);
      keywords.push(...descWords);
    }
    
    // Add price as keyword
    if (data.price) {
      keywords.push(`price-${data.price}`);
      keywords.push(`rs-${data.price}`);
    }
    
    // Add stock status as keyword
    if (data.stock !== undefined) {
      if (data.stock > 0) {
        keywords.push('in-stock');
        keywords.push('available');
      } else {
        keywords.push('out-of-stock');
        keywords.push('sold-out');
      }
    }
    
    // Remove duplicates and empty strings
    const uniqueKeywords = [...new Set(keywords)].filter(k => k && k.trim() !== '');
    
    return uniqueKeywords;
  };

  const loadProduct = useCallback(async () => {
    setLoading(true);
    const data = await getProductById(id);
    if (data) {
      setFormData(data);
      setImagePreviews(data.images || []);
    }
    setLoading(false);
  }, [id]);

  const loadCategories = async () => {
    const data = await getAllCategories();
    setCategories(data);
  };

  // Fetch subcategories based on category
  const fetchSubcategories = async (categoryName) => {
    try {
      const q = query(
        collection(db, "subcategories"),
        where("categoryName", "==", categoryName)
      );

      const snapshot = await getDocs(q);
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setSubcategories(list);
    } catch (error) {
      console.log("Error fetching subcategories:", error);
    }
  };

  // Fetch designs
  const fetchDesigns = async () => {
    try {
      const snapshot = await getDocs(collection(db, "design"));
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDesigns(list);
    } catch (error) {
      console.log("Error fetching designs:", error);
    }
  };

  // Fetch shapes
  const fetchShapes = async () => {
    try {
      const snapshot = await getDocs(collection(db, "shapes"));
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setShapes(list);
    } catch (error) {
      console.log("Error fetching shapes:", error);
    }
  };

  // Fetch materials
  const fetchMaterials = async () => {
    try {
      const snapshot = await getDocs(collection(db, "materials"));
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMaterials(list);
    } catch (error) {
      console.log("Error fetching materials:", error);
    }
  };

  useEffect(() => {
    loadCategories();
    fetchDesigns();
    fetchShapes();
    fetchMaterials();

    if (id) {
      loadProduct();
    }
  }, [id, loadProduct]);

  // When category changes, fetch subcategories
  useEffect(() => {
    if (formData.category) {
      fetchSubcategories(formData.category);
    }
  }, [formData.category]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Reset subcategory when category changes
    if (name === "category") {
      setFormData(prev => ({
        ...prev,
        category: value,
        subCategory: ''
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle multiple image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // Add new files to existing files
    setImageFiles(prev => [...prev, ...files]);

    // Create previews for new files
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove image from preview and files
  const handleRemoveImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalFormData = { ...formData };
      let uploadedImages = [];

      // Upload new images to S3
      if (imageFiles.length > 0) {
        for (const file of imageFiles) {
          const imageUrl = await uploadImageToS3(file);
          uploadedImages.push(imageUrl);
        }
      }

      // Combine existing images (from previews that are URLs, not data URLs)
      const existingImages = imagePreviews.filter(preview => 
        preview.startsWith('http')
      );

      // Set final images array
      finalFormData.images = [...existingImages, ...uploadedImages];

      // Generate search keywords automatically
      finalFormData.searchKeywords = generateSearchKeywords(finalFormData);

      // Add timestamps
      const timestamp = new Date().toISOString();
      if (id) {
        finalFormData.updatedAt = timestamp;
        await updateProduct(id, finalFormData);
      } else {
        finalFormData.createdAt = timestamp;
        finalFormData.updatedAt = timestamp;
        await addProduct(finalFormData);
      }

      navigate('/products');

    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="product-form-container">
      <style>{`
        .product-form-container {
          max-width: 1000px;
          margin: 40px auto;
          padding: 20px;
          font-family: 'Inter', sans-serif;
        }
        .form-card {
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.05);
          padding: 40px;
        }
        .form-title {
          font-size: 24px;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 30px;
          border-bottom: 2px solid #edf2f7;
          padding-bottom: 10px;
        }
        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        .form-group {
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
        }
        .full-width { 
          grid-column: span 2; 
        }
        .form-group label {
          font-size: 14px;
          font-weight: 600;
          color: #4a5568;
          margin-bottom: 8px;
        }
        .form-group input, 
        .form-group select, 
        .form-group textarea {
          padding: 12px;
          border: 1.5px solid #e2e8f0;
          border-radius: 8px;
          font-size: 15px;
          transition: border-color 0.2s;
        }
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #3182ce;
        }
        .image-upload-section {
          background: #f7fafc;
          border: 2px dashed #cbd5e0;
          border-radius: 10px;
          padding: 20px;
          text-align: center;
          margin-bottom: 20px;
        }
        .image-preview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 15px;
          margin-top: 20px;
        }
        .image-preview-item {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          border: 2px solid #e2e8f0;
        }
        .image-preview-img {
          width: 100%;
          height: 150px;
          object-fit: cover;
        }
        .remove-image-btn {
          position: absolute;
          top: 5px;
          right: 5px;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 18px;
          transition: background 0.2s;
        }
        .remove-image-btn:hover {
          background: #dc2626;
        }
        .image-count {
          font-size: 14px;
          color: #718096;
          margin-top: 8px;
        }
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 15px;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #edf2f7;
        }
        .btn-cancel {
          padding: 12px 24px;
          background: #edf2f7;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          color: #4a5568;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn-cancel:hover {
          background: #e2e8f0;
        }
        .btn-submit {
          padding: 12px 24px;
          background: #3182ce;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn-submit:hover {
          background: #2c5282;
        }
        .btn-submit:disabled {
          background: #a0aec0;
          cursor: not-allowed;
        }
        .info-text {
          font-size: 12px;
          color: #718096;
          margin-top: 4px;
          font-style: italic;
        }
        .stock-badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
          margin-top: 5px;
        }
        .stock-low {
          background: #fef3c7;
          color: #92400e;
        }
        .stock-medium {
          background: #dbeafe;
          color: #1e40af;
        }
        .stock-high {
          background: #dcfce7;
          color: #166534;
        }
      `}</style>

      <div className="form-card">
        <h1 className="form-title">{id ? 'Edit Product' : 'Add New Product'}</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Product ID - New Field */}
            <div className="form-group full-width">
              <label>Product ID / SKU *</label>
              <input 
                type="text" 
                name="productId" 
                value={formData.productId} 
                onChange={handleChange} 
                required 
                placeholder="Enter unique product ID or SKU (e.g., PRD-001)"
              />
            </div>

            {/* Product Name - Full Width */}
            <div className="form-group full-width">
              <label>Product Name *</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                placeholder="Enter product name"
              />
            </div>

            {/* Price, Offer Price and Stock */}
            <div className="form-group">
              <label>Price (₹) *</label>
              <input 
                type="number" 
                name="price" 
                value={formData.price} 
                onChange={handleChange} 
                required 
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label>Offer Price (₹)</label>
              <input 
                type="number" 
                name="offerPrice" 
                value={formData.offerPrice} 
                onChange={handleChange} 
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>

            {/* Stock Quantity - New Field */}
            <div className="form-group">
              <label>Stock Quantity *</label>
              <input 
                type="number" 
                name="stock" 
                value={formData.stock} 
                onChange={handleChange} 
                required 
                placeholder="0"
                min="0"
                step="1"
              />
              {formData.stock !== undefined && (
                <div className={`stock-badge ${
                  formData.stock === 0 ? 'stock-low' : 
                  formData.stock < 10 ? 'stock-medium' : 
                  'stock-high'
                }`}>
                  {formData.stock === 0 ? 'Out of Stock' : 
                   formData.stock < 10 ? 'Low Stock' : 
                   'In Stock'}
                </div>
              )}
            </div>

            {/* Category and Subcategory */}
            <div className="form-group">
              <label>Category *</label>
              <select name="category" value={formData.category} onChange={handleChange} required>
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Sub Category</label>
              <select name="subCategory" value={formData.subCategory} onChange={handleChange}>
                <option value="">Select Subcategory</option>
                {subcategories.map(sub => (
                  <option key={sub.id} value={sub.name}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Design, Shape, Material */}
            <div className="form-group">
              <label>Design</label>
              <select name="design" value={formData.design} onChange={handleChange}>
                <option value="">Select Design</option>
                {designs.map(d => (
                  <option key={d.id} value={d.design || d.name || d.id}>
                    {d.design || d.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Shape</label>
              <select name="shape" value={formData.shape} onChange={handleChange}>
                <option value="">Select Shape</option>
                {shapes.map(s => (
                  <option key={s.id} value={s.shape || s.name || s.id}>
                    {s.shape || s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Material</label>
              <select name="material" value={formData.material} onChange={handleChange}>
                <option value="">Select Material</option>
                {materials.map(m => (
                  <option key={m.id} value={m.material || m.name || m.id}>
                    {m.material || m.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Multiple Images Upload - Full Width */}
            <div className="form-group full-width">
              <label>Product Images (Select multiple images)</label>
              <div className="image-upload-section">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  id="image-upload"
                  multiple
                />
                <p className="image-count">
                  {imagePreviews.length} image(s) selected
                </p>
              </div>

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="image-preview-grid">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="image-preview-item">
                      <img 
                        src={preview} 
                        alt={`Preview ${index + 1}`} 
                        className="image-preview-img" 
                      />
                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() => handleRemoveImage(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Description - Full Width */}
            <div className="form-group full-width">
              <label>Description</label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                rows="4"
                placeholder="Enter product description..."
              />
              <p className="info-text">
                Search keywords will be automatically generated from product ID, name, category, design, shape, material, and description
              </p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button 
              type="button" 
              className="btn-cancel" 
              onClick={() => navigate('/products')}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-submit" 
              disabled={loading}
            >
              {loading ? 'Saving...' : (id ? 'Update Product' : 'Add Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;