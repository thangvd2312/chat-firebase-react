import { db } from "@/firebase/config";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export const addDocument = async (collectionName, data) => {
  const docRef = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp()
  });
  return docRef;
};

export const generateKeywords = (displayName) => {
  const name = displayName.split(' ').filter(Boolean); // Lọc bỏ các chuỗi rỗng
  let result = [];
  
  // Hàm hoán vị tạo ra các chuỗi sắp xếp khác nhau
  const permute = (arr, m = []) => {
    if (arr.length === 0) result.push(m.join(' '));
    else {
      arr.forEach((_, i) => {
        let cur = [...arr];
        let next = cur.splice(i, 1);
        permute(cur, m.concat(next));
      });
    }
  };

  permute(name); // Tạo tất cả các hoán vị

  // Hàm tạo các từ khóa từ một chuỗi
  const createKeywords = (name) => name.split('').map((_, i) => name.slice(0, i + 1));

  // Tạo từ khóa từ tất cả hoán vị và trả về kết quả
  return result.reduce((acc, cur) => [...acc, ...createKeywords(cur)], []);
};
