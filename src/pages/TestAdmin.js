import React, { useState, useEffect } from 'react';
import { useFirebase } from '../context/FirebaseContext';
import { useAdmin } from '../context/AdminContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { FaCheckCircle, FaTimesCircle, FaUserShield } from 'react-icons/fa';
import './TestAdmin.css'; // Create this CSS file

const TestAdmin = () => {
  const { user, isAdmin, ADMIN_EMAILS, loading: authLoading } = useFirebase();
  const { adminList, loading: adminLoading } = useAdmin();
  const [firestoreData, setFirestoreData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkFirestore();
  }, []);

  const checkFirestore = async () => {
    try {
      // Check admins collection
      const adminsSnap = await getDocs(collection(db, 'admins'));
      const admins = [];
      adminsSnap.forEach(doc => {
        admins.push({ id: doc.id, ...doc.data() });
      });
      setFirestoreData(admins);
    } catch (error) {
      console.error('Error checking firestore:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || adminLoading || loading) {
    return (
      <div className="test-admin-container">
        <div className="loading-spinner"></div>
        <p>Loading admin data...</p>
      </div>
    );
  }

  return (
    <div className="test-admin-container">
      <h1>🔐 Admin Verification Test</h1>
      
      {/* Admin Status Card */}
      <div className={`status-card ${isAdmin ? 'admin-true' : 'admin-false'}`}>
        <div className="status-icon">
          {isAdmin ? <FaCheckCircle /> : <FaTimesCircle />}
        </div>
        <div className="status-info">
          <h2>{isAdmin ? '✅ ADMIN ACCESS GRANTED' : '❌ NOT AN ADMIN'}</h2>
          <p>{isAdmin ? 'You have full admin privileges' : 'You cannot access admin panel'}</p>
        </div>
      </div>

      {/* User Information */}
      <div className="info-grid">
        <div className="info-card">
          <h3>👤 Current User</h3>
          <table className="info-table">
            <tbody>
              <tr>
                <td><strong>UID:</strong></td>
                <td className="uid-value">{user?.uid || 'Not logged in'}</td>
              </tr>
              <tr>
                <td><strong>Email:</strong></td>
                <td>{user?.email || 'Not logged in'}</td>
              </tr>
              <tr>
                <td><strong>Email Verified:</strong></td>
                <td>{user?.emailVerified ? '✅ Yes' : '❌ No'}</td>
              </tr>
              <tr>
                <td><strong>Last Login:</strong></td>
                <td>{user?.metadata?.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleString() : 'N/A'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="info-card">
          <h3>⚙️ Admin Configuration</h3>
          <table className="info-table">
            <tbody>
              <tr>
                <td><strong>Admin UID from Code:</strong></td>
                <td className="uid-value">
                  {user?.uid === "FfFp14OIWWOF6ErwKojThyzxCv13" ? (
                    <span style={{ color: 'green' }}>✅ MATCH</span>
                  ) : (
                    <span style={{ color: 'red' }}>❌ NO MATCH</span>
                  )}
                </td>
              </tr>
              <tr>
                <td><strong>Admin Status:</strong></td>
                <td>
                  <span className={`badge ${isAdmin ? 'badge-success' : 'badge-danger'}`}>
                    {isAdmin ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </td>
              </tr>
              <tr>
                <td><strong>Admin Emails List:</strong></td>
                <td>
                  <ul className="email-list">
                    {ADMIN_EMAILS?.map((email, index) => (
                      <li key={index}>
                        {email} 
                        {user?.email === email && ' 👈 Current'}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Collection Data */}
      <div className="info-card full-width">
        <h3>📁 Firestore - Admins Collection</h3>
        {firestoreData && firestoreData.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Document ID</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created At</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {firestoreData.map((admin) => (
                <tr key={admin.id}>
                  <td className="uid-value">{admin.id}</td>
                  <td>{admin.email}</td>
                  <td>{admin.role || 'admin'}</td>
                  <td>{admin.createdAt ? new Date(admin.createdAt).toLocaleString() : 'N/A'}</td>
                  <td>
                    <span className={`badge ${admin.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                      {admin.status || 'active'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-data">No admin documents found in Firestore</p>
        )}
      </div>

      {/* Admin Check Results */}
      <div className="info-card full-width">
        <h3>🔍 Admin Check Results</h3>
        <div className="check-results">
          <div className={`check-item ${user?.uid === "FfFp14OIWWOF6ErwKojThyzxCv13" ? 'pass' : 'fail'}`}>
            <span className="check-icon">{user?.uid === "FfFp14OIWWOF6ErwKojThyzxCv13" ? '✅' : '❌'}</span>
            <span className="check-label">Admin UID Match:</span>
            <span className="check-value">
              {user?.uid === "FfFp14OIWWOF6ErwKojThyzxCv13" ? 'PASS' : 'FAIL'}
            </span>
          </div>

          <div className={`check-item ${ADMIN_EMAILS?.includes(user?.email) ? 'pass' : 'fail'}`}>
            <span className="check-icon">{ADMIN_EMAILS?.includes(user?.email) ? '✅' : '❌'}</span>
            <span className="check-label">Admin Email List:</span>
            <span className="check-value">
              {ADMIN_EMAILS?.includes(user?.email) ? 'PASS' : 'FAIL'}
            </span>
          </div>

          <div className={`check-item ${firestoreData?.some(a => a.id === user?.uid) ? 'pass' : 'fail'}`}>
            <span className="check-icon">{firestoreData?.some(a => a.id === user?.uid) ? '✅' : '❌'}</span>
            <span className="check-label">Firestore Admin Doc:</span>
            <span className="check-value">
              {firestoreData?.some(a => a.id === user?.uid) ? 'PASS' : 'FAIL'}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button 
          className="btn-primary"
          onClick={() => window.location.href = '/dashboard'}
        >
          Go to Dashboard
        </button>
        <button 
          className="btn-secondary"
          onClick={() => window.location.href = '/admins'}
        >
          Manage Admins
        </button>
        <button 
          className="btn-test"
          onClick={() => window.location.reload()}
        >
          Refresh Test
        </button>
      </div>
    </div>
  );
};

export default TestAdmin;