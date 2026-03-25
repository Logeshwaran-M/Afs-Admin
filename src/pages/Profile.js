import React, { useState, useEffect } from 'react';
import { useFirebase } from '../context/FirebaseContext';
import toast from 'react-hot-toast';
import { db, storage } from '../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updatePassword } from 'firebase/auth';

const Profile = () => {
  const { user } = useFirebase();

  const [settings, setSettings] = useState({
    adminName: '',
    siteName: 'AFS Admin',
    emailNotifications: true,
    orderAlerts: true,
    lowStockAlerts: true,
    profileImage: ''
  });

  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchSettings();
    }
  }, [user]);

  const fetchSettings = async () => {
    try {
      const docRef = doc(db, "adminSettings", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setSettings(docSnap.data());
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      setLoading(true);

      const storageRef = ref(storage, `adminProfile/${user.uid}`);
      await uploadBytes(storageRef, file);

      const url = await getDownloadURL(storageRef);

      setSettings((prev) => ({
        ...prev,
        profileImage: url
      }));

      toast.success("Profile image uploaded");

    } catch (error) {
      toast.error("Image upload failed");
    }

    setLoading(false);
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const docRef = doc(db, "adminSettings", user.uid);

      await setDoc(docRef, settings);

      toast.success('Settings saved successfully');

    } catch (error) {
      toast.error("Failed to save settings");
    }

    setLoading(false);
  };

  const handlePasswordChange = async () => {
    if (!password) {
      toast.error("Enter new password");
      return;
    }

    try {
      await updatePassword(user, password);
      toast.success("Password updated");
      setPassword('');

    } catch (error) {
      toast.error("Password update failed");
    }
  };

  return (
    <div className="settings-page">

      <h1>Admin Profile</h1>

      <div className="settings-grid">

        <div className="settings-card">
          <h3>Profile Image</h3>

          {settings.profileImage && (
            <img
              src={settings.profileImage}
              alt="profile"
              style={{ width: "120px", borderRadius: "50%" }}
            />
          )}

          <input type="file" onChange={handleImageUpload} />

        </div>

        <div className="settings-card">

          <h3>General Settings</h3>

          <div className="form-group">
            <label>Admin Name</label>
            <input
              type="text"
              name="adminName"
              value={settings.adminName}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Site Name</label>
            <input
              type="text"
              name="siteName"
              value={settings.siteName}
              onChange={handleChange}
            />
          </div>

        </div>

        <div className="settings-card">

          <h3>Notifications</h3>

          <div className="checkbox-group">

            <label>
              <input
                type="checkbox"
                name="emailNotifications"
                checked={settings.emailNotifications}
                onChange={handleChange}
              />
              Email Notifications
            </label>

            <label>
              <input
                type="checkbox"
                name="orderAlerts"
                checked={settings.orderAlerts}
                onChange={handleChange}
              />
              New Order Alerts
            </label>

            <label>
              <input
                type="checkbox"
                name="lowStockAlerts"
                checked={settings.lowStockAlerts}
                onChange={handleChange}
              />
              Low Stock Alerts
            </label>

          </div>

        </div>

        <div className="settings-card">

          <h3>Admin Info</h3>

          <p><strong>Email:</strong> {user?.email}</p>

          <p><strong>Last Login:</strong> {user?.metadata?.lastSignInTime}</p>

        </div>

        <div className="settings-card">

          <h3>Change Password</h3>

          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={handlePasswordChange}>
            Update Password
          </button>

        </div>

      </div>

      <button
        onClick={handleSave}
        className="save-settings-btn"
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Settings"}
      </button>

    </div>
  );
};

export default Profile;