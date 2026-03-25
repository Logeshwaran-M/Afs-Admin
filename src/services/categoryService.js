import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase/config';
import toast from 'react-hot-toast';

const collectionName = 'categories';
const categoriesCollection = collection(db, collectionName);

// Get all categories
export const getAllCategories = async () => {
  try {
    const q = query(categoriesCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const items = [];
    snapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() });
    });
    return items;
  } catch (error) {
    console.error('Error getting categories:', error);
    return [];
  }
};

// Add category
export const addCategory = async (data) => {
  try {
    const docRef = await addDoc(categoriesCollection, {
      name: data.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    toast.success('Category added successfully');
    return { id: docRef.id, name: data.name };
  } catch (error) {
    console.error('Error adding category:', error);
    toast.error('Error adding category');
    throw error;
  }
};

// Update category
export const updateCategory = async (id, data) => {
  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
      name: data.name,
      updatedAt: new Date().toISOString()
    });
    toast.success('Category updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating category:', error);
    toast.error('Error updating category');
    throw error;
  }
};

// Delete category
export const deleteCategory = async (id) => {
  try {
    await deleteDoc(doc(db, collectionName, id));
    toast.success('Category deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting category:', error);
    toast.error('Error deleting category');
    throw error;
  }
};