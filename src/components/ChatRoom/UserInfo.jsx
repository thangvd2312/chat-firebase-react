import AddFriendModal from "@/components/ChatRoom/AddFriendModal";
import { AppContext } from "@/context/AppProvider";
import { AuthContext } from "@/context/AuthProvider";
import { auth, db } from "@/firebase/config";
import useOnlineStatus from "@/hooks/useOnlineStatus";
import { UserAddOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import { Avatar, Button, Tooltip, Typography } from "antd";
import { signOut } from "firebase/auth";
import {
  collection,
  deleteField,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useContext, useState } from "react";
import styled from "styled-components";
const WrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px 16px;

  .user-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .username {
    color: black;
    margin-left: 10px;
    display: flex;
    align-items: center;
  }

  .add-friend-button,
  .add-group-button {
    margin-left: 10px;
  }

  .logout-button {
    margin-left: auto;
  }
`;

const UserInfoStyled = styled.div`
  margin-bottom: 16px;
  text-align: center;

  .user-name {
    font-weight: bold;
    color: #ffffff;
  }

  .logout-button {
    background-color: #e74c3c;
    color: #fff;
    border: none;
    padding: 8px 16px;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.3s;
  }
`;

export default function UserInfo() {
  const {
    user: { displayName, photoURL, uid, providerId },
  } = useContext(AuthContext);
  const { clearState, setIsAddRoomVisible } = useContext(AppContext);
  const [isAddFriendModalVisible, setIsAddFriendModalVisible] = useState(false);
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
    <UserInfoStyled>
      <WrapperStyled>
        <div className="user-info">
          <Avatar src={photoURL}>
            {photoURL ? "" : displayName?.charAt(0)?.toUpperCase()}{" "}
          </Avatar>
          <div className="username">
            <Typography.Text>{displayName}</Typography.Text>
            <Tooltip title="Add Friend">
              <Button
                icon={<UserAddOutlined />}
                className="add-friend-button"
                onClick={() => setIsAddFriendModalVisible(true)}
              />
            </Tooltip>
            <Tooltip title="Add Group">
              <Button
                icon={<UsergroupAddOutlined />}
                className="add-group-button"
                onClick={() => setIsAddRoomVisible(true)}
              />
            </Tooltip>
          </div>
          <AddFriendModal
            isAddFriendModalVisible={isAddFriendModalVisible}
            setIsAddFriendModalVisible={setIsAddFriendModalVisible}
          />
          <Button
            onClick={() => {
              handleLogout();
              clearState();
            }}
            className="logout-button"
          >
            Logout
          </Button>
        </div>
      </WrapperStyled>
 
    </UserInfoStyled>
  );
}
