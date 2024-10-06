import React, { useContext, useMemo } from "react";
import { Button, Collapse, Typography } from "antd";
import { PlusSquareOutlined } from "@ant-design/icons";
import { AuthContext } from "@/context/AuthProvider";
import { AppContext } from "@/context/AppProvider";
import useFireStore from "@/hooks/useFireStore";
import styled from "styled-components";
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
    background-color: ${({ active }) => (active === "true" ? "white" : "transparent")};
    color: ${({ active }) => (active === "true" ? "black" : "white")};
    padding: 5px;
    border-radius: 4px;
  }
`;
export default function RoomList({ setIsSidebarOpen }) {
  const { setIsAddRoomVisible, rooms, selectedRoomId, setSelectedRoomId } =
    useContext(AppContext);
  return (
    <Collapse ghost defaultActiveKey={["1"]}>
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
    </Collapse>
  );
}
