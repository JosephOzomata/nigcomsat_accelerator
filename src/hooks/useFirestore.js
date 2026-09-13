// src/hooks/useFirestore.js
import { useEffect, useState } from "react";
import { doc, collection, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebase";

/**
 * Subscribe to a single document in the `siteContent` collection.
 * Example: useFirestoreDoc("hero")
 */
export const useFirestoreDoc = (docName) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!docName) return;
    const unsub = onSnapshot(
      doc(db, "siteContent", docName),
      (snap) => {
        setData(snap.exists() ? { id: snap.id, ...snap.data() } : null);
        setLoading(false);
      },
      (err) => {
        console.error(`useFirestoreDoc(${docName}):`, err);
        setError(err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [docName]);

  return { data, loading, error };
};

/**
 * Subscribe to a top-level collection.
 * Example: useFirestoreCollection("events")
 */
export const useFirestoreCollection = (colName) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!colName) return;
    const unsub = onSnapshot(
      collection(db, colName),
      (snap) => {
        setData(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        console.error(`useFirestoreCollection(${colName}):`, err);
        setError(err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [colName]);

  return { data, loading, error };
};