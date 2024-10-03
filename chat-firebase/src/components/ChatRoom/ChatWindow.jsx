import Message from "@/components/ChatRoom/Message";
import { UserAddOutlined } from "@ant-design/icons";
import { Avatar, Button, Form, Input, Tooltip } from "antd";
import React, { useRef } from "react";
import styled from "styled-components";
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
  const [form] = Form.useForm();
  const inputRef = useRef(null);
  const messageListRef = useRef(null);
  function handleInputChange(e) {
    console.log(e.target.value);
  }
  function handleOnSubmit() {}
  return (
    <WrapperStyled>
      <HeaderStyled>
        <div className="header__info">
          <p className="header__title">Room 1</p>
          <span className="header__description">Đây là room 1</span>
        </div>
        <ButtonGroupStyled>
          <Button icon={<UserAddOutlined />} type="text">
            Mời
          </Button>
          <Avatar.Group size="small" max={{ count: 2 }}>
            <Tooltip title="User 1">
              <Avatar>User 1</Avatar>
            </Tooltip>
            <Tooltip title="User 2">
              <Avatar>User 2</Avatar>
            </Tooltip>
            <Tooltip title="User 3">
              <Avatar>User 3</Avatar>
            </Tooltip>
            <Tooltip title="User 4">
              <Avatar>User 4</Avatar>
            </Tooltip>
          </Avatar.Group>
        </ButtonGroupStyled>
      </HeaderStyled>
      <ContentStyled>
        <MessageListStyled ref={messageListRef}>
          {/* {messages.map((mes) => (
            <Message
              key={mes.id}
              text={mes.text}
              photoURL={mes.photoURL}
              displayName={mes.displayName}
              createdAt={mes.createdAt}
            />
          ))} */}
          <Message
            text={"Test"}
            photoURL={null}
            displayName={"Thang"}
            createdAt={1727858586}
          />
          <Message
            text={"Test"}
            photoURL={null}
            displayName={"Thang"}
            createdAt={1727858586}
          />
          <Message
            text={"Test"}
            photoURL={null}
            displayName={"Thang"}
            createdAt={1727858586}
          />
          <Message
            text={"Test"}
            photoURL={null}
            displayName={"Thang"}
            createdAt={1727858586}
          />
          <Message
            text={"Test"}
            photoURL={null}
            displayName={"Thang"}
            createdAt={1727858586}
          />
          <Message
            text={"Test"}
            photoURL={null}
            displayName={"Thang"}
            createdAt={1727858586}
          />
          <Message
            text={"Test"}
            photoURL={null}
            displayName={"Thang"}
            createdAt={1727858586}
          />{" "}
          <Message
            text={"Test"}
            photoURL={null}
            displayName={"Thang"}
            createdAt={1727858586}
          />{" "}
          <Message
            text={"Test"}
            photoURL={null}
            displayName={"Thang"}
            createdAt={1727858586}
          />{" "}
          <Message
            text={"Test"}
            photoURL={null}
            displayName={"Thang"}
            createdAt={1727858586}
          />{" "}
          <Message
            text={"Test"}
            photoURL={null}
            displayName={"Thang"}
            createdAt={1727858586}
          />{" "}
          <Message
            text={"Test"}
            photoURL={null}
            displayName={"Thang"}
            createdAt={1727858586}
          />{" "}
          <Message
            text={"Test"}
            photoURL={null}
            displayName={"Thang"}
            createdAt={1727858586}
          />{" "}
          <Message
            text={"Test"}
            photoURL={null}
            displayName={"Thang"}
            createdAt={1727858586}
          />{" "}
          <Message
            text={"Test"}
            photoURL={null}
            displayName={"Thang"}
            createdAt={1727858586}
          />{" "}
          <Message
            text={"Test"}
            photoURL={null}
            displayName={"Thang"}
            createdAt={1727858586}
          />{" "}
          <Message
            text={"Test"}
            photoURL={null}
            displayName={"Thang"}
            createdAt={1727858586}
          />
        </MessageListStyled>
        <FormStyled form={form}>
          <Form.Item name="message">
            <Input
              ref={inputRef}
              onChange={handleInputChange}
              onPressEnter={handleOnSubmit}
              placeholder="Nhập tin nhắn..."
              variant="borderless"
              autoComplete="off"
            />
          </Form.Item>
          <Button type="primary" onClick={handleOnSubmit}>
            Gửi
          </Button>
        </FormStyled>
      </ContentStyled>
    </WrapperStyled>
  );
}
