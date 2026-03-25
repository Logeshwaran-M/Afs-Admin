import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaBox, FaShoppingBag, FaUsers, FaRupeeSign, 
  FaEye, FaClock, FaCheckCircle, FaTruck 
} from 'react-icons/fa';
import { getDashboardStats, getRecentOrders } from '../services/adminService';
import StatsCard from '../components/StatsCard';
import Table from '../components/Table';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const statsData = await getDashboardStats();
      const ordersData = await getRecentOrders(10);
      setStats(statsData);
      setRecentOrders(ordersData);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { color: '#f57c00', bg: '#fff3e0', icon: <FaClock /> },
      confirmed: { color: '#1976d2', bg: '#e3f2fd', icon: <FaCheckCircle /> },
      shipped: { color: '#7b1fa2', bg: '#f3e5f5', icon: <FaTruck /> },
      delivered: { color: '#388e3c', bg: '#e8f5e9', icon: <FaCheckCircle /> },
      cancelled: { color: '#d32f2f', bg: '#ffebee', icon: <FaClock /> }
    };
    const style = statusMap[status] || statusMap.pending;
    return (
      <span className="status-badge" style={{ background: style.bg, color: style.color }}>
        {style.icon} {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const columns = [
    { header: 'Order ID', accessor: 'id' },
    { header: 'Customer', accessor: (row) => row.customer?.name || 'N/A' },
    { header: 'Date', accessor: (row) => formatDate(row.createdAt) },
    { header: 'Total', accessor: (row) => `₹${row.total}` },
    { header: 'Status', accessor: (row) => getStatusBadge(row.status) },
    {
      header: 'Action',
      accessor: (row) => (
        <button 
          className="action-btn view"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/orders/${row.id}`);
          }}
        >
          <FaEye /> View
        </button>
      )
    }
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
      <div className="stats-grid">
        <StatsCard 
          icon={<FaBox />}
          title="Total Products"
          value={stats?.totalProducts || 0}
          color="blue"
        />
        <StatsCard 
          icon={<FaShoppingBag />}
          title="Total Orders"
          value={stats?.totalOrders || 0}
          color="green"
        />
        <StatsCard 
          icon={<FaUsers />}
          title="Total Users"
          value={stats?.totalUsers || 0}
          color="orange"
        />
        <StatsCard 
          icon={<FaRupeeSign />}
          title="Total Revenue"
          value={`₹${stats?.totalRevenue || 0}`}
          color="purple"
        />
      </div>

      <div className="recent-orders">
        <div className="section-header">
          <h2>Recent Orders</h2>
          <button onClick={() => navigate('/orders')}>View All</button>
        </div>
        <Table 
          columns={columns} 
          data={recentOrders}
          onRowClick={(row) => navigate(`/orders/${row.id}`)}
        />
      </div>
    </div>
  );
};

export default Dashboard;