import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,  // ✅ Add this
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  where,
  limit
} from 'firebase/firestore';
import { db } from '../firebase/config';
import toast from 'react-hot-toast';

const collectionName = 'products';
const productsCollection = collection(db, collectionName);

// Get all products
export const getAllProducts = async () => {
  try {
    const q = query(productsCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const items = [];
    snapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() });
    });
    return items;
  } catch (error) {
    console.error('Error getting products:', error);
    return [];
  }
};

// ✅ ADD THIS - Get product by ID
export const getProductById = async (id) => {
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting product:', error);
    return null;
  }
};

// Add product
export const addProduct = async (data) => {
  try {
    const docRef = await addDoc(productsCollection, {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    toast.success('Product added successfully');
    return { id: docRef.id, ...data };
  } catch (error) {
    toast.error('Error adding product');
    throw error;
  }
};

// Update product
export const updateProduct = async (id, data) => {
  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString()
    });
    toast.success('Product updated successfully');
    return true;
  } catch (error) {
    toast.error('Error updating product');
    throw error;
  }
};

// Delete product
export const deleteProduct = async (id) => {
  try {
    await deleteDoc(doc(db, collectionName, id));
    toast.success('Product deleted successfully');
    return true;
  } catch (error) {
    toast.error('Error deleting product');
    throw error;
  }
};

// Get products by category
export const getProductsByCategory = async (category) => {
  try {
    const q = query(productsCollection, where('category', '==', category));
    const snapshot = await getDocs(q);
    const products = [];
    snapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
    return products;
  } catch (error) {
    console.error('Error getting products by category:', error);
    return [];
  }
};

// Get popular products
export const getPopularProducts = async (limitCount = 8) => {
  try {
    const q = query(
      productsCollection, 
      where('popular', '==', true), 
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    const products = [];
    snapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
    return products;
  } catch (error) {
    console.error('Error getting popular products:', error);
    return [];
  }
};