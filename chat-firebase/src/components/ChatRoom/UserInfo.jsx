import { AppContext } from "@/context/AppProvider";
import { AuthContext } from "@/context/AuthProvider";
import { auth, db } from "@/firebase/config";
import useOnlineStatus from "@/hooks/useOnlineStatus";
import { Avatar, Button, Typography } from "antd";
import { signOut } from "firebase/auth";
import {
  collection,
  deleteField,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useContext } from "react";
import styled from "styled-components";
const WrapperStyled = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(82, 38, 83);

  .username {
    color: white;
    margin-left: 5px;
  }
`;
export default function UserInfo() {
  const {
    user: { displayName, photoURL, uid, providerId },
  } = useContext(AuthContext);
  const { clearState } = useContext(AppContext);
  useOnlineStatus();
  async function findUserByUidAndProviderId(uid, providerId) {
    const userQuery = query(
      collection(db, "users"),
      where("uid", "==", uid),
      where("providerId", "==", providerId)
    );
    const querySnapshot = await getDocs(userQuery);
    return querySnapshot;
  }

  async function handleLogout() {
    const querySnapshot = await findUserByUidAndProviderId(uid, providerId);
    querySnapshot.forEach(async (doc) => {
      await updateDoc(doc.ref, {
        isLoggedIn: false,
        lastLogin: deleteField(),
      });
      await signOut(auth);
    });
  }

  return (
    <WrapperStyled>
      <div>
        <Avatar src={photoURL}>
          {photoURL ? "" : displayName?.charAt(0)?.toUpperCase()}{" "}
        </Avatar>
        <Typography.Text className="username">{displayName}</Typography.Text>
      </div>
      <Button
        ghost
        onClick={() => {
          handleLogout();
          clearState();
        }}
      >
        Logout
      </Button>
    </WrapperStyled>
  );
}
