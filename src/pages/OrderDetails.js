import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaTruck, FaCheckCircle } from 'react-icons/fa';
import { getOrderById, updateOrderStatus } from '../services/orderService';
import LoadingSpinner from '../components/LoadingSpinner';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ userId from Orders page
  const userId = location.state?.userId;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (userId && id) {
      loadOrder();
    }
  }, [id, userId]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const data = await getOrderById(userId, id);
      setOrder(data);
    } catch (error) {
      console.error("Error loading order:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      setUpdating(true);
      await updateOrderStatus(userId, id, newStatus);
      await loadOrder();
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f57c00',
      confirmed: '#1976d2',
      shipped: '#7b1fa2',
      delivered: '#388e3c',
      cancelled: '#d32f2f'
    };
    return colors[status] || '#f57c00';
  };

  if (loading) return <LoadingSpinner />;
  if (!order) return <div>Order not found</div>;

  return (
    <div className="order-details">

      {/* BACK */}
      <button className="back-btn" onClick={() => navigate('/orders')}>
        <FaArrowLeft /> Back to Orders
      </button>

      {/* HEADER */}
      <div className="order-header">
        <h1>Order #{order.id}</h1>
        <div 
          className="order-status" 
          style={{ background: getStatusColor(order.status) }}
        >
          {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
        </div>
      </div>

      {/* INFO */}
      <div className="order-info-grid">

        <div className="info-card">
          <h3>Customer Details</h3>
          <p><strong>Name:</strong> {order.customer?.name || 'N/A'}</p>
          <p><strong>Email:</strong> {order.customer?.email || 'N/A'}</p>
          <p><strong>Phone:</strong> {order.customer?.phone || 'N/A'}</p>
        </div>

        <div className="info-card">
          <h3>Shipping Address</h3>
          <p>{order.shipping?.address1}</p>
          {order.shipping?.address2 && <p>{order.shipping.address2}</p>}
          <p>
            {order.shipping?.city}, {order.shipping?.state} - {order.shipping?.pincode}
          </p>
        </div>

        <div className="info-card">
          <h3>Payment Details</h3>
          <p><strong>Method:</strong> {order.payment?.method}</p>
          <p><strong>Status:</strong> {order.payment?.status}</p>
          <p><strong>Subtotal:</strong> ₹{order.payment?.subtotal}</p>
          <p><strong>Shipping:</strong> ₹{order.payment?.shipping}</p>
          <p><strong>Total:</strong> ₹{order.payment?.total}</p>
        </div>

        {/* STATUS UPDATE */}
        <div className="info-card">
          <h3>Update Status</h3>

          <div className="status-buttons">
            <button 
              onClick={() => handleStatusUpdate('confirmed')}
              disabled={updating || order.status === 'confirmed'}
            >
              <FaCheckCircle /> Confirm
            </button>

            <button 
              onClick={() => handleStatusUpdate('shipped')}
              disabled={updating || order.status === 'shipped'}
            >
              <FaTruck /> Ship
            </button>

            <button 
              onClick={() => handleStatusUpdate('delivered')}
              disabled={updating || order.status === 'delivered'}
            >
              <FaCheckCircle /> Deliver
            </button>
          </div>
        </div>
      </div>

      {/* ITEMS */}
      <div className="order-items">
        <h3>Order Items</h3>

        <table className="items-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            {order.items?.map((item, index) => (
              <tr key={index}>
                <td>
                  <div className="product-info">

                    {/* ✅ IMAGE FIX */}
                    <img 
                      src={item.images?.[0] || item.image || "https://via.placeholder.com/50"} 
                      alt={item.name}
                      style={{ width: "50px", height: "50px", objectFit: "cover" }}
                    />

                    <span>{item.name}</span>
                  </div>
                </td>

                <td>₹{item.price}</td>
                <td>{item.quantity}</td>
                <td>₹{item.price * item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default OrderDetails;