import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { uploadImageToS3 } from "../utils/s3Upload";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "firebase/firestore";

function Gallery() {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [gallery, setGallery] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch Images
  const fetchGallery = async () => {
    try {
      const snapshot = await getDocs(collection(db, "gallery"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setGallery(data);
    } catch (error) {
      console.error("Error fetching gallery:", error);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  // Handle image selection and preview
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    setImage(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  // Upload Image (S3)
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!image) {
      alert("Please select an image");
      return;
    }

    setUploading(true);

    try {
      const imageUrl = await uploadImageToS3(image);
      
      await addDoc(collection(db, "gallery"), {
        image: imageUrl,
        description: description || "No description provided",
        createdAt: new Date()
      });

      setImage(null);
      setDescription("");
      setPreviewUrl(null);
      
      document.getElementById('image-input').value = '';
      
      await fetchGallery();
      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // Delete Image
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      setDeletingId(id);
      try {
        await deleteDoc(doc(db, "gallery", id));
        await fetchGallery();
      } catch (error) {
        console.error("Delete error:", error);
        alert("Delete failed. Please try again.");
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div style={{
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "2rem",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif",
      backgroundColor: "#f8fafc",
      minHeight: "100vh"
    }}>
      {/* Header */}
      <div style={{
        textAlign: "center",
        marginBottom: "2.5rem"
      }}>
        <h1 style={{
          fontSize: "2.5rem",
          fontWeight: "700",
          margin: "0 0 0.5rem 0",
          background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text"
        }}>
          Gallery
        </h1>
        <p style={{
          fontSize: "1.1rem",
          color: "#64748b",
          margin: 0
        }}>
          Manage your image collection
        </p>
      </div>

      {/* Upload Card */}
      <div style={{
        background: "white",
        borderRadius: "16px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        padding: "2rem",
        marginBottom: "3rem"
      }}>
        <h2 style={{
          fontSize: "1.5rem",
          fontWeight: "600",
          color: "#1e293b",
          margin: "0 0 1.5rem 0"
        }}>
          Upload New Image
        </h2>
        
        <form onSubmit={handleUpload}>
          {/* File Input */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{
              display: "block",
              fontSize: "0.875rem",
              fontWeight: "500",
              color: "#475569",
              marginBottom: "0.5rem"
            }}>
              Select Image
            </label>
            <div style={{
              position: "relative"
            }}>
              <input
                id="image-input"
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                style={{
                  position: "absolute",
                  width: "1px",
                  height: "1px",
                  padding: 0,
                  margin: "-1px",
                  overflow: "hidden",
                  clip: "rect(0, 0, 0, 0)",
                  border: 0
                }}
              />
              <div
                onClick={() => document.getElementById('image-input').click()}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.75rem 1rem",
                  backgroundColor: "#f8fafc",
                  border: "2px dashed #cbd5e1",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#3b82f6";
                  e.currentTarget.style.backgroundColor = "#f0f9ff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#cbd5e1";
                  e.currentTarget.style.backgroundColor = "#f8fafc";
                }}
              >
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="#64748b" 
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span style={{ color: image ? "#1e293b" : "#64748b" }}>
                  {image ? image.name : "Choose an image..."}
                </span>
              </div>
            </div>
          </div>

          {/* Image Preview */}
          {previewUrl && (
            <div style={{
              marginBottom: "1.5rem",
              borderRadius: "8px",
              overflow: "hidden",
              border: "1px solid #e2e8f0"
            }}>
              <img 
                src={previewUrl} 
                alt="Preview" 
                style={{
                  width: "100%",
                  maxHeight: "300px",
                  objectFit: "contain",
                  backgroundColor: "#f8fafc"
                }}
              />
            </div>
          )}

          {/* Description Input */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{
              display: "block",
              fontSize: "0.875rem",
              fontWeight: "500",
              color: "#475569",
              marginBottom: "0.5rem"
            }}>
              Description
            </label>
            <textarea
              placeholder="Enter image description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "0.875rem",
                fontFamily: "inherit",
                resize: "vertical",
                outline: "none",
                transition: "border-color 0.2s ease"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#3b82f6";
                e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e2e8f0";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Upload Button */}
          <button 
            type="submit" 
            disabled={uploading}
            style={{
              width: "100%",
              padding: "0.75rem 1.5rem",
              backgroundColor: uploading ? "#94a3b8" : "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "500",
              cursor: uploading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              transition: "background-color 0.2s ease"
            }}
            onMouseEnter={(e) => {
              if (!uploading) {
                e.target.style.backgroundColor = "#2563eb";
              }
            }}
            onMouseLeave={(e) => {
              if (!uploading) {
                e.target.style.backgroundColor = "#3b82f6";
              }
            }}
          >
            {uploading ? (
              <>
                <span style={{
                  width: "20px",
                  height: "20px",
                  border: "2px solid white",
                  borderTopColor: "transparent",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite"
                }}></span>
                Uploading...
              </>
            ) : (
              'Upload Image'
            )}
          </button>
        </form>
      </div>

      {/* Gallery Grid */}
      <div>
        {gallery.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "4rem 2rem",
            background: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
          }}>
            <svg 
              width="64" 
              height="64" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="#cbd5e1" 
              strokeWidth="1"
              style={{ marginBottom: "1rem" }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              color: "#1e293b",
              margin: "0 0 0.5rem 0"
            }}>
              No images in gallery
            </h3>
            <p style={{
              color: "#64748b",
              margin: 0
            }}>
              Upload your first image to get started
            </p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1.5rem"
          }}>
            {gallery.map((item) => (
              <div
                key={item.id}
                style={{
                  background: "white",
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.02)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
                }}
              >
                <div style={{
                  position: "relative",
                  paddingTop: "66.67%", // 3:2 Aspect Ratio
                  overflow: "hidden"
                }}>
                  <img
                    src={item.image}
                    alt={item.description}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "scale(1)";
                    }}
                  />
                  
                  {/* Overlay with description and delete button */}
                  <div style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                    padding: "2rem 1rem 1rem 1rem",
                    opacity: 0,
                    transition: "opacity 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "0";
                  }}
                  >
                    <p style={{
                      color: "white",
                      fontSize: "0.875rem",
                      margin: "0 0 0.75rem 0",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical"
                    }}>
                      {item.description}
                    </p>
                    
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                      style={{
                        background: deletingId === item.id ? "#94a3b8" : "#ef4444",
                        color: "white",
                        border: "none",
                        padding: "0.5rem 1rem",
                        borderRadius: "6px",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        cursor: deletingId === item.id ? "not-allowed" : "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                        width: "auto",
                        transition: "background-color 0.2s ease"
                      }}
                      onMouseEnter={(e) => {
                        if (deletingId !== item.id) {
                          e.target.style.background = "#dc2626";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (deletingId !== item.id) {
                          e.target.style.background = "#ef4444";
                        }
                      }}
                    >
                      {deletingId === item.id ? (
                        <>
                          <span style={{
                            width: "16px",
                            height: "16px",
                            border: "2px solid white",
                            borderTopColor: "transparent",
                            borderRadius: "50%",
                            animation: "spin 1s linear infinite"
                          }}></span>
                          Deleting...
                        </>
                      ) : (
                        'Delete'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add keyframe animation for spinner */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default Gallery;