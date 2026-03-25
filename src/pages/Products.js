import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import { getAllProducts, deleteProduct } from '../services/productService';
import Table from '../components/Table';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null, name: '' });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const data = await getAllProducts();
    setProducts(data);
    setLoading(false);
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(deleteModal.id);
      await loadProducts();
      setDeleteModal({ show: false, id: null, name: '' });
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const columns = [
    { 
  header: 'Image', 
  accessor: (row) => (
    <img 
      src={
        row.images && row.images.length > 0
          ? row.images[0]
          : "https://via.placeholder.com/50"
      } 
      alt={row.name} 
      style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
    />
  )
},
    { header: 'Name', accessor: 'name' },
    { header: 'Price', accessor: (row) => `₹${row.price}` },
    { header: 'Category', accessor: 'category' },
    { header: 'Popular', accessor: (row) => row.popular ? 'Yes' : 'No' },
    {
      header: 'Actions',
      accessor: (row) => (
        <div className="action-buttons">
          <button 
            className="action-btn view"
            onClick={() => navigate(`/product/${row.id}`)}
          >
            <FaEye />
          </button>
          <button 
            className="action-btn edit"
            onClick={() => navigate(`/products/edit/${row.id}`)}
          >
            <FaEdit />
          </button>
          <button 
            className="action-btn delete"
            onClick={() => setDeleteModal({ show: true, id: row.id, name: row.name })}
          >
            <FaTrash />
          </button>
        </div>
      )
    }
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="products-page">
      <div className="page-header">
        <h1>Products</h1>
        <button 
          className="add-btn"
          onClick={() => navigate('/products/new')}
        >
          <FaPlus /> Add Product
        </button>
      </div>

      <Table columns={columns} data={products} />

      <Modal 
        isOpen={deleteModal.show} 
        onClose={() => setDeleteModal({ show: false, id: null, name: '' })}
        title="Delete Product"
        size="small"
      >
        <p>Are you sure you want to delete <strong>{deleteModal.name}</strong>?</p>
        <p>This action cannot be undone.</p>
        <div className="modal-actions">
          <button 
            className="cancel-btn"
            onClick={() => setDeleteModal({ show: false, id: null, name: '' })}
          >
            Cancel
          </button>
          <button 
            className="delete-btn"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Products;