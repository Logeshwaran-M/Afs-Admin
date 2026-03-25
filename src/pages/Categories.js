import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { getAllCategories, addCategory, updateCategory, deleteCategory } from '../services/categoryService';
import Table from '../components/Table';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ show: false, mode: '', id: null });
  const [formData, setFormData] = useState({ name: '' });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    const data = await getAllCategories();
    setCategories(data);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('Please enter category name');
      return;
    }

    try {
      if (modal.mode === 'add') {
        await addCategory({ name: formData.name });
        toast.success('Category added successfully!');
      } else {
        await updateCategory(modal.id, { name: formData.name });
        toast.success('Category updated successfully!');
      }
      await loadCategories();
      setModal({ show: false, mode: '', id: null });
      setFormData({ name: '' });
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Failed to save category');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await deleteCategory(id);
        toast.success('Category deleted successfully!');
        await loadCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
        toast.error('Failed to delete category');
      }
    }
  };

  const columns = [
    { 
      header: 'S.No', 
      accessor: (_, index) => index + 1 
    },
    { 
      header: 'Category Name', 
      accessor: 'name' 
    },
    { 
      header: 'Created Date', 
      accessor: (row) => row.createdAt ? new Date(row.createdAt).toLocaleDateString('en-IN') : 'N/A' 
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <div className="action-buttons">
          <button 
            className="action-btn edit"
            onClick={() => {
              setFormData({ name: row.name });
              setModal({ show: true, mode: 'edit', id: row.id });
            }}
          >
            <FaEdit /> Edit
          </button>
          <button 
            className="action-btn delete"
            onClick={() => handleDelete(row.id, row.name)}
          >
            <FaTrash /> Delete
          </button>
        </div>
      )
    }
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="categories-page">
      <div className="page-header">
        <h1>Categories</h1>
        <button 
          className="add-btn"
          onClick={() => {
            setFormData({ name: '' });
            setModal({ show: true, mode: 'add', id: null });
          }}
        >
          <FaPlus /> Add Category
        </button>
      </div>

      <Table columns={columns} data={categories} />

      <Modal 
        isOpen={modal.show} 
        onClose={() => setModal({ show: false, mode: '', id: null })}
        title={modal.mode === 'add' ? 'Add Category' : 'Edit Category'}
      >
        <div className="form-group">
          <label>Category Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ name: e.target.value })}
            placeholder="Enter category name"
            autoFocus
          />
        </div>
        <div className="modal-actions">
          <button onClick={() => setModal({ show: false, mode: '', id: null })}>
            Cancel
          </button>
          <button onClick={handleSave} className="save-btn">
            Save
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Categories;