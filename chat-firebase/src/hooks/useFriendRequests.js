import { db } from '@/firebase/config';

import { useEffect, useState } from 'react';

import { collection, query, where, onSnapshot } from "firebase/firestore";

function useFriendRequests(userID, direction = "from") {
  const [requests, setRequests] = useState([]);
  useEffect(() => {
    const field = direction === "to" ? "to" : "from";
    const q = query(
      collection(db, "friend_requests"),
      where(field, "==", userID)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const requests = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setRequests(requests);
    });

    return () => unsubscribe();
  }, [userID, direction]);

  return requests;
}

export default useFriendRequests;