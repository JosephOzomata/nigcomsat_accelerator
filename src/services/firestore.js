import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

/* ---------- Single-document sections (hero, siteInfo) ---------- */

export const getSingleton = async (docName) => {
  const snap = await getDoc(doc(db, "siteContent", docName));
  return snap.exists() ? snap.data() : null;
};

export const saveSingleton = async (docName, data) => {
  await setDoc(
    doc(db, "siteContent", docName),
    { ...data, updatedAt: serverTimestamp() },
    { merge: true }
  );
};

export const subscribeSingleton = (docName, cb) => {
  return onSnapshot(doc(db, "siteContent", docName), (snap) => {
    cb(snap.exists() ? snap.data() : null);
  });
};

/* ---------- Collection sections (events, hackathons, mentors, portfolio) ---------- */

export const listCollection = async (colName) => {
  const snap = await getDocs(collection(db, colName));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const subscribeCollection = (colName, cb) => {
  return onSnapshot(collection(db, colName), (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
};

export const createItem = async (colName, data) => {
  return addDoc(collection(db, colName), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const updateItem = async (colName, id, data) => {
  return updateDoc(doc(db, colName, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const deleteItem = async (colName, id) => {
  return deleteDoc(doc(db, colName, id));
};