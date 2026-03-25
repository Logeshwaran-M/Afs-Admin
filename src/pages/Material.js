import React, { useState, useEffect } from "react";
import { db } from "../firebase/config";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

function Material() {
  const [materials, setMaterials] = useState([]);
  const [material, setMaterial] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // 🔄 Fetch Materials
  useEffect(() => {
    const q = query(collection(db, "materials"), orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((doc) => {
        const docData = doc.data();
        return {
          id: doc.id,
          material: docData.material || "",
          createdAt: docData.createdAt || new Date(),
          ...docData
        };
      });
      setMaterials(data);
    });

    return () => unsub();
  }, []);

  // ➕ Add / Update
  const handleSubmit = async () => {
    if (!material.trim()) return alert("Enter material name");

    try {
      setLoading(true);

      if (editId) {
        await updateDoc(doc(db, "materials", editId), {
          material: material.trim(),
        });
      } else {
        await addDoc(collection(db, "materials"), {
          material: material.trim(),
          createdAt: new Date(),
        });
      }

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      resetForm();
    } catch (err) {
      console.log(err);
      alert("Error saving material");
    } finally {
      setLoading(false);
    }
  };

  // ❌ Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this material?")) return;
    await deleteDoc(doc(db, "materials", id));
  };

  // ✏️ Edit
  const handleEdit = (item) => {
    setMaterial(item.material);
    setEditId(item.id);
    setShowInput(true);
  };

  // 🔄 Reset
  const resetForm = () => {
    setMaterial("");
    setEditId(null);
    setShowInput(false);
  };

  // Format date safely
  const formatDate = (timestamp) => {
    if (!timestamp) return "Just now";
    try {
      if (timestamp.toDate) {
        return timestamp.toDate().toLocaleString();
      }
      if (timestamp instanceof Date) {
        return timestamp.toLocaleString();
      }
      return "Recently added";
    } catch {
      return "Recently added";
    }
  };

  // Get first letter safely
  const getFirstLetter = (str) => {
    if (!str || typeof str !== 'string') return "?";
    return str.charAt(0).toUpperCase();
  };

  const totalMaterials = materials.length;

  // 🎨 Clean White UI Styles (matching Design component)
  const styles = {
    container: {
      padding: "40px 30px",
      minHeight: "100vh",
      background: "#f8fafc",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      maxWidth: "1200px",
      margin: "0 auto 30px",
    },
    headerLeft: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    title: {
      fontSize: "1.8rem",
      fontWeight: "600",
      color: "#0f172a",
      margin: 0,
    },
    titleIcon: {
      fontSize: "2rem",
    },
    badge: {
      background: "#e2e8f0",
      color: "#475569",
      padding: "4px 10px",
      borderRadius: "20px",
      fontSize: "0.85rem",
      fontWeight: "500",
    },
    addButton: {
      background: "#3b82f6",
      color: "white",
      padding: "12px 24px",
      border: "none",
      borderRadius: "10px",
      cursor: "pointer",
      fontWeight: "500",
      fontSize: "0.95rem",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      transition: "all 0.2s ease",
      boxShadow: "0 2px 4px rgba(59, 130, 246, 0.1)",
    },
    buttonIcon: {
      fontSize: "1.2rem",
    },
    // Stats Cards
    statsContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "20px",
      maxWidth: "1200px",
      margin: "0 auto 30px",
    },
    statCard: {
      background: "white",
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
      border: "1px solid #e2e8f0",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
    },
    statLabel: {
      fontSize: "0.9rem",
      color: "#64748b",
      marginBottom: "8px",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
    statValue: {
      fontSize: "1.8rem",
      fontWeight: "600",
      color: "#0f172a",
      margin: 0,
    },
    statChange: {
      fontSize: "0.85rem",
      color: "#10b981",
      marginTop: "4px",
    },
    // Input Section
    inputSection: {
      maxWidth: "600px",
      margin: "20px auto 30px",
      background: "white",
      borderRadius: "16px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
      border: "1px solid #e2e8f0",
      overflow: "hidden",
    },
    inputHeader: {
      padding: "16px 20px",
      background: "#f8fafc",
      borderBottom: "1px solid #e2e8f0",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    inputTitle: {
      fontSize: "1rem",
      fontWeight: "600",
      color: "#0f172a",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    inputTitleIcon: {
      color: "#3b82f6",
    },
    closeButton: {
      background: "none",
      border: "none",
      width: "32px",
      height: "32px",
      borderRadius: "8px",
      color: "#64748b",
      fontSize: "1.2rem",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.2s ease",
    },
    inputBody: {
      padding: "20px",
    },
    inputWrapper: {
      marginBottom: "16px",
    },
    label: {
      display: "block",
      marginBottom: "8px",
      fontSize: "0.9rem",
      fontWeight: "500",
      color: "#334155",
    },
    input: {
      width: "100%",
      padding: "12px 14px",
      border: "1.5px solid #e2e8f0",
      borderRadius: "10px",
      fontSize: "0.95rem",
      transition: "all 0.2s ease",
      outline: "none",
      fontFamily: "inherit",
    },
    inputHint: {
      fontSize: "0.85rem",
      color: "#94a3b8",
      marginTop: "6px",
    },
    buttonGroup: {
      display: "flex",
      gap: "12px",
      justifyContent: "flex-end",
      marginTop: "20px",
    },
    primaryButton: {
      background: "#3b82f6",
      color: "white",
      padding: "10px 20px",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "500",
      fontSize: "0.95rem",
      transition: "all 0.2s ease",
      minWidth: "100px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
    },
    primaryButtonDisabled: {
      background: "#94a3b8",
      cursor: "not-allowed",
    },
    secondaryButton: {
      background: "white",
      color: "#64748b",
      padding: "10px 20px",
      border: "1.5px solid #e2e8f0",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "500",
      fontSize: "0.95rem",
      transition: "all 0.2s ease",
    },
    // Grid Layout
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "20px",
      maxWidth: "1200px",
      margin: "25px auto 0",
    },
    // Cards
    card: {
      background: "white",
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
      border: "1px solid #e2e8f0",
      transition: "all 0.2s ease",
    },
    cardHeader: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      marginBottom: "12px",
    },
    materialIcon: {
      width: "40px",
      height: "40px",
      borderRadius: "10px",
      background: "linear-gradient(135deg, #3b82f6, #2563eb)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontSize: "1.2rem",
      fontWeight: "bold",
    },
    materialName: {
      fontSize: "1.1rem",
      fontWeight: "600",
      color: "#0f172a",
      margin: 0,
    },
    materialDate: {
      fontSize: "0.85rem",
      color: "#94a3b8",
      marginTop: "4px",
    },
    actions: {
      display: "flex",
      gap: "12px",
      marginTop: "16px",
      paddingTop: "16px",
      borderTop: "1px solid #e2e8f0",
    },
    edit: {
      color: "#3b82f6",
      cursor: "pointer",
      fontSize: "0.9rem",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      padding: "6px 12px",
      borderRadius: "6px",
      background: "#eff6ff",
      transition: "all 0.2s ease",
      border: "none",
    },
    del: {
      color: "#ef4444",
      cursor: "pointer",
      fontSize: "0.9rem",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      padding: "6px 12px",
      borderRadius: "6px",
      background: "#fef2f2",
      transition: "all 0.2s ease",
      border: "none",
    },
    // Empty State
    emptyState: {
      maxWidth: "600px",
      margin: "60px auto",
      textAlign: "center",
    },
    emptyIcon: {
      fontSize: "3rem",
      color: "#94a3b8",
      marginBottom: "16px",
      display: "block",
    },
    emptyTitle: {
      fontSize: "1.3rem",
      fontWeight: "600",
      color: "#334155",
      marginBottom: "8px",
    },
    emptyDescription: {
      fontSize: "0.95rem",
      color: "#64748b",
      lineHeight: "1.6",
    },
    // Toast
    toast: {
      position: "fixed",
      top: "20px",
      right: "20px",
      background: "#10b981",
      color: "white",
      padding: "12px 20px",
      borderRadius: "10px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
      zIndex: 1000,
      animation: "toastIn 0.3s ease",
      fontSize: "0.95rem",
      fontWeight: "500",
    },
    // Spinner
    spinner: {
      width: "18px",
      height: "18px",
      border: "2px solid rgba(255, 255, 255, 0.3)",
      borderRadius: "50%",
      borderTopColor: "white",
      animation: "spin 0.6s linear infinite",
      display: "inline-block",
    },
  };

  // Keyframes for animations
  const keyframes = `
    @keyframes toastIn {
      from {
        opacity: 0;
        transform: translateX(20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
    
    /* Desktop Responsive Media Queries */
    @media (min-width: 1440px) {
      .material-container {
        padding: 50px 80px !important;
      }
      .material-header, .material-stats, .material-grid {
        max-width: 1400px !important;
      }
      .material-grid {
        grid-template-columns: repeat(4, 1fr) !important;
      }
    }
    
    @media (min-width: 1200px) and (max-width: 1439px) {
      .material-grid {
        grid-template-columns: repeat(3, 1fr) !important;
      }
    }
    
    @media (min-width: 900px) and (max-width: 1199px) {
      .material-grid {
        grid-template-columns: repeat(2, 1fr) !important;
      }
    }
    
    @media (max-width: 768px) {
      .material-header {
        flex-direction: column !important;
        align-items: flex-start !important;
        gap: 15px !important;
      }
      .material-title {
        font-size: 1.5rem !important;
      }
      .material-add-button {
        width: 100% !important;
        justify-content: center !important;
      }
      .material-stats {
        grid-template-columns: 1fr !important;
      }
      .material-grid {
        grid-template-columns: 1fr !important;
      }
      .material-input-section {
        margin: 20px 10px !important;
      }
      .material-button-group {
        flex-direction: column !important;
      }
      .material-primary-button, .material-secondary-button {
        width: 100% !important;
      }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>
      <div className="material-container" style={styles.container}>
        {/* Success Toast */}
        {showSuccess && (
          <div style={styles.toast}>
            ✓ Material added successfully
          </div>
        )}

        {/* Header */}
        <div className="material-header" style={styles.header}>
          <div style={styles.headerLeft}>
            <span style={styles.titleIcon}>🧱</span>
            <div>
              <h1 className="material-title" style={styles.title}>Materials Studio</h1>
              <span style={styles.badge}>{totalMaterials} materials</span>
            </div>
          </div>
          <button
            className="material-add-button"
            style={styles.addButton}
            onClick={() => setShowInput(true)}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#2563eb";
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 4px 8px rgba(59, 130, 246, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#3b82f6";
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "0 2px 4px rgba(59, 130, 246, 0.1)";
            }}
          >
            <span style={styles.buttonIcon}>+</span>
            Add Material
          </button>
        </div>

        {/* Stats Cards */}
        <div className="material-stats" style={styles.statsContainer}>
          <div 
            style={styles.statCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.05)";
            }}
          >
            <div style={styles.statLabel}>
              <span>📊</span> Total Materials
            </div>
            <p style={styles.statValue}>{totalMaterials}</p>
            <div style={styles.statChange}>Active materials</div>
          </div>
          <div 
            style={styles.statCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.05)";
            }}
          >
            <div style={styles.statLabel}>
              <span>✅</span> In Stock
            </div>
            <p style={styles.statValue}>{totalMaterials}</p>
            <div style={styles.statChange}>Available now</div>
          </div>
          <div 
            style={styles.statCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.05)";
            }}
          >
            <div style={styles.statLabel}>
              <span>📦</span> Categories
            </div>
            <p style={styles.statValue}>3</p>
            <div style={styles.statChange}>Material types</div>
          </div>
        </div>

        {/* Input Form */}
        {showInput && (
          <div className="material-input-section" style={styles.inputSection}>
            <div style={styles.inputHeader}>
              <h3 style={styles.inputTitle}>
                <span style={styles.inputTitleIcon}>✏️</span>
                {editId ? "Edit Material" : "Add New Material"}
              </h3>
              <button
                style={styles.closeButton}
                onClick={resetForm}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#e2e8f0";
                  e.currentTarget.style.color = "#0f172a";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "none";
                  e.currentTarget.style.color = "#64748b";
                }}
              >
                ✕
              </button>
            </div>
            <div style={styles.inputBody}>
              <div style={styles.inputWrapper}>
                <label style={styles.label}>Material Name</label>
                <input
                  style={styles.input}
                  placeholder="e.g., Wood, Metal, Plastic, Glass..."
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#3b82f6";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#e2e8f0";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                  autoFocus
                />
                <div style={styles.inputHint}>
                  {material.length > 0 ? `${material.length} characters` : "Enter a material name"}
                </div>
              </div>
              <div className="material-button-group" style={styles.buttonGroup}>
                <button
                  className="material-secondary-button"
                  style={styles.secondaryButton}
                  onClick={resetForm}
                  disabled={loading}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.background = "#f8fafc";
                      e.currentTarget.style.borderColor = "#cbd5e1";
                      e.currentTarget.style.color = "#334155";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.currentTarget.style.background = "white";
                      e.currentTarget.style.borderColor = "#e2e8f0";
                      e.currentTarget.style.color = "#64748b";
                    }
                  }}
                >
                  Cancel
                </button>
                <button
                  className="material-primary-button"
                  style={{
                    ...styles.primaryButton,
                    ...((loading || !material.trim()) ? styles.primaryButtonDisabled : {}),
                  }}
                  onClick={handleSubmit}
                  disabled={loading || !material.trim()}
                  onMouseEnter={(e) => {
                    if (!loading && material.trim()) {
                      e.currentTarget.style.background = "#2563eb";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading && material.trim()) {
                      e.currentTarget.style.background = "#3b82f6";
                    }
                  }}
                >
                  {loading ? (
                    <>
                      <span style={styles.spinner}></span>
                      Saving...
                    </>
                  ) : (
                    editId ? "Update Material" : "Save Material"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Materials Grid */}
        {materials.length > 0 ? (
          <div className="material-grid" style={styles.grid}>
            {materials.map((item) => (
              <div
                key={item.id}
                style={styles.card}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.05)";
                  e.currentTarget.style.borderColor = "#cbd5e1";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.05)";
                  e.currentTarget.style.borderColor = "#e2e8f0";
                }}
              >
                <div style={styles.cardHeader}>
                  <div style={styles.materialIcon}>
                    {getFirstLetter(item.material)}
                  </div>
                  <div>
                    <h4 style={styles.materialName}>{item.material || "Unnamed Material"}</h4>
                    <p style={styles.materialDate}>
                      {formatDate(item.createdAt)}
                    </p>
                  </div>
                </div>
                <div style={styles.actions}>
                  <button
                    style={styles.edit}
                    onClick={() => handleEdit(item)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#dbeafe";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#eff6ff";
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    style={styles.del}
                    onClick={() => handleDelete(item.id)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#fee2e2";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#fef2f2";
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !showInput && (
            <div style={styles.emptyState}>
              <span style={styles.emptyIcon}>🧱</span>
              <h3 style={styles.emptyTitle}>No materials yet</h3>
              <p style={styles.emptyDescription}>
                Click the "Add Material" button to add your first material.
              </p>
            </div>
          )
        )}
      </div>
    </>
  );
}

export default Material;