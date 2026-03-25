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

function Shapes() {
  const [shapes, setShapes] = useState([]);
  const [shape, setShape] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "shapes"), orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snap) => {
      const shapesData = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          shape: data.shape || "",
          createdAt: data.createdAt || new Date(),
          ...data
        };
      });
      setShapes(shapesData);
    });

    return () => unsub();
  }, []);

  const handleSubmit = async () => {
    if (!shape.trim()) return alert("Enter shape name");

    try {
      setLoading(true);

      if (editId) {
        await updateDoc(doc(db, "shapes", editId), {
          shape: shape.trim(),
        });
      } else {
        await addDoc(collection(db, "shapes"), {
          shape: shape.trim(),
          createdAt: new Date(),
        });
      }

      resetForm();
    } catch (err) {
      console.log(err);
      alert("Error saving shape");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this shape?")) return;
    await deleteDoc(doc(db, "shapes", id));
  };

  const handleEdit = (item) => {
    if (item && item.shape) {
      setShape(item.shape);
      setEditId(item.id);
      setShowInput(true);
    }
  };

  const resetForm = () => {
    setShape("");
    setEditId(null);
    setShowInput(false);
  };

  // Format date safely
  const formatDate = (timestamp) => {
    if (!timestamp) return "Recently added";
    try {
      if (timestamp.toDate) {
        return timestamp.toDate().toLocaleDateString();
      }
      if (timestamp instanceof Date) {
        return timestamp.toLocaleDateString();
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

  // Clean White UI Styles with Responsive Design
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
    shapeIcon: {
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
    shapeName: {
      fontSize: "1.1rem",
      fontWeight: "600",
      color: "#0f172a",
      margin: 0,
    },
    shapeDate: {
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

  // Keyframes and Responsive Media Queries
  const keyframes = `
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
    
    /* Desktop Large (1440px and above) */
    @media (min-width: 1440px) {
      .shapes-container {
        padding: 50px 80px !important;
      }
      .shapes-header, .shapes-stats, .shapes-grid {
        max-width: 1400px !important;
      }
      .shapes-grid {
        grid-template-columns: repeat(4, 1fr) !important;
      }
    }
    
    /* Desktop Medium (1200px to 1439px) */
    @media (min-width: 1200px) and (max-width: 1439px) {
      .shapes-grid {
        grid-template-columns: repeat(3, 1fr) !important;
      }
    }
    
    /* Tablet Landscape (900px to 1199px) */
    @media (min-width: 900px) and (max-width: 1199px) {
      .shapes-grid {
        grid-template-columns: repeat(2, 1fr) !important;
      }
      .shapes-title {
        font-size: 1.6rem !important;
      }
    }
    
    /* Tablet Portrait (768px to 899px) */
    @media (min-width: 768px) and (max-width: 899px) {
      .shapes-header {
        flex-direction: column !important;
        align-items: flex-start !important;
        gap: 15px !important;
      }
      .shapes-add-button {
        width: 100% !important;
        justify-content: center !important;
      }
      .shapes-stats {
        grid-template-columns: repeat(2, 1fr) !important;
      }
      .shapes-grid {
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 15px !important;
      }
    }
    
    /* Mobile Large (425px to 767px) */
    @media (min-width: 425px) and (max-width: 767px) {
      .shapes-container {
        padding: 20px 15px !important;
      }
      .shapes-header {
        flex-direction: column !important;
        align-items: flex-start !important;
        gap: 15px !important;
        margin-bottom: 20px !important;
      }
      .shapes-title {
        font-size: 1.5rem !important;
      }
      .shapes-add-button {
        width: 100% !important;
        justify-content: center !important;
      }
      .shapes-stats {
        grid-template-columns: 1fr !important;
        gap: 12px !important;
        margin-bottom: 20px !important;
      }
      .shapes-grid {
        grid-template-columns: 1fr !important;
        gap: 15px !important;
        margin-top: 20px !important;
      }
      .shapes-input-section {
        margin: 15px 0 20px !important;
      }
      .shapes-button-group {
        flex-direction: column !important;
        gap: 10px !important;
      }
      .shapes-primary-button, .shapes-secondary-button {
        width: 100% !important;
      }
      .shapes-card {
        padding: 16px !important;
      }
    }
    
    /* Mobile Small (up to 424px) */
    @media (max-width: 424px) {
      .shapes-container {
        padding: 15px 12px !important;
      }
      .shapes-header {
        flex-direction: column !important;
        align-items: flex-start !important;
        gap: 12px !important;
        margin-bottom: 15px !important;
      }
      .shapes-title {
        font-size: 1.3rem !important;
      }
      .shapes-title-icon {
        font-size: 1.6rem !important;
      }
      .shapes-badge {
        font-size: 0.75rem !important;
        padding: 3px 8px !important;
      }
      .shapes-add-button {
        width: 100% !important;
        justify-content: center !important;
        padding: 10px 20px !important;
        font-size: 0.9rem !important;
      }
      .shapes-stats {
        grid-template-columns: 1fr !important;
        gap: 10px !important;
        margin-bottom: 15px !important;
      }
      .shapes-stat-card {
        padding: 15px !important;
      }
      .shapes-stat-value {
        font-size: 1.5rem !important;
      }
      .shapes-grid {
        grid-template-columns: 1fr !important;
        gap: 12px !important;
        margin-top: 15px !important;
      }
      .shapes-input-section {
        margin: 10px 0 15px !important;
      }
      .shapes-input-header {
        padding: 12px 16px !important;
      }
      .shapes-input-title {
        font-size: 0.95rem !important;
      }
      .shapes-input-body {
        padding: 16px !important;
      }
      .shapes-input {
        padding: 10px 12px !important;
        font-size: 0.9rem !important;
      }
      .shapes-button-group {
        flex-direction: column !important;
        gap: 8px !important;
      }
      .shapes-primary-button, .shapes-secondary-button {
        width: 100% !important;
        padding: 10px !important;
        font-size: 0.9rem !important;
      }
      .shapes-card {
        padding: 15px !important;
      }
      .shapes-card-header {
        gap: 10px !important;
      }
      .shapes-shape-icon {
        width: 35px !important;
        height: 35px !important;
        font-size: 1rem !important;
      }
      .shapes-shape-name {
        font-size: 1rem !important;
      }
      .shape-shape-date {
        font-size: 0.75rem !important;
      }
      .shapes-actions {
        gap: 8px !important;
        margin-top: 12px !important;
        padding-top: 12px !important;
      }
      .shapes-edit, .shapes-del {
        padding: 4px 10px !important;
        font-size: 0.85rem !important;
      }
      .shapes-empty-state {
        margin: 40px auto !important;
      }
      .shapes-empty-icon {
        font-size: 2.5rem !important;
      }
      .shapes-empty-title {
        font-size: 1.2rem !important;
      }
      .shapes-empty-description {
        font-size: 0.9rem !important;
      }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>
      <div className="shapes-container" style={styles.container}>
        {/* Header */}
        <div className="shapes-header" style={styles.header}>
          <div style={styles.headerLeft}>
            <span className="shapes-title-icon" style={styles.titleIcon}>🔷</span>
            <div>
              <h1 className="shapes-title" style={styles.title}>Shapes Studio</h1>
              <span className="shapes-badge" style={styles.badge}>{shapes.length} shapes</span>
            </div>
          </div>
          <button
            className="shapes-add-button"
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
            Add Shape
          </button>
        </div>

        {/* Stats Cards */}
        <div className="shapes-stats" style={styles.statsContainer}>
          <div 
            className="shapes-stat-card"
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
              <span>📊</span> Total Shapes
            </div>
            <p className="shapes-stat-value" style={styles.statValue}>{shapes.length}</p>
            <div style={styles.statChange}>Active shapes</div>
          </div>
          <div 
            className="shapes-stat-card"
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
              <span>🆕</span> Recently Added
            </div>
            <p className="shapes-stat-value" style={styles.statValue}>
              {shapes.length > 0 ? "New" : "0"}
            </p>
            <div style={styles.statChange}>Last 7 days</div>
          </div>
          <div 
            className="shapes-stat-card"
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
              <span>✅</span> Ready to Use
            </div>
            <p className="shapes-stat-value" style={styles.statValue}>{shapes.length}</p>
            <div style={styles.statChange}>Available shapes</div>
          </div>
        </div>

        {/* Input Form */}
        {showInput && (
          <div className="shapes-input-section" style={styles.inputSection}>
            <div className="shapes-input-header" style={styles.inputHeader}>
              <h3 className="shapes-input-title" style={styles.inputTitle}>
                <span style={styles.inputTitleIcon}>✏️</span>
                {editId ? "Edit Shape" : "Create New Shape"}
              </h3>
              <button
                className="shapes-close-button"
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
            <div className="shapes-input-body" style={styles.inputBody}>
              <div style={styles.inputWrapper}>
                <label style={styles.label}>Shape Name</label>
                <input
                  className="shapes-input"
                  style={styles.input}
                  placeholder="e.g., Circle, Square, Triangle..."
                  value={shape}
                  onChange={(e) => setShape(e.target.value)}
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
                  {shape.length > 0 ? `${shape.length} characters` : "Enter a shape name"}
                </div>
              </div>
              <div className="shapes-button-group" style={styles.buttonGroup}>
                <button
                  className="shapes-secondary-button"
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
                  className="shapes-primary-button"
                  style={{
                    ...styles.primaryButton,
                    ...((loading || !shape.trim()) ? { background: "#94a3b8", cursor: "not-allowed" } : {}),
                  }}
                  onClick={handleSubmit}
                  disabled={loading || !shape.trim()}
                  onMouseEnter={(e) => {
                    if (!loading && shape.trim()) {
                      e.currentTarget.style.background = "#2563eb";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading && shape.trim()) {
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
                    editId ? "Update Shape" : "Save Shape"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Shapes Grid */}
        {shapes.length > 0 ? (
          <div className="shapes-grid" style={styles.grid}>
            {shapes.map((item) => (
              <div
                key={item.id}
                className="shapes-card"
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
                <div className="shapes-card-header" style={styles.cardHeader}>
                  <div className="shapes-shape-icon" style={styles.shapeIcon}>
                    {getFirstLetter(item.shape)}
                  </div>
                  <div>
                    <h4 className="shapes-shape-name" style={styles.shapeName}>{item.shape || "Unnamed Shape"}</h4>
                    <p className="shapes-shape-date" style={styles.shapeDate}>
                      {formatDate(item.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="shapes-actions" style={styles.actions}>
                  <button
                    className="shapes-edit"
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
                    className="shapes-del"
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
          // Empty State
          <div className="shapes-empty-state" style={styles.emptyState}>
            <span className="shapes-empty-icon" style={styles.emptyIcon}>🔷</span>
            <h3 className="shapes-empty-title" style={styles.emptyTitle}>No shapes yet</h3>
            <p className="shapes-empty-description" style={styles.emptyDescription}>
              Click the "Add Shape" button to create your first shape.
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default Shapes;