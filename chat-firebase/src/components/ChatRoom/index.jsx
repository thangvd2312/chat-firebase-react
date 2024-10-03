import ChatWindow from "@/components/ChatRoom/ChatWindow";
import SideBar from "@/components/ChatRoom/SideBar";
import { Row, Col } from "antd";

function ChatRoom() {
  return (
    <Row>
      <Col span={6}>
        <SideBar />
      </Col>
      <Col span={18}>
        <ChatWindow />
      </Col>
    </Row>
  );
}

export default ChatRoom;
