import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFirebase } from '../context/FirebaseContext';
import { useAdmin } from '../context/AdminContext';
import { FaLock, FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const { login, logout } = useFirebase();
  const { ADMIN_USER_ID } = useAdmin();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const user = await login(formData.email, formData.password);
      
      console.log('🔍 User UID:', user.uid);
      console.log('🔍 Admin UID from code:', ADMIN_USER_ID);
      
      // Multiple admin check methods
      const adminEmails = ['afs_admin@gmail.com'];
      const isAdminByEmail = adminEmails.includes(user.email);
      const isAdminByUID = user.uid === ADMIN_USER_ID;
      
      console.log('🔍 Is Admin by Email:', isAdminByEmail);
      console.log('🔍 Is Admin by UID:', isAdminByUID);
      
      // Allow access if either condition is true
      if (isAdminByEmail || isAdminByUID) {
        console.log('✅ Admin access GRANTED');
        toast.success('Welcome Admin!');
        navigate('/dashboard');
      } else {
        console.log('❌ Admin access DENIED');
        toast.error('Access denied. Admin only.');
        await logout();
      }
      
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Admin Login</h2>
      
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label><FaEnvelope /> Email</label>
            <input
              type="email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label><FaLock /> Password</label>
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Checking...' : 'Login to Admin Panel'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;