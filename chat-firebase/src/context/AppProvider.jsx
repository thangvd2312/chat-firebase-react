import { AuthContext } from '@/context/AuthProvider';
import { db } from '@/firebase/config';
import useFirestore from '@/hooks/useFireStore';
import { collection, getDocs, query, where } from 'firebase/firestore';

import React, { useContext, useEffect, useMemo, useState } from 'react';

export const AppContext = React.createContext();

export default function AppProvider({ children }) {
  const [isAddRoomVisible, setIsAddRoomVisible] = useState(false);
  const [isInviteMemberVisible, setIsInviteMemberVisible] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [selectedFriendId, setSelectedFriendId] = useState('');
  const [selectedFriend, setSelectedFriend] = useState('');
  const {
    user: { uid },
  } = useContext(AuthContext);

  const roomsCondition = useMemo(() => {
    return {
      fieldName: 'members',
      operator: 'array-contains',
      compareValue: uid,
    };
  }, [uid]);

  const rooms = useFirestore('rooms', roomsCondition);
  async function getUserInfo(userId) {
    try {
      const q = query(collection(db, "users"), where("uid", "==", userId));
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        const userInfo = querySnapshot.docs[0].data();
        return userInfo;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting user info: ", error);
    }
  }
  const selectedRoom = useMemo(
    () => rooms.find((room) => room.id === selectedRoomId) || {},
    [rooms, selectedRoomId]
  );

  const usersCondition = useMemo(() => {
    return {
      fieldName: 'uid',
      operator: 'in',
      compareValue: selectedRoom.members,
    };
  }, [selectedRoom.members]);

  const members = useFirestore('users', usersCondition);

  const clearState = () => {
    setSelectedRoomId('');
    setIsAddRoomVisible(false);
    setIsInviteMemberVisible(false);
    setSelectedFriendId('');
  };

  useEffect(() => {
    const fetchFriendInfo = async () => {
      if (selectedFriendId) {
        const result = await getUserInfo(selectedFriendId);
        setSelectedFriend(result);
      } else {
        setSelectedFriend('');
      }
    };

    fetchFriendInfo();
  }, [selectedFriendId]);

  return (
    <AppContext.Provider
      value={{
        rooms,
        members,
        selectedRoom,
        isAddRoomVisible,
        setIsAddRoomVisible,
        selectedRoomId,
        setSelectedRoomId,
        isInviteMemberVisible,
        setIsInviteMemberVisible,
        setSelectedFriendId,
        selectedFriendId,
        selectedFriend,
        clearState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}