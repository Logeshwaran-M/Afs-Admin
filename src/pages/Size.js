import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { getAllCategories } from '../services/categoryService';
import {
  getAllSizes,
  addSize,
  updateSize,
  deleteSize
} from '../services/sizeService';

import Table from '../components/Table';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { getSubCategoriesByCategory } from '../services/subCategoryService';

const Size = () => {
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(true);
const [subcategories, setSubcategories] = useState([]);
  const [modal, setModal] = useState({ show: false, mode: '', id: null });
const [formData, setFormData] = useState({
  categoryId: '',
  subcategoryId: '',
  label: '',
  dimensions: '',
  price: ''
});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const catData = await getAllCategories();
    const sizeData = await getAllSizes();

    setCategories(catData);
    setSizes(sizeData);
    setLoading(false);
  };

  useEffect(() => {
  if (!formData.categoryId) {
    setSubcategories([]); // reset
    return;
  }

  const fetchSubcategories = async () => {
    try {
      const data = await getSubCategoriesByCategory(formData.categoryId);
      setSubcategories(data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  fetchSubcategories();
}, [formData.categoryId]);

  // ✅ SAVE
const handleSave = async () => {
  const { categoryId, subcategoryId, label, price } = formData;

  if (!categoryId) return toast.error('Select category');
  if (!subcategoryId) return toast.error('Select subcategory');
  if (!label) return toast.error('Enter size name');
  if (!price) return toast.error('Enter price');

  try {
    // ✅ Get category name
    const selectedCategory = categories.find(
      (c) => c.id === categoryId
    );

    // ✅ Get subcategory name
    const selectedSubcategory = subcategories.find(
      (s) => s.id === subcategoryId
    );

    // ✅ FINAL DATA (IMPORTANT)
    const finalData = {
      ...formData,
      categoryName: selectedCategory?.name || "",
      subcategoryName: selectedSubcategory?.name || ""
    };

    if (modal.mode === 'add') {
      await addSize(finalData);
      toast.success('Size added!');
    } else {
      await updateSize(modal.id, finalData);
      toast.success('Size updated!');
    }

    loadData();
    resetForm();

  } catch (error) {
    console.error(error);
    toast.error('Error saving size');
  }
};

  // ✅ DELETE
  const handleDelete = async (id) => {
    if (window.confirm('Delete this size?')) {
      await deleteSize(id);
      toast.success('Deleted!');
      loadData();
    }
  };

  const resetForm = () => {
    setModal({ show: false, mode: '', id: null });
    setFormData({
      categoryId: '',
      label: '',
      dimensions: '',
      price: ''
    });
  };

  // ✅ EDIT
  const handleEdit = (row) => {
    setFormData(row);
    setModal({ show: true, mode: 'edit', id: row.id });
  };

  const columns = [
    { header: 'S.No', accessor: (_, i) => i + 1 },
    {
      header: 'Category',
      accessor: (row) =>
        categories.find(c => c.id === row.categoryId)?.name || 'N/A'
    },
    { header: 'Size', accessor: 'label' },
    { header: 'Dimensions', accessor: 'dimensions' },
    { header: 'Price', accessor: (row) => `₹${row.price}` },
    {
      header: 'Actions',
      accessor: (row) => (
        <div className="d-flex gap-2">
          <button
            className="btn btn-warning btn-sm"
            onClick={() => handleEdit(row)}
          >
            <FaEdit /> Edit
          </button>

          <button
            className="btn btn-danger btn-sm"
            onClick={() => handleDelete(row.id)}
          >
            <FaTrash /> Delete
          </button>
        </div>
      )
    }
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mt-4">
      
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Sizes</h2>

        <button
          className="btn btn-primary"
          onClick={() => setModal({ show: true, mode: 'add' })}
        >
          <FaPlus /> Add Size
        </button>
      </div>

      {/* TABLE */}
      <div className="card p-3 shadow-sm">
        <Table columns={columns} data={sizes} />
      </div>

      {/* MODAL */}
      <Modal
        isOpen={modal.show}
        onClose={resetForm}
        title={modal.mode === 'add' ? 'Add Size' : 'Edit Size'}
      >
        <div className="mb-3">
          <label className="form-label">Category</label>
         <select
  className="form-select"
  value={formData.categoryId}
  onChange={(e) =>
    setFormData({
      ...formData,
      categoryId: e.target.value,
      subcategoryId: "" // 🔥 reset subcategory
    })
  }
>
            <option value="">Select Category</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
  <label className="form-label">Subcategory</label>
  <select
    className="form-select"
    value={formData.subcategoryId}
    onChange={(e) =>
      setFormData({ ...formData, subcategoryId: e.target.value })
    }
  >
    <option value="">Select Subcategory</option>
    {subcategories.map((s) => (
      <option key={s.id} value={s.id}>
        {s.name}
      </option>
    ))}
  </select>
</div>

        <div className="mb-3">
          <label className="form-label">Size</label>
          <input
            type="text"
            className="form-control"
            placeholder="Small / Large"
            value={formData.label}
            onChange={(e) =>
              setFormData({ ...formData, label: e.target.value })
            }
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Dimensions</label>
          <input
            type="text"
            className="form-control"
            placeholder="8 x 2 x 2"
            value={formData.dimensions}
            onChange={(e) =>
              setFormData({ ...formData, dimensions: e.target.value })
            }
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Price (₹)</label>
          <input
            type="number"
            className="form-control"
            placeholder="Enter price"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
          />
        </div>

        <div className="d-flex justify-content-end gap-2">
          <button className="btn btn-secondary" onClick={resetForm}>
            Cancel
          </button>

          <button className="btn btn-success" onClick={handleSave}>
            Save
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Size;