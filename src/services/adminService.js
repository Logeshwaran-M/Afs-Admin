import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  limit,
  deleteDoc,
  doc 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import toast from 'react-hot-toast';

// ==================== DASHBOARD STATS ====================

export const getDashboardStats = async () => {
  try {
    // Get products count
    const productsSnap = await getDocs(collection(db, 'products'));
    
    // Get orders
    const ordersSnap = await getDocs(collection(db, 'orders'));
    let totalRevenue = 0;
    let pendingOrders = 0;
    
    ordersSnap.forEach(doc => {
      const order = doc.data();
      totalRevenue += order.total || 0;
      if (order.status === 'pending') pendingOrders++;
    });

    // Get users count
    const usersSnap = await getDocs(collection(db, 'users'));

    return {
      totalProducts: productsSnap.size,
      totalOrders: ordersSnap.size,
      totalUsers: usersSnap.size,
      totalRevenue,
      pendingOrders
    };
  } catch (error) {
    console.error('Error getting stats:', error);
    return {
      totalProducts: 0,
      totalOrders: 0,
      totalUsers: 0,
      totalRevenue: 0,
      pendingOrders: 0
    };
  }
};

// ==================== RECENT ORDERS ====================

export const getRecentOrders = async (limitCount = 5) => {
  try {
    const q = query(
      collection(db, 'orders'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    const orders = [];
    snapshot.forEach(doc => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    return orders;
  } catch (error) {
    console.error('Error getting recent orders:', error);
    return [];
  }
};

// ==================== REVIEW SERVICES ====================

export const getAllReviews = async () => {
  try {
    const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const reviews = [];
    snapshot.forEach(doc => {
      reviews.push({ id: doc.id, ...doc.data() });
    });
    return reviews;
  } catch (error) {
    console.error('Error getting reviews:', error);
    return [];
  }
};

export const deleteReview = async (id) => {
  try {
    await deleteDoc(doc(db, 'reviews', id));
    toast.success('Review deleted successfully');
    return true;
  } catch (error) {
    toast.error('Error deleting review');
    throw error;
  }
};