import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import toast from 'react-hot-toast';

const FirebaseContext = createContext();

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within FirebaseProvider');
  }
  return context;
};

export const FirebaseProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // 🔥 Admin emails list - Add your admin emails here
  const ADMIN_EMAILS = [
    'afs_admin@gmail.com',
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        // Check and create admin collection automatically
        await checkAndCreateAdmin(user);
      } else {
        setIsAdmin(false);
      }
      
      setLoading(false);
    });
    
    return unsubscribe;
  }, []);

  // 🔥 Auto-create admin collection function
  const checkAndCreateAdmin = async (user) => {
    try {
      // Check if user exists in admins collection
      const adminDoc = await getDoc(doc(db, 'admins', user.uid));
      
      // Check if email is in admin list
      const isAdminEmail = ADMIN_EMAILS.includes(user.email);
      
      if (!adminDoc.exists() && isAdminEmail) {
        // Auto-create admin document
        const adminData = {
          uid: user.uid,
          email: user.email,
          role: 'admin',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 'auto',
          status: 'active'
        };
        
        await setDoc(doc(db, 'admins', user.uid), adminData);
        console.log('✅ Admin document auto-created for:', user.email);
        setIsAdmin(true);
        
      } else if (adminDoc.exists()) {
        // User already in admins collection
        setIsAdmin(true);
        console.log('✅ Admin document exists for:', user.email);
        
        // Update last login
        await setDoc(doc(db, 'admins', user.uid), {
          lastLogin: new Date().toISOString()
        }, { merge: true });
        
      } else {
        setIsAdmin(false);
      }
      
    } catch (error) {
      console.error('Error checking/creating admin:', error);
      setIsAdmin(false);
    }
  };

  // 🔥 Force create admin function (can be called manually)
  const forceCreateAdmin = async (email) => {
    try {
      // Find user by email
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        
        // Create admin document
        const adminData = {
          uid: userDoc.id,
          email: userData.email,
          name: userData.name || '',
          role: 'admin',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 'manual',
          status: 'active'
        };
        
        await setDoc(doc(db, 'admins', userDoc.id), adminData);
        toast.success(`Admin created for ${email}`);
        return true;
      } else {
        toast.error('User not found');
        return false;
      }
    } catch (error) {
      console.error('Error force creating admin:', error);
      toast.error('Failed to create admin');
      return false;
    }
  };

  const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Check admin status after login
      await checkAndCreateAdmin(result.user);
      
      // Check if user is admin
      if (!isAdmin && !ADMIN_EMAILS.includes(email)) {
        // If not admin, logout and show error
        await signOut(auth);
        toast.error('Access denied. Admin only.');
        throw new Error('Not admin');
      }
      
      toast.success('Login successful');
      return result.user;
      
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const register = async (email, password, userData) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user document
      await setDoc(doc(db, 'users', result.user.uid), {
        uid: result.user.uid,
        email: result.user.email,
        ...userData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      // Check if should be admin (based on email list)
      if (ADMIN_EMAILS.includes(email)) {
        await checkAndCreateAdmin(result.user);
      }
      
      toast.success('Registration successful');
      return result.user;
      
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setIsAdmin(false);
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    isAdmin,
    login,
    register,
    logout,
    forceCreateAdmin,
    ADMIN_EMAILS
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};