import React, { useEffect, useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { useFirebase } from '../context/FirebaseContext';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { FaUserPlus, FaTrash } from 'react-icons/fa';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminList = () => {
  const { checkAdminStatus } = useAdmin();
  const { forceCreateAdmin } = useFirebase();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ show: false, email: '' });

  // ✅ Define loadAdmins FIRST before using it
  const loadAdmins = async () => {
    setLoading(true);
    try {
      const adminsSnap = await getDocs(collection(db, 'admins'));
      const adminList = [];
      adminsSnap.forEach(doc => {
        adminList.push({ id: doc.id, ...doc.data() });
      });
      setAdmins(adminList);
    } catch (error) {
      console.error('Error loading admins:', error);
      toast.error('Failed to load admins');
    } finally {
      setLoading(false);
    }
  };

  // ✅ useEffect runs AFTER loadAdmins is defined
  useEffect(() => {
    loadAdmins();
  }, []);

  const handleAddAdmin = async () => {
    if (!modal.email) {
      toast.error('Enter email');
      return;
    }
    
    const success = await forceCreateAdmin(modal.email);
    if (success) {
      setModal({ show: false, email: '' });
      await loadAdmins(); // ✅ Now this works
      await checkAdminStatus();
    }
  };

  const handleRemoveAdmin = async (uid) => {
    if (window.confirm('Remove admin access?')) {
      try {
        await deleteDoc(doc(db, 'admins', uid));
        toast.success('Admin removed');
        await loadAdmins(); // ✅ Now this works
        await checkAdminStatus();
      } catch (error) {
        toast.error('Error removing admin');
      }
    }
  };

  const columns = [
    { header: 'Email', accessor: 'email' },
    { header: 'Role', accessor: 'role' },
    { 
      header: 'Created', 
      accessor: (row) => row.createdAt ? new Date(row.createdAt).toLocaleDateString() : 'N/A' 
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <button 
          className="action-btn delete"
          onClick={() => handleRemoveAdmin(row.id || row.uid)}
        >
          <FaTrash />
        </button>
      )
    }
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-list-page">
      <div className="page-header">
        <h1>Admin Users</h1>
        <button className="add-btn" onClick={() => setModal({ show: true, email: '' })}>
          <FaUserPlus /> Add Admin
        </button>
      </div>

      <Table columns={columns} data={admins} />

      <Modal 
        isOpen={modal.show} 
        onClose={() => setModal({ show: false, email: '' })}
        title="Add Admin"
      >
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={modal.email}
            onChange={(e) => setModal({ ...modal, email: e.target.value })}
            placeholder="Enter user email"
          />
        </div>
        <div className="modal-actions">
          <button onClick={() => setModal({ show: false, email: '' })}>Cancel</button>
          <button onClick={handleAddAdmin} className="save-btn">Add Admin</button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminList;