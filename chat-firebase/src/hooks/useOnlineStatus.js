import { useEffect } from "react";

import { getDatabase, ref, onDisconnect, set } from "firebase/database";
import {
  getFirestore,
  doc,
  setDoc,
  query,
  collection,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const useOnlineStatus = () => {
  const db = getDatabase();
  const firestore = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;
  async function findUserByUidAndProviderId(uid, providerId) {
    const userQuery = query(
      collection(firestore, "users"),
      where("uid", "==", uid),
      where("providerId", "==", providerId)
    );
    const querySnapshot = await getDocs(userQuery);
    return querySnapshot;
  }

  const updateFirestoreLastSeen = async () => {
    const querySnapshot = await findUserByUidAndProviderId(
      user.uid,
      user.providerData[0].providerId
    );
    querySnapshot.forEach(async (doc) => {
      await updateDoc(doc.ref, {
        lastSeen: new Date(),
      });
    });
  };

  const areOtherTabsOpen = () => {
    const activeSessions = JSON.parse(
      localStorage.getItem("activeSessions") || "[]"
    );
    return activeSessions.length > 1;
  };

  useEffect(() => {
    if (user) {
      const statusRef = ref(db, `status/${user.uid}`);

      let sessionId = sessionStorage.getItem("sessionId");
      if (!sessionId) {
        sessionId = Date.now().toString();
        sessionStorage.setItem("sessionId", sessionId);
      }

      const activeSessions = JSON.parse(
        localStorage.getItem("activeSessions") || "[]"
      );
      if (!activeSessions.includes(sessionId)) {
        activeSessions.push(sessionId);
        localStorage.setItem("activeSessions", JSON.stringify(activeSessions));
      }

      onDisconnect(statusRef).set({ isOnline: false });

      set(statusRef, { isOnline: true });

      updateFirestoreLastSeen();

      function handleUserActivity() {
        set(statusRef, { isOnline: true });
      }

      function handleBeforeUnload() {
        const activeSessions = JSON.parse(
          localStorage.getItem("activeSessions") || "[]"
        );
        const updatedSessions = activeSessions.filter((id) => id !== sessionId);
        localStorage.setItem("activeSessions", JSON.stringify(updatedSessions));

        if (updatedSessions.length === 0) {
          set(statusRef, { isOnline: false });
        }
      }

      function handleBlur() {
        if (!areOtherTabsOpen()) {
          set(statusRef, { isOnline: false });
        }
      }
      window.addEventListener("beforeunload", handleBeforeUnload);
      window.addEventListener("blur", handleBlur);
      window.addEventListener("mousemove", handleUserActivity);
      window.addEventListener("mousedown", handleUserActivity);
      window.addEventListener("keydown", handleUserActivity);
      window.addEventListener("touchstart", handleUserActivity);
      return () => {
        set(statusRef, { isOnline: false });
        window.removeEventListener('blur', handleBlur);
        window.removeEventListener('beforeunload', handleBeforeUnload);
        window.removeEventListener('mousemove', handleUserActivity);
        window.removeEventListener('mousedown', handleUserActivity);
        window.removeEventListener('keydown', handleUserActivity);
        window.removeEventListener('touchstart', handleUserActivity);
      };
    }
  }, []);

  return null;
};

export default useOnlineStatus;
