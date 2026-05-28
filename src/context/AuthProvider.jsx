import { auth, db } from "@/firebase/config";

import { useHistory } from "react-router-dom";

import { createContext, useEffect, useState } from "react";

import { Spin } from "antd";
import { collection, onSnapshot, query, where } from "firebase/firestore";

export const AuthContext = createContext();
function AuthProvider({ children }) {
  const [user, setUser] = useState({});
  const history = useHistory();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const { email } = user;
        const userQuery = query(
          collection(db, "users"),
          where("email", "==", email)
        );
        const unsubscribeUser = onSnapshot(userQuery, (userSnapshot) => {
          if (!userSnapshot.empty) {
            const userDoc = userSnapshot.docs[0];
            const userData = userDoc.data();
            const {
              displayName,
              uid,
              photoURL,
              friends = [],
              providerId,
            } = userData;

            setUser({ displayName, email, uid, photoURL, friends, providerId });
            setIsLoading(false);
            history.push("/");
          } else {
            console.error("No user found with the given email.");
            setIsLoading(false);
            history.push("/login");
          }
        });

        return () => {
          unsubscribeUser();
        };
      } else {
        setUser({});
        setIsLoading(false);
        history.push("/login");
      }
    });

    return () => {
      unsubscribe();
    };
  }, [history]);
  return (
    <AuthContext.Provider value={{ user }}>
      {isLoading ? (
        <Spin
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
export default AuthProvider;
