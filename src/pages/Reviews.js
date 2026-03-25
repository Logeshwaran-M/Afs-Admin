import React, { useEffect, useState } from 'react';
import { FaTrash, FaStar } from 'react-icons/fa';
import { getAllReviews, deleteReview } from '../services/adminService';
import Table from '../components/Table';
import LoadingSpinner from '../components/LoadingSpinner';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    setLoading(true);
    // This should come from a reviewService
    const data = await getAllReviews(); // You need to implement this
    setReviews(data);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this review?')) {
      await deleteReview(id);
      await loadReviews();
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar key={i} color={i < rating ? '#ffc107' : '#e4e5e9'} />
    ));
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const columns = [
    { header: 'Product', accessor: 'productName' },
    { header: 'User', accessor: 'userName' },
    { header: 'Rating', accessor: (row) => (
      <div className="stars">{renderStars(row.rating)}</div>
    )},
    { header: 'Comment', accessor: (row) => row.comment?.substring(0, 50) + '...' },
    { header: 'Date', accessor: (row) => formatDate(row.createdAt) },
    {
      header: 'Actions',
      accessor: (row) => (
        <button 
          className="action-btn delete"
          onClick={() => handleDelete(row.id)}
        >
          <FaTrash />
        </button>
      )
    }
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="reviews-page">
      <h1>Reviews</h1>
      <Table columns={columns} data={reviews} />
    </div>
  );
};

export default Reviews;