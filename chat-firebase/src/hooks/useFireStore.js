import { db } from '@/firebase/config';

import React, { useState, useEffect } from 'react';

import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';

const useFirestore = (collectionName, condition) => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    // chú ý khi bạn sử dụng query bạn điền vào fieldname ('createdAt') phải có trong data room, 
    // k thì nó sẽ die, vì k thực hiện được query
    let collectionRef = query(
      collection(db, collectionName), 
      orderBy('createdAt')
    );

    if (condition) {
      if (!condition.compareValue || !condition.compareValue.length) {
        setDocuments([]);
        return;
      }

      collectionRef = query(
        collectionRef, 
        where(condition.fieldName, condition.operator, condition.compareValue)
      );
    }

    const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
      const documents = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      setDocuments(documents);
    });

    return () => unsubscribe();
  }, [collectionName, condition]);

  return documents;
};

export default useFirestore;
