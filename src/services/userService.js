import { 
  collection, getDocs, getDoc, updateDoc, deleteDoc, doc, query, orderBy 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import toast from 'react-hot-toast';

const collectionName = 'users';

export const getAllUsers = async () => {
  try {
    const q = query(collection(db, collectionName), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const items = [];
    snapshot.forEach(doc => {
      items.push({ id: doc.id, ...doc.data() });
    });
    return items;
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
};

export const getUserById = async (id) => {
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

export const updateUserRole = async (id, role) => {
  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
      role,
      updatedAt: new Date().toISOString()
    });
    toast.success('User role updated');
    return true;
  } catch (error) {
    toast.error('Error updating user');
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    await deleteDoc(doc(db, collectionName, id));
    toast.success('User deleted successfully');
    return true;
  } catch (error) {
    toast.error('Error deleting user');
    throw error;
  }
};