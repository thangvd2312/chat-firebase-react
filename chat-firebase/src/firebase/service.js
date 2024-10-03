import { db } from "@/firebase/config";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export const addDocument = async (collectionName, data) => {
  const docRef = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp()
  });
  return docRef;
};
