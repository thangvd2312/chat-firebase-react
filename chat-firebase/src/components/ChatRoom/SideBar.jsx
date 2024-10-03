import RoomList from "@/components/ChatRoom/RoomList";
import UserInfo from "@/components/ChatRoom/UserInfo";
import React from 'react';
import { Row, Col } from 'antd';
import styled from 'styled-components';

const SidebarStyled = styled.div`
  background: #3f0e40;
  color: white;
  height: 100vh;
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