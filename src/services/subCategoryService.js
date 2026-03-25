import { 
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import toast from 'react-hot-toast';

const collectionName = 'subcategories';

// Get all subcategories
export const getAllSubCategories = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const items = [];
    querySnapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() });
    });
    return items;
  } catch (error) {
    console.error('Error getting subcategories:', error);
    return [];
  }
};

// Get subcategories by category ID
export const getSubCategoriesByCategory = async (categoryId) => {
  try {
    const q = query(collection(db, collectionName), where('categoryId', '==', categoryId));
    const querySnapshot = await getDocs(q);
    const items = [];
    querySnapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() });
    });
    return items;
  } catch (error) {
    console.error('Error getting subcategories by category:', error);
    return [];
  }
};

// Add subcategory
export const addSubCategory = async (data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    toast.success('Sub category added successfully');
    return { id: docRef.id, ...data };
  } catch (error) {
    toast.error('Error adding sub category');
    throw error;
  }
};

// Update subcategory
export const updateSubCategory = async (id, data) => {
  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString()
    });
    toast.success('Sub category updated successfully');
    return true;
  } catch (error) {
    toast.error('Error updating sub category');
    throw error;
  }
};

// Delete subcategory
export const deleteSubCategory = async (id) => {
  try {
    await deleteDoc(doc(db, collectionName, id));
    toast.success('Sub category deleted successfully');
    return true;
  } catch (error) {
    toast.error('Error deleting sub category');
    throw error;
  }
};