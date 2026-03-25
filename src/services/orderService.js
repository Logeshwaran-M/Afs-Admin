import { 
  collection, 
  collectionGroup,
  getDocs, 
  getDoc, 
  doc,
  query,
  orderBy,
  updateDoc,
  deleteDoc,
  addDoc
} from 'firebase/firestore';
import { db } from '../firebase/config';
import toast from 'react-hot-toast';


// ✅ GET ALL ORDERS (FROM ALL USERS)
export const getAllOrders = async () => {
  try {
    const q = query(
      collectionGroup(db, "orders"),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    const orders = await Promise.all(
      snapshot.docs.map(async (docSnap) => {
        const data = docSnap.data();

        let customer = null;

        // 🔥 FETCH USER DATA
        if (data.userId) {
          const userRef = doc(db, "users", data.userId);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            customer = userSnap.data();
          }
        }

        return {
          id: docSnap.id,
          userId: data.userId,
          ...data,
          customer // 🔥 attach user data here
        };
      })
    );

    return orders;
  } catch (error) {
    console.error("Error getting orders:", error);
    return [];
  }
};


// ✅ GET ORDER BY ID (CORRECT VERSION 🔥)
export const getOrderById = async (userId, orderId) => {
  try {
    if (!userId || !orderId) return null;

    const docRef = doc(db, "users", userId, "orders", orderId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    }

    return null;
  } catch (error) {
    console.error('Error getting order:', error);
    return null;
  }
};


// ✅ UPDATE ORDER STATUS
export const updateOrderStatus = async (userId, orderId, status) => {
  try {
    if (!userId || !orderId) return;

    const docRef = doc(db, "users", userId, "orders", orderId);

    await updateDoc(docRef, {
      status,
      updatedAt: new Date().toISOString()
    });

    toast.success(`Order status updated to ${status}`);
    return true;
  } catch (error) {
    console.error('Error updating order:', error);
    toast.error('Failed to update order');
    throw error;
  }
};


// ✅ DELETE ORDER
export const deleteOrder = async (userId, orderId) => {
  try {
    if (!userId || !orderId) return;

    await deleteDoc(doc(db, "users", userId, "orders", orderId));

    toast.success('Order deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting order:', error);
    toast.error('Failed to delete order');
    throw error;
  }
};


// ✅ CREATE ORDER
export const createOrder = async (userId, orderData) => {
  try {
    if (!userId) throw new Error("User ID missing");

    const ordersRef = collection(db, "users", userId, "orders");

    const orderWithTimestamp = {
      ...orderData,
      userId, // 🔥 VERY IMPORTANT
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await addDoc(ordersRef, orderWithTimestamp);

    toast.success('Order created successfully');

    return { id: docRef.id, ...orderWithTimestamp };
  } catch (error) {
    console.error('Error creating order:', error);
    toast.error('Failed to create order');
    throw error;
  }
};