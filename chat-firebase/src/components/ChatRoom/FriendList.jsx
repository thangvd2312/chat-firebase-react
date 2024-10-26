import { useEffect, useState, useContext } from "react";
import { Typography, Badge } from "antd";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { getDatabase, ref, onValue } from "firebase/database";
import { AuthContext } from "@/context/AuthProvider";
import styled from "styled-components";
import { AppContext } from "@/context/AppProvider";

// Styled components
const FriendListContainer = styled.div`
  padding: 16px;
  border-radius: 8px;
`;

const FriendItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  padding: 8px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
`;

const FriendName = styled(Typography.Text)`
  margin-left: 8px;
  font-weight: 500;
  color: #333;
`;

export default function FriendList() {
  const [friends, setFriends] = useState([]);
  const [userStatuses, setUserStatuses] = useState({});
  const { user } = useContext(AuthContext);
  const { setSelectedFriendId, setSelectedRoomId } = useContext(AppContext);

  const handleChatClick = (friend) => {
    setSelectedFriendId(friend.uid);
    setSelectedRoomId("");
  };

  useEffect(() => {
    const db = getFirestore();
    const userQuery = query(
      collection(db, "users"),
      where("uid", "==", user.uid)
    );

    const unsubscribeUser = onSnapshot(userQuery, async (userSnapshot) => {
      if (!userSnapshot.empty) {
        const friendUIDs = userSnapshot.docs[0].data().friends || [];
        const friendsQuery = query(
          collection(db, "users"),
          where("uid", "in", friendUIDs)
        );

        const friendsSnapshot = await getDocs(friendsQuery);
        const friendDetails = friendsSnapshot.docs.map((doc) => doc.data());
        setFriends(friendDetails);

        const dbRealtime = getDatabase();
        friendUIDs.forEach((uid) => {
          const statusRef = ref(dbRealtime, `status/${uid}`);
          onValue(statusRef, (snapshot) => {
            setUserStatuses((prevStatuses) => ({
              ...prevStatuses,
              [uid]: snapshot.val(),
            }));
          });
        });
      }
    });

    // Clean up the listener on unmount
    return () => unsubscribeUser();
  }, [user.uid]);
  return (
    <FriendListContainer>
      {friends.length > 0 ? (
        friends.map((friend) => (
          <FriendItem key={friend.uid} onClick={() => handleChatClick(friend)}>
            <Badge
              color={userStatuses[friend.uid]?.isOnline ? "green" : "gray"}
              dot
            />
            <img
              src={friend.photoURL}
              alt=""
              width={20}
              style={{ borderRadius: 20, marginLeft: "5px" }}
            />
            <FriendName>
              <span>{friend.displayName}</span>
            </FriendName>
          </FriendItem>
        ))
      ) : (
        <Typography.Text>No friends found.</Typography.Text>
      )}
    </FriendListContainer>
  );
}
