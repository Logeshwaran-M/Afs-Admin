// services/sizeService.js

import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase/config";

// 🔹 GET ALL SIZES
export const getAllSizes = async () => {
  const snapshot = await getDocs(collection(db, "sizes"));

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// 🔹 ADD SIZE
export const addSize = async (data) => {
  return await addDoc(collection(db, "sizes"), {
    ...data,
    createdAt: serverTimestamp()
  });
};

// 🔹 UPDATE SIZE
export const updateSize = async (id, data) => {
  const ref = doc(db, "sizes", id);
  return await updateDoc(ref, data);
};

// 🔹 DELETE SIZE
export const deleteSize = async (id) => {
  const ref = doc(db, "sizes", id);
  return await deleteDoc(ref);
};

// 🔥 GET SIZES BY CATEGORY (IMPORTANT FOR FRONTEND)
export const getSizesByCategory = async (categoryId) => {
  const q = query(
    collection(db, "sizes"),
    where("categoryId", "==", categoryId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};