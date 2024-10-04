import Message from "@/components/ChatRoom/Message";
import { AppContext } from "@/context/AppProvider";
import { AuthContext } from "@/context/AuthProvider";
import { addDocument } from "@/firebase/service";
import useFirestore from "@/hooks/useFireStore";
import { UserAddOutlined } from "@ant-design/icons";
import { Alert, Avatar, Button, Form, Input, Tooltip } from "antd";
import React, { useContext, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import Background from "@/assets/bg-chat.png";
const HeaderStyled = styled.div`
  display: flex;
  justify-content: space-between;
  height: 56px;
  padding: 0 16px;
  align-items: center;
  border-bottom: 1px solid rgb(230, 230, 230);

  .header {
    &__info {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    &__title {
      margin: 0;
      font-weight: bold;
    }

    &__description {
      font-size: 12px;
    }
  }
`;

const ButtonGroupStyled = styled.div`
  display: flex;
  align-items: center;
`;

const WrapperStyled = styled.div`
  height: 100vh;
  position: relative;
  overflow: hidden;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url(${Background});
    background-size: cover;
    filter: blur(5px); // Adjust the blur value as needed
    z-index: -1;
  }
`;

const ContentStyled = styled.div`
  height: calc(100% - 56px);
  display: flex;
  flex-direction: column;
  padding: 11px;
  justify-content: flex-end;
`;

const FormStyled = styled(Form)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 2px 2px 0;
  border: 1px solid rgb(230, 230, 230);
  border-radius: 2px;

  .ant-form-item {
    flex: 1;
    margin-bottom: 0;
  }
`;

const MessageListStyled = styled.div`
  max-height: 100%;
  overflow-y: auto;
`;
export default function ChatWindow() {
  const {
    user: { uid, photoURL, displayName },
  } = useContext(AuthContext);
  const {
    rooms,
    selectedRoom,
    selectedRoomId,
    members,
    setIsInviteMemberVisible,
  } = useContext(AppContext);
  const [form] = Form.useForm();
  const [inputMessage, setInputMessage] = useState("");
  const inputRef = useRef(null);
  const messageListRef = useRef(null);
  function handleInputChange(e) {
    setInputMessage(e.target.value);
  }
  function handleOnSubmit() {
    addDocument("messages", {
      text: inputMessage,
      uid,
      photoURL,
      displayName,
      roomId: selectedRoomId,
    });
    form.resetFields(["message"]);

    if (inputRef?.current) {
      setTimeout(() => {
        inputRef.current.focus();
      });
    }
  }

  const condition = useMemo(() => {
    return {
      fieldName: "roomId",
      operator: "==",
      compareValue: selectedRoomId,
    };
  }, [selectedRoomId]);

  const messages = useFirestore("messages", condition);
  return (
    <WrapperStyled>
      {selectedRoom.id ? (
        <>
          <HeaderStyled>
            <div className="header__info">
              <p className="header__title">{selectedRoom.name}</p>
              <span className="header__description">
                {selectedRoom.description}
              </span>
            </div>
            <ButtonGroupStyled>
              <Button
                icon={<UserAddOutlined />}
                type="text"
                onClick={() => setIsInviteMemberVisible(true)}
              >
                Mời
              </Button>
              <Avatar.Group size="small" max={{ count: 2 }}>
                {members.map((member) => (
                  <Tooltip title={member.displayName} key={member.id}>
                    <Avatar src={member.photoURL}>
                      {member.photoURL
                        ? ""
                        : member.displayName?.charAt(0)?.toUpperCase()}
                    </Avatar>
                  </Tooltip>
                ))}
              </Avatar.Group>
            </ButtonGroupStyled>
          </HeaderStyled>
          <ContentStyled>
            <MessageListStyled ref={messageListRef}>
              {messages.map((mes) => (
                <Message
                  key={mes.id}
                  text={mes.text}
                  photoURL={mes.photoURL}
                  displayName={mes.displayName}
                  createdAt={mes.createdAt}
                />
              ))}
            </MessageListStyled>
            <FormStyled form={form}>
              <Form.Item name="message">
                <Input
                  ref={inputRef}
                  onChange={handleInputChange}
                  onPressEnter={handleOnSubmit}
                  placeholder="Typing message..."
                  variant="borderless"
                  autoComplete="off"
                />
              </Form.Item>
              <Button type="primary" onClick={handleOnSubmit}>
                Send
              </Button>
            </FormStyled>
          </ContentStyled>
        </>
      ) : (
        <Alert
          message="Choose a room"
          type="info"
          showIcon
          style={{ margin: 5 }}
          closable
        />
      )}
    </WrapperStyled>
  );
}
