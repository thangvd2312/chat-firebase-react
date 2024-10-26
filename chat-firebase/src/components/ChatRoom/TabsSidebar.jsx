import { useContext, useEffect, useState } from "react";
import { Collapse, Typography, Badge, Tabs, Button } from "antd";
import { AppContext } from "@/context/AppProvider";
import styled from "styled-components";
import { AuthContext } from "@/context/AuthProvider";
import { getDatabase, onValue, ref } from "firebase/database";
import moment from "moment";
import FriendList from "@/components/ChatRoom/FriendList";
import {
  BellOutlined,
  CheckOutlined,
  TeamOutlined,
  UserDeleteOutlined,
  UserOutlined,
} from "@ant-design/icons";
import useFriendRequests from "@/hooks/useFriendRequests";
import { arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "@/firebase/config";
const { Panel } = Collapse;

const PanelStyled = styled(Panel)`
  &&& {
    .ant-collapse-content-box {
      padding: 0 40px;
    }

    .add-room {
      color: black;
      padding: 0;
    }
  }
`;

const LinkStyled = styled(Typography.Link)`
  &&& {
    display: block;
    margin-bottom: 5px;
    background-color: ${({ active }) =>
      active === "true" ? "#add8e6" : "transparent"};
    color: black;
    padding: 5px;
    border-radius: 4px;
    transition: background-color 0.3s;
  }
`;

const UserContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  margin-bottom: 5px;
  transition: background-color 0.3s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const UserName = styled(Typography.Text)`
  // color: white;
  margin-left: 8px;
`;

const TabStyled = styled.div`
  .ant-tabs-nav {
    margin-bottom: 16px;
  }

  .ant-tabs-tab-active {
    color: #3498db;
  }

  .ant-tabs-ink-bar {
    background-color: #3498db;
  }
`;

const FriendRequestContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  margin-bottom: 10px;
  background-color: #f9f9f9;
  transition: background-color 0.3s;

  &:hover {
    background-color: #e6f7ff;
  }
`;

const FriendName = styled.span`
  margin-left: 10px;
  font-weight: bold;
  color: #333;
  flex-grow: 1; /* Cho phép tên chiếm không gian còn lại */
  text-align: left; /* Căn trái cho tên */
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end; /* Căn phải cho các nút */
`;

const StyledButton = styled(Button)`
  margin-left: 5px;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
  transition: background-color 0.3s;

  &.cancel-request {
    background-color: #ff4d4f;
    color: white;

    &:hover {
      background-color: #ff7875;
    }
  }

  &.accept-request {
    background-color: #52c41a;
    color: white;

    &:hover {
      background-color: #73d13d;
    }
  }

  &.reject-request {
    background-color: #ff4d4f;
    color: white;

    &:hover {
      background-color: #ff7875;
    }
  }
`;


export default function TabsSidebar({ setIsSidebarOpen }) {
  const {
    rooms,
    selectedRoomId,
    setSelectedRoomId,
    members,
    selectedRoom,
    setSelectedFriendId,
  } = useContext(AppContext);
  const { user } = useContext(AuthContext);
  const [userStatuses, setUserStatuses] = useState({});
  const friendRequests = useFriendRequests(user.uid, "from");
  const friendReceiver = useFriendRequests(user.uid, "to");
  const [data, setData] = useState({});
  async function getUsersInfo(userIds) {
    if (userIds.length === 0) {
      setData({});
      return;
    }
    try {
      const q = query(collection(db, "users"), where("uid", "in", userIds));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userInfo = querySnapshot.docs.reduce((acc, doc) => {
          const data = doc.data();
          acc[data.uid] = { ...data };
          return acc;
        }, {});
        setData(userInfo);
      } else {
        setData({});
      }
    } catch (error) {
      console.error("Error getting user info: ", error);
    }
  }

  async function handleRejectFriendRequest(request) {
    try {
      await deleteDoc(doc(db, "friend_requests", request.id));
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
  
  const tabItems = [
    {
      key: "1",
      label: (
        <span>
          <UserOutlined /> Friends
        </span>
      ),
      children: <FriendList />,
    },
    {
      key: "2",
      label: (
        <span>
          <TeamOutlined /> All Rooms
        </span>
      ),
      children: (
        <Collapse ghost defaultActiveKey={["1", "2"]}>
          <PanelStyled header="All rooms" key="1">
            {rooms.map((room) => (
              <LinkStyled
                key={room.id}
                onClick={() => {
                  setSelectedRoomId(room.id);
                  setSelectedFriendId("");
                  setIsSidebarOpen(false);
                }}
                active={(room.id === selectedRoomId).toString()}
              >
                {room.name}
              </LinkStyled>
            ))}
          </PanelStyled>
          {selectedRoomId && (
            <PanelStyled
              header={
                <>
                  Friend in room: <strong>{selectedRoom?.name}</strong>
                </>
              }
              key="2"
            >
              {members.map((elm) => (
                <UserContainer key={elm.uid}>
                  <Badge
                    color={userStatuses[elm.uid]?.isOnline ? "green" : "gray"}
                    dot
                  />
                  <UserName>
                    {elm.displayName}{" "}
                    <span>{elm.uid === user.uid ? "(You)" : ""}</span>
                    {!userStatuses[elm.uid]?.isOnline && elm?.lastSeen && (
                      <span>
                        {" "}
                        - Offline:{" "}
                        {moment(
                          new Date(elm.lastSeen.seconds * 1000)
                        ).fromNow()}
                      </span>
                    )}
                  </UserName>
                </UserContainer>
              ))}
            </PanelStyled>
          )}
        </Collapse>
      ),
    },
    {
      key: "3",
      label: (
        <span>
          <BellOutlined style={{marginRight: 0}} /> Notifications
          {friendRequests.length + friendReceiver.length > 0 && (
            <span
              style={{ marginLeft: "5px", fontWeight: "bold", color: "red" }}
            >
              ({friendRequests.length + friendReceiver.length})
            </span>
          )}
        </span>
      ),
      children: (
        <>
          {friendRequests.map((elm, idx) => (
            <FriendRequestContainer key={"friendRequests" + idx}>
              <img src={data[elm.to]?.photoURL} width={30} alt="" />
              <FriendName>{data[elm.to]?.displayName}</FriendName>
              <StyledButton
                className="cancel-request"
                icon={<UserDeleteOutlined />}
                onClick={() => handleRejectFriendRequest(elm)}
              >
                Hủy lời mời
              </StyledButton>
            </FriendRequestContainer>
          ))}
          {friendReceiver.map((elm, idx) => (
            <FriendRequestContainer key={"friendReceiver" + idx}>
              <FriendName>{data[elm.from]?.displayName}</FriendName>
              <ButtonContainer>
                <StyledButton
                  className="accept-request"
                  icon={<CheckOutlined />}
                  onClick={() => handleAcceptFriendRequest(elm)}
                >
                  Chấp nhận
                </StyledButton>
                <StyledButton
                  className="reject-request"
                  icon={<UserDeleteOutlined />}
                  onClick={() => handleRejectFriendRequest(elm)}
                >
                  Từ chối
                </StyledButton>
              </ButtonContainer>
            </FriendRequestContainer>
          ))}
        </>
      ),
    },
  ];
  useEffect(() => {
    const db = getDatabase();

    const statusRef = ref(db, "status");

    const unsubscribe = onValue(statusRef, (snapshot) => {
      if (snapshot.exists()) {
        setUserStatuses(snapshot.val());
      }
    });
    return () => unsubscribe();
  }, []);
  useEffect(() => {
    let data = [];
    for (const elm of [...friendRequests, ...friendReceiver]) {
      data = [...data, elm.from, elm.to];
    }
    getUsersInfo(data);
  }, [friendRequests, friendReceiver]);
  return (
    <TabStyled>
      <TabStyled>
        <Tabs defaultActiveKey="1" items={tabItems} />
      </TabStyled>
    </TabStyled>
  );
}
