import { AuthContext } from "@/context/AuthProvider";
import { auth, db } from "@/firebase/config";
import { Avatar, Button, Typography } from "antd";
import { signOut } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect } from "react";
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
    user: { displayName, photoURL },
  } = useContext(AuthContext);
  function handleLogout() {
    signOut(auth);
  }

  useEffect(() => {
    onSnapshot(collection(db, "users"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
    });
  }, []);
  return (
    <WrapperStyled>
      <div>
        <Avatar src={photoURL}>
          {photoURL ? "" : displayName?.charAt(0)?.toUpperCase()}{" "}
        </Avatar>
        <Typography.Text className="username">{displayName}</Typography.Text>
      </div>
      <Button ghost onClick={handleLogout}>
        Logout
      </Button>
    </WrapperStyled>
  );
}
