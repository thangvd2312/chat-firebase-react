import TabsSidebar from "@/components/ChatRoom/TabsSidebar";
import UserInfo from "@/components/ChatRoom/UserInfo";
import { Row, Col } from "antd";
import styled from "styled-components";
const SidebarStyled = styled.div`
  color: #ecf0f1;
  height: 100vh;
  padding: 16px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export default function Sidebar({ setIsSidebarOpen }) {
  return (
    <SidebarStyled>
      <Row>
        <Col span={24}>
          <UserInfo />
        </Col>
        <Col span={24}>
          <TabsSidebar setIsSidebarOpen={setIsSidebarOpen} />
        </Col>
      </Row>
    </SidebarStyled>
  );
}
