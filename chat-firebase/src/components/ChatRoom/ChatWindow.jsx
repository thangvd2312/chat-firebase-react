import Message from "@/components/ChatRoom/Message";
import { AppContext } from "@/context/AppProvider";
import { AuthContext } from "@/context/AuthProvider";
import { addDocument } from "@/firebase/service";
import useFirestore from "@/hooks/useFireStore";
import { UserAddOutlined } from "@ant-design/icons";
import { Alert, Avatar, Button, Input, Tooltip } from "antd";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import EmojiIcon from "@/assets/happy-icon.webp";
import {
  HeaderStyled,
  ButtonGroupStyled,
  WrapperStyled,
  ContentStyled,
  FormStyled,
  MessageListStyled,
} from "@/styles/ChatWindowStyles";
import StickerPopup from "@/components/ChatRoom/StickerPicker";
import OutsideClickHandler from "react-outside-click-handler";

export default function ChatWindow() {
  const {
    user: { uid, photoURL, displayName },
  } = useContext(AuthContext);
  const { selectedRoom, selectedRoomId, members, setIsInviteMemberVisible } =
    useContext(AppContext);
  const [inputMessage, setInputMessage] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const inputRef = useRef(null);
  const messageListRef = useRef(null);
  function handleInputChange(e) {
    setInputMessage(e.target.value);
  }
  function handleOnSubmit() {
    if (!inputMessage.trim().length) return;
    addDocument("messages", {
      text: inputMessage,
      uid,
      photoURL,
      displayName,
      roomId: selectedRoomId,
      type: "text",
    });
    setInputMessage("");

    if (inputRef?.current) {
      setTimeout(() => {
        inputRef.current.focus();
      });
    }
  }

  function handleSelectedReactIcon(obj) {
    const { type, data } = obj;
    if (type === "emoji") {
      const newMessage = inputMessage + data;
      setInputMessage(newMessage);
      return;
    }
    if (["sticker", "gif"].includes(type)) {
      addDocument("messages", {
        text: data,
        uid,
        photoURL,
        displayName,
        roomId: selectedRoomId,
        type: "sticker",
      });
      return;
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

  useEffect(() => {
    if (messageListRef?.current) {
      messageListRef.current.scrollTop =
        messageListRef.current.scrollHeight + 50;
    }
  }, [messages]);

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
                Invite
              </Button>
              <Avatar.Group
                size="small"
                className="custom-avatar-group"
                max={{ count: 2 }}
              >
                {members.map((member) => (
                  <Tooltip
                    title={member.displayName}
                    key={member.id}
                    overlayClassName="custom-tooltip"
                  >
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
                  type={mes.type}
                  displayName={mes.displayName}
                  createdAt={mes.createdAt}
                  isOwnMessage={mes.uid === uid}
                />
              ))}
            </MessageListStyled>
            <FormStyled>
              <Input
                ref={inputRef}
                onChange={handleInputChange}
                onPressEnter={handleOnSubmit}
                placeholder="Typing message..."
                variant="borderless"
                autoComplete="off"
                value={inputMessage}
              />
              <img
                className="emoji-icon"
                src={EmojiIcon}
                width={20}
                onClick={() => setShowPicker((val) => !val)}
                style={{ marginRight: "10px", cursor: "pointer" }}
                
              />
              {showPicker && (
                <OutsideClickHandler
                  onOutsideClick={() => setShowPicker(false)}
                >
                  <StickerPopup
                    handleSelectedReactIcon={handleSelectedReactIcon}
                  />
                </OutsideClickHandler>
              )}
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
