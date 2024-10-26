import { Modal, Input, Button, List, Avatar, Typography } from "antd";
import {
  CheckOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
  UserOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthProvider";
import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import useFriendRequests from "@/hooks/useFriendRequests";
const { Text } = Typography;

const ModalContent = styled.div`
  .user-list {
    margin-top: 16px;
  }

  .user-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .user-info {
    display: flex;
    align-items: center;
  }

  .user-avatar {
    margin-right: 8px;
  }

  .user-name {
    font-weight: bold;
  }

  .suggestion {
    color: gray;
  }

  .friend-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 150px;
    margin: 5px;
    transition: background-color 0.3s ease;
  }

  .send-request {
    background-color: #4caf50;
    border-color: #4caf50;
  }

  .send-request:hover {
    background-color: #ffffff;
    border-color: #ffffff;
  }

  .cancel-request {
    background-color: #f44336;
    border-color: #f44336;
  }

  .cancel-request:hover {
    background-color: red;
    border-color: red;
  }
`;

export default function AddFriendModal({
  isAddFriendModalVisible,
  setIsAddFriendModalVisible,
}) {
  const {
    user: { uid, friends },
  } = useContext(AuthContext);
  const [searchValue, setSearchValue] = useState("");
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const friendRequests = useFriendRequests(uid, 'from');
  const friendReceiver = useFriendRequests(uid, 'to');
  function resetSearch() {
    setSearchValue("");
    setSuggestedUsers([]);
  }
  const handleOk = () => {
    setIsAddFriendModalVisible(false);
    resetSearch();
  };

  const handleCancel = () => {
    setIsAddFriendModalVisible(false);
    resetSearch();
  };

  function handleSearch(e) {
    setSearchValue(e.target.value);
  }

  async function handleSendFriendRequest(userID) {
    try {
      await addDoc(collection(db, "friend_requests"), {
        from: uid,
        to: userID,
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error sending friend request: ", error);
    }
  }

  async function handleRejectFriendRequest(requestId) {
    try {
      await deleteDoc(doc(db, "friend_requests", requestId.id));
    } catch (error) {
      console.error("Error rejecting friend request: ", error);
    }
  }

  async function handleAcceptFriendRequest(requestId) {
    try {

      const friendRequestDoc = await getDoc(doc(db, "friend_requests", requestId.id));
      const friendRequestData = friendRequestDoc.data();
  
      const { from: user1Uid, to: user2Uid } = friendRequestData;

      const user1Query = query(collection(db, "users"), where("uid", "==", user1Uid));
      const user1Snapshot = await getDocs(user1Query);
      const user1Doc = user1Snapshot.docs[0];
  
      const user2Query = query(collection(db, "users"), where("uid", "==", user2Uid));
      const user2Snapshot = await getDocs(user2Query);
      const user2Doc = user2Snapshot.docs[0];
      if (user1Doc) {
        await updateDoc(user1Doc.ref, {
          friends: arrayUnion(user2Uid)
        });
      }
  
      if (user2Doc) {
        await updateDoc(user2Doc.ref, {
          friends: arrayUnion(user1Uid)
        });
      }
      await deleteDoc(doc(db, "friend_requests", requestId.id));
    } catch (error) {
      console.error("Error accepting friend request: ", error);
    }
    
  }

  useEffect(() => {
    if (!isAddFriendModalVisible) return;
    async function getUserSuggest() {
      const roomsQuery = query(
        collection(db, "rooms"),
        where("members", "array-contains", uid),
      );
      const roomsSnapshot = await getDocs(roomsQuery);
      const userIds = new Set();
      roomsSnapshot.forEach((doc) => {
        const roomData = doc.data();
        roomData.members.forEach((userId) => {
          if (userId !== uid && !friends.includes(userId)) {
            userIds.add(userId);
          }
        });
      });
      const queryCondition = searchValue?.length
        ? where("email", "==", searchValue)
        : where("uid", "in", Array.from(userIds));
      const usersQuery = query(collection(db, "users"), queryCondition);
      const usersSnapshot = await getDocs(usersQuery);
      const users = [];
      usersSnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      setSuggestedUsers(users);
      return;
    }
    getUserSuggest();
  }, [friends, isAddFriendModalVisible, searchValue, uid]);
  return (
    <Modal
      title="Add Friend"
      open={isAddFriendModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
      ]}
    >
      <ModalContent>
        <Input
          placeholder="Search email"
          prefix={<UserOutlined />}
          onChange={handleSearch}
          value={searchValue}
        />
        <div
          className="user-list"
          style={{ maxHeight: "300px", overflowY: "auto" }}
        >
          {suggestedUsers.length === 0 ? (
            <Text type="secondary">No recent searches</Text>
          ) : (
            <>
              <Text type="secondary">You may be familiar with</Text>
              <List
                dataSource={suggestedUsers}
                renderItem={(user) => {
                  const outgoingRequest = friendRequests.find(
                    (request) => request.to === user.uid && request.status === "pending" && request.from === uid
                  );
              
                  const incomingRequest = friendReceiver.find(
                    (request) => request.from === user.uid && request.status === "pending" && request.to === uid
                  );
                  return (
                    <div className="user-item">
                    <div className="user-info">
                      <Avatar className="user-avatar" src={user.photoURL} />
                      <div>
                        <div className="user-name">{user.displayName}</div>
                        <div className="suggestion">Friend suggestions</div>
                      </div>
                    </div>
                    {outgoingRequest ? (
                      <Button
                        className="friend-button cancel-request"
                        icon={<UserDeleteOutlined />}
                        onClick={() => handleRejectFriendRequest(outgoingRequest)}
                      >
                        Hủy lời mời
                      </Button>
                    ) : incomingRequest ? (
                      <Button
                        className="friend-button accept-request"
                        icon={<CheckOutlined />}
                        onClick={() => handleAcceptFriendRequest(incomingRequest)}
                      >
                        Chấp nhận
                      </Button>
                    ) : (
                      <Button
                        className="friend-button send-request"
                        icon={<UserAddOutlined />}
                        onClick={() => handleSendFriendRequest(user.uid)}
                      >
                        Kết bạn
                      </Button>
                    )}
                  </div>
                  );
                }}
              />
            </>
          )}
        </div>
      </ModalContent>
    </Modal>
  );
}
