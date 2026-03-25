import React, { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";

function Design() {
  const [showInput, setShowInput] = useState(false);
  const [heading, setHeading] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [designs, setDesigns] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "design"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const docData = doc.data();
        return {
          id: doc.id,
          design: docData.design || "",
          createdAt: docData.createdAt || new Date(),
          ...docData
        };
      });
      setDesigns(data);
    });

    return () => unsubscribe();
  }, []);

  const handleAddClick = () => setShowInput(true);

  const handleSubmit = async () => {
    if (!heading.trim()) {
      alert("Please enter a heading");
      return;
    }

    try {
      setLoading(true);

      await addDoc(collection(db, "design"), {
        design: heading.trim(),
        createdAt: new Date(),
      });

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      setHeading("");
      setShowInput(false);
    } catch (error) {
      console.error(error);
      alert("Error adding design");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setHeading("");
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

  const totalDesigns = designs.length;

  // Clean White UI Styles with Desktop Responsiveness
  const styles = {
    container: {
      padding: "40px 30px",
      minHeight: "100vh",
      background: "#f8fafc",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    },
    // Desktop styles (1440px and above)
    '@media (min-width: 1440px)': {
      container: {
        padding: "50px 80px",
      },
      header: {
        maxWidth: "1400px",
      },
      statsContainer: {
        maxWidth: "1400px",
      },
      grid: {
        maxWidth: "1400px",
        gridTemplateColumns: "repeat(4, 1fr)",
      },
    },
    // Desktop styles (1200px to 1439px)
    '@media (min-width: 1200px) and (max-width: 1439px)': {
      grid: {
        gridTemplateColumns: "repeat(3, 1fr)",
      },
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
    designIcon: {
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
    designName: {
      fontSize: "1.1rem",
      fontWeight: "600",
      color: "#0f172a",
      margin: 0,
    },
    designDate: {
      fontSize: "0.85rem",
      color: "#94a3b8",
      marginTop: "4px",
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
      .design-container {
        padding: 50px 80px !important;
      }
      .design-header, .design-stats, .design-grid {
        max-width: 1400px !important;
      }
      .design-grid {
        grid-template-columns: repeat(4, 1fr) !important;
      }
    }
    
    @media (min-width: 1200px) and (max-width: 1439px) {
      .design-grid {
        grid-template-columns: repeat(3, 1fr) !important;
      }
    }
    
    @media (min-width: 900px) and (max-width: 1199px) {
      .design-grid {
        grid-template-columns: repeat(2, 1fr) !important;
      }
    }
    
    @media (max-width: 768px) {
      .design-header {
        flex-direction: column !important;
        align-items: flex-start !important;
        gap: 15px !important;
      }
      .design-title {
        font-size: 1.5rem !important;
      }
      .design-add-button {
        width: 100% !important;
        justify-content: center !important;
      }
      .design-stats {
        grid-template-columns: 1fr !important;
      }
      .design-grid {
        grid-template-columns: 1fr !important;
      }
      .design-input-section {
        margin: 20px 10px !important;
      }
      .design-button-group {
        flex-direction: column !important;
      }
      .design-primary-button, .design-secondary-button {
        width: 100% !important;
      }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>
      <div className="design-container" style={styles.container}>
        {/* Success Toast */}
        {showSuccess && (
          <div style={styles.toast}>
            ✓ Design added successfully
          </div>
        )}

        {/* Header */}
        <div className="design-header" style={styles.header}>
          <div style={styles.headerLeft}>
            <span style={styles.titleIcon}>🎨</span>
            <div>
              <h1 className="design-title" style={styles.title}>Design Studio</h1>
              <span style={styles.badge}>{totalDesigns} designs</span>
            </div>
          </div>
          <button
            className="design-add-button"
            style={styles.addButton}
            onClick={handleAddClick}
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
            New Design
          </button>
        </div>

        {/* Stats Cards */}
        <div className="design-stats" style={styles.statsContainer}>
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
              <span>📊</span> Total Designs
            </div>
            <p style={styles.statValue}>{totalDesigns}</p>
            <div style={styles.statChange}>Active designs</div>
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
              <span>✅</span> Published
            </div>
            <p style={styles.statValue}>{totalDesigns}</p>
            <div style={styles.statChange}>Ready to use</div>
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
              <span>⏳</span> In Progress
            </div>
            <p style={styles.statValue}>0</p>
            <div style={styles.statChange}>Awaiting completion</div>
          </div>
        </div>

        {/* Input Form */}
        {showInput && (
          <div className="design-input-section" style={styles.inputSection}>
            <div style={styles.inputHeader}>
              <h3 style={styles.inputTitle}>
                <span style={styles.inputTitleIcon}>✏️</span>
                Create New Design
              </h3>
              <button
                style={styles.closeButton}
                onClick={handleCancel}
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
                <label style={styles.label}>Design Heading</label>
                <input
                  style={styles.input}
                  placeholder="e.g., Mobile App UI, Website Redesign..."
                  value={heading}
                  onChange={(e) => setHeading(e.target.value)}
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
                  {heading.length > 0 ? `${heading.length} characters` : "Enter a design heading"}
                </div>
              </div>
              <div className="design-button-group" style={styles.buttonGroup}>
                <button
                  className="design-secondary-button"
                  style={styles.secondaryButton}
                  onClick={handleCancel}
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
                  className="design-primary-button"
                  style={{
                    ...styles.primaryButton,
                    ...((loading || !heading.trim()) ? styles.primaryButtonDisabled : {}),
                  }}
                  onClick={handleSubmit}
                  disabled={loading || !heading.trim()}
                  onMouseEnter={(e) => {
                    if (!loading && heading.trim()) {
                      e.currentTarget.style.background = "#2563eb";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading && heading.trim()) {
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
                    "Save Design"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Designs Grid */}
        {designs.length > 0 ? (
          <div className="design-grid" style={styles.grid}>
            {designs.map((item) => (
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
                  <div style={styles.designIcon}>
                    {getFirstLetter(item.design)}
                  </div>
                  <div>
                    <h4 style={styles.designName}>{item.design || "Untitled Design"}</h4>
                    <p style={styles.designDate}>
                      {formatDate(item.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !showInput && (
            <div style={styles.emptyState}>
              <span style={styles.emptyIcon}>🎨</span>
              <h3 style={styles.emptyTitle}>No designs yet</h3>
              <p style={styles.emptyDescription}>
                Click the "New Design" button to create your first design.
              </p>
            </div>
          )
        )}
      </div>
    </>
  );
}

export default Design;