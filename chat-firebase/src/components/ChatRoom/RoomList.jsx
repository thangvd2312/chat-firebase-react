import React, { useContext, useMemo } from "react";
import { Button, Collapse, Typography } from "antd";
const { Panel } = Collapse;
import styled from "styled-components";
import { PlusSquareOutlined } from "@ant-design/icons";
import useFireStore from "@/hooks/useFireStore";
import { AuthContext } from "@/context/AuthProvider";

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
      color: white;
      padding: 0;
    }
  }
`;

const LinkStyled = styled(Typography.Link)`
  display: block;
  margin-bottom: 5px;
  color: white;
`;  
export default function RoomList() {
  const {
    user: { uid },
  } = useContext(AuthContext);
  console.log(uid);
  const roomsCondition = useMemo(() => {
    return {
      fieldName: "members",
      operator: "array-contains",
      compareValue: uid,
    };
  }, [uid]);
  const rooms = useFireStore("rooms", roomsCondition);

  console.log('rooms', rooms);
  return (
    <Collapse ghost defaultActiveKey={["1"]}>
      <PanelStyled header="Danh sách các phòng" key="1">
        {rooms.map((room) => (
          <LinkStyled key={room.id}>{room.name}</LinkStyled>
        ))}
        <Button type="text" icon={<PlusSquareOutlined />} className="add-room">
          Thêm phòng
        </Button>
      </PanelStyled>
    </Collapse>
  );
}
