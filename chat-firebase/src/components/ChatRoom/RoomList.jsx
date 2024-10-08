import React, { useContext, useEffect, useState } from "react";
import { Button, Collapse, Typography, Badge } from "antd";
import { PlusSquareOutlined } from "@ant-design/icons";
import { AppContext } from "@/context/AppProvider";
import styled from "styled-components";
import { AuthContext } from "@/context/AuthProvider";
import { getDatabase, onValue, ref } from "firebase/database";
const { Panel } = Collapse;

const PanelStyled = styled(Panel)`
  &&& {
    .ant-collapse-header,
    p {
      color: white;
    }

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
    color: white;
    background-color: ${({ active }) =>
      active === "true" ? "white" : "transparent"};
    color: ${({ active }) => (active === "true" ? "black" : "white")};
    padding: 5px;
    border-radius: 4px;
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
  color: white;
  margin-left: 8px;
`;

export default function RoomList({ setIsSidebarOpen }) {
  const {
    setIsAddRoomVisible,
    rooms,
    selectedRoomId,
    setSelectedRoomId,
    members,
    selectedRoom,
  } = useContext(AppContext);
  const { user } = useContext(AuthContext);
  const [userStatuses, setUserStatuses] = useState({});

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
  return (
    <Collapse ghost defaultActiveKey={["1", "2"]}>
      <PanelStyled header="All rooms" key="1">
        {rooms.map((room) => (
          <LinkStyled
            key={room.id}
            onClick={() => {
              setSelectedRoomId(room.id);
              setIsSidebarOpen(false);
            }}
            active={(room.id === selectedRoomId).toString()}
          >
            {room.name}
          </LinkStyled>
        ))}
        <Button
          type="text"
          icon={<PlusSquareOutlined />}
          className="add-room"
          onClick={() => setIsAddRoomVisible(true)}
        >
          Add room
        </Button>
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
            <UserContainer key={user.id}>
              <Badge
                color={userStatuses[elm.uid]?.isOnline ? "green" : "gray"}
                dot
              />
              <UserName>
                {elm.displayName}{" "}
                <span>{elm.uid === user.uid ? "(You)" : ""}</span>
              </UserName>
            </UserContainer>
          ))}
        </PanelStyled>
      )}
    </Collapse>
  );
}
