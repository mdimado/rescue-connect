import { useEffect, useState } from "react";
import { db } from "../firebase.config";
import { collection, onSnapshot, query, limit as firestoreLimit } from "firebase/firestore";

const useGetData = (collectionName, limit) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const collectionRef = collection(db, collectionName);

  useEffect(() => {
    const q = query(collectionRef, firestoreLimit(limit));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setData(fetchedData);
      setLoading(false);
    });

    return unsubscribe;
  }, [collectionRef, collectionName, limit]);

  return { data, loading };
};

export default useGetData;
