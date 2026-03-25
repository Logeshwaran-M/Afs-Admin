import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useFirebase } from './FirebaseContext';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const { user } = useFirebase();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState(null);
  const [adminList, setAdminList] = useState([]); // Added this

  // Admin UID and emails
  const ADMIN_USER_ID = "oaCvXkA8yrM2qNnLmePJ3QlAVoJ3";
  const ADMIN_EMAILS = ['afs_admin@gmail.com'];

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  // New function to load all admins
  const loadAdminData = async () => {
    try {
      const adminsSnap = await getDocs(collection(db, 'admins'));
      const admins = [];
      adminsSnap.forEach(doc => {
        admins.push({ id: doc.id, ...doc.data() });
      });
      setAdminList(admins);
    } catch (error) {
      console.error('Error loading admin list:', error);
    }
  };

  const checkAdminStatus = async () => {
    setLoading(true);
    
    if (!user) {
      setIsAdmin(false);
      setAdminData(null);
      setLoading(false);
      return;
    }

    try {
      console.log('🔍 Checking admin for:', user.email);
      console.log('🔍 User UID:', user.uid);
      
      const uidMatch = (user.uid === ADMIN_USER_ID);
      const emailMatch = ADMIN_EMAILS.includes(user.email);
      
      const adminDoc = await getDoc(doc(db, 'admins', user.uid));
      const firestoreMatch = adminDoc.exists();
      
      if (uidMatch || emailMatch || firestoreMatch) {
        setIsAdmin(true);
        if (firestoreMatch) {
          setAdminData(adminDoc.data());
        } else {
          setAdminData({ uid: user.uid, email: user.email });
        }
        console.log('✅ ADMIN CONFIRMED');
      } else {
        setIsAdmin(false);
        setAdminData(null);
        console.log('❌ NOT ADMIN');
      }
      
      // Load all admins after checking
      await loadAdminData();
      
    } catch (error) {
      console.error('Error checking admin:', error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    isAdmin,
    loading,
    adminData,
    adminList,        // Added this
    loadAdminData,    // Added this
    checkAdminStatus, // Added this
    ADMIN_USER_ID,
    ADMIN_EMAILS
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};