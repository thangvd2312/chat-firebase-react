import React, { useState } from "react";
import ChatWindow from "@/components/ChatRoom/ChatWindow";
import SideBar from "@/components/ChatRoom/SideBar";
import { Row, Col, Button } from "antd";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";
import styled from "styled-components";

const ToggleButton = styled(Button)`
  position: fixed;
  top: 50%;
  left: ${(props) => (props.isOpen ? "0" : "calc(100% - 30px)")};
  transform: translateY(-50%);
  z-index: 1100;
  width: 30px;
  height: 30px;
  padding: 0;
  border: none;
  background: transparent;
  box-shadow: none;

  @media (max-width: 768px) {
    display: block;
  }
`;

const SidebarWrapper = styled.div`
  @media (max-width: 768px) {
    display: ${(props) => (props.isOpen ? "block" : "none")};
  }
`;

function ChatRoom() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Row>
      <ToggleButton
        icon={isSidebarOpen ? <RightOutlined /> : <LeftOutlined />}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        isOpen={isSidebarOpen}
      />
      <Col xs={24} sm={8} md={6} lg={6} xl={6}>
        <SidebarWrapper isOpen={isSidebarOpen}>
          <SideBar setIsSidebarOpen={setIsSidebarOpen} />
        </SidebarWrapper>
      </Col>
      <Col xs={24} sm={16} md={18} lg={18} xl={18}>
        <ChatWindow />
      </Col>
    </Row>
  );
}

export default ChatRoom;