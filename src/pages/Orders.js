import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaTrash } from 'react-icons/fa';
import { getAllOrders, deleteOrder } from '../services/orderService';
import Table from '../components/Table';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    id: null,
    userId: null
  });

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      if (!deleteModal.userId || !deleteModal.id) return;

      await deleteOrder(deleteModal.userId, deleteModal.id);
      await loadOrders();

      setDeleteModal({ show: false, id: null, userId: null });
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: { background: '#fff3e0', color: '#f57c00', padding: '4px 10px', borderRadius: '6px' },
      confirmed: { background: '#e3f2fd', color: '#1976d2', padding: '4px 10px', borderRadius: '6px' },
      shipped: { background: '#f3e5f5', color: '#7b1fa2', padding: '4px 10px', borderRadius: '6px' },
      delivered: { background: '#e8f5e9', color: '#388e3c', padding: '4px 10px', borderRadius: '6px' },
      cancelled: { background: '#ffebee', color: '#d32f2f', padding: '4px 10px', borderRadius: '6px' }
    };

    const style = colors[status] || colors.pending;

    return (
      <span style={style}>
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';

    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const columns = [
    { header: 'Order ID', accessor: 'id' },
    { header: 'Customer', accessor: (row) => row.customer?.name || 'N/A' },
    { header: 'Email', accessor: (row) => row.customer?.email || 'N/A' },
    { header: 'Date', accessor: (row) => formatDate(row.createdAt) },
    { header: 'Total', accessor: (row) => `₹${row.total || row.payment?.total || 0}` },
    { header: 'Status', accessor: (row) => getStatusBadge(row.status) },
    { header: 'Payment', accessor: (row) => row.payment?.method || 'N/A' },
    {
      header: 'Actions',
      accessor: (row) => (
        <div className="action-buttons">

          {/* VIEW */}
          <button
            className="action-btn view"
            onClick={() =>
  setDeleteModal({
    show: true,
    id: row.docId,     // 🔥 change here
    userId: row.userId
  })
}
          >
            <FaEye />
          </button>

          {/* DELETE */}
          <button
            className="action-btn delete"
            onClick={() =>
              setDeleteModal({
                show: true,
                id: row.docId,
                userId: row.userId
              })
            }
          >
            <FaTrash />
          </button>
        </div>
      )
    }
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="orders-page">
      <div className="page-header">
        <h1>Orders</h1>
        <p>Total Orders: {orders.length}</p>
      </div>

      <Table columns={columns} data={orders} />

      {/* DELETE MODAL */}
      <Modal
        isOpen={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, id: null, userId: null })}
        title="Delete Order"
        size="small"
      >
        <p>Are you sure you want to delete this order?</p>
        <p>This action cannot be undone.</p>

        <div className="modal-actions">
          <button onClick={() => setDeleteModal({ show: false, id: null, userId: null })}>
            Cancel
          </button>
          
          <button onClick={handleDelete} className="delete-btn">
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Orders;