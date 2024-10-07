import { auth } from "@/firebase/config";

import { useHistory } from "react-router-dom";

import { createContext, useEffect, useState } from "react";

import { Spin } from "antd";

export const AuthContext = createContext();
function AuthProvider({ children }) {
  const [user, setUser] = useState({});
  const history = useHistory();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const { providerId } = user.providerData.find(elm => elm.email === user.email);
        const { displayName, email, uid, photoURL } = user;
        setUser({ displayName, email, uid, photoURL, providerId });
        setIsLoading(false);
        history.push("/");
        return;
      }
      setUser({});
      setIsLoading(false);
      history.push("/login");
      return;
    });
    return () => {
      unsubscribe();
    };
  }, [history]);
  return (
    <AuthContext.Provider value={{ user }}>
      {isLoading ? <Spin style={{ position: 'fixed', inset: 0 }} /> : children}
    </AuthContext.Provider>
  );
}
export default AuthProvider;
