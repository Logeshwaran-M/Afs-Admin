import React, { useEffect, useState } from 'react';
import { FaTrash, FaUserCog } from 'react-icons/fa';
import { getAllUsers, deleteUser, updateUserRole } from '../services/userService';
import Table from '../components/Table';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null, name: '' });
  const [roleModal, setRoleModal] = useState({ show: false, id: null, role: '' });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const data = await getAllUsers();
    setUsers(data);
    setLoading(false);
  };

  const handleDelete = async () => {
    await deleteUser(deleteModal.id);
    await loadUsers();
    setDeleteModal({ show: false, id: null, name: '' });
  };

  const handleRoleUpdate = async () => {
    await updateUserRole(roleModal.id, roleModal.role);
    await loadUsers();
    setRoleModal({ show: false, id: null, role: '' });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Phone', accessor: 'phone' },
    { header: 'Role', accessor: 'role' },
    { header: 'Joined', accessor: (row) => formatDate(row.createdAt) },
    {
      header: 'Actions',
      accessor: (row) => (
        <div className="action-buttons">
          <button 
            className="action-btn edit"
            onClick={() => setRoleModal({ show: true, id: row.id, role: row.role })}
          >
            <FaUserCog />
          </button>
          <button 
            className="action-btn delete"
            onClick={() => setDeleteModal({ show: true, id: row.id, name: row.name })}
          >
            <FaTrash />
          </button>
        </div>
      )
    }
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="users-page">
      <h1>Users</h1>
      
      <Table columns={columns} data={users} />

      {/* Delete Modal */}
      <Modal 
        isOpen={deleteModal.show} 
        onClose={() => setDeleteModal({ show: false, id: null, name: '' })}
        title="Delete User"
        size="small"
      >
        <p>Are you sure you want to delete <strong>{deleteModal.name}</strong>?</p>
        <div className="modal-actions">
          <button onClick={() => setDeleteModal({ show: false, id: null, name: '' })}>
            Cancel
          </button>
          <button onClick={handleDelete} className="delete-btn">
            Delete
          </button>
        </div>
      </Modal>

      {/* Role Modal */}
      <Modal 
        isOpen={roleModal.show} 
        onClose={() => setRoleModal({ show: false, id: null, role: '' })}
        title="Update User Role"
        size="small"
      >
        <select 
          value={roleModal.role} 
          onChange={(e) => setRoleModal({ ...roleModal, role: e.target.value })}
        >
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
        </select>
        <div className="modal-actions">
          <button onClick={() => setRoleModal({ show: false, id: null, role: '' })}>
            Cancel
          </button>
          <button onClick={handleRoleUpdate} className="save-btn">
            Update
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Users;