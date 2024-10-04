import RoomList from "@/components/ChatRoom/RoomList";
import UserInfo from "@/components/ChatRoom/UserInfo";
import React from "react";
import { Row, Col } from "antd";
import styled from "styled-components";
import Background from "@/assets/bg-chat.png";
const SidebarStyled = styled.div`
  // background: rgba(211, 211, 211, 0.9);
  background-image: url(${Background});
  color: black;
  height: 100vh;
  padding: 16px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
`;

export default function Sidebar() {
  return (
    <SidebarStyled>
      <Row>
        <Col span={24}>
          <UserInfo />
        </Col>
        <Col span={24}>
          <RoomList />
        </Col>
      </Row>
    </SidebarStyled>
  );
}
