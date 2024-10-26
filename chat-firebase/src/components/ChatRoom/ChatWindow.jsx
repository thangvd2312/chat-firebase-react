import Message from "@/components/ChatRoom/Message";
import { AppContext } from "@/context/AppProvider";
import { AuthContext } from "@/context/AuthProvider";
import { addDocument } from "@/firebase/service";
import useFirestore from "@/hooks/useFireStore";
import { UserAddOutlined } from "@ant-design/icons";
import { Alert, Avatar, Badge, Button, Input, Tooltip } from "antd";
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
    user: { uid, photoURL, displayName, friends },
  } = useContext(AuthContext);
  const {
    selectedRoom,
    selectedFriend,
    selectedRoomId,
    members,
    setIsInviteMemberVisible,
  } = useContext(AppContext);
  const [inputMessage, setInputMessage] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const inputRef = useRef(null);
  const messageListRef = useRef(null);
  function handleInputChange(e) {
    setInputMessage(e.target.value);
  }
  function handleOnSubmit() {
    if (!inputMessage.trim().length) return;
    if (selectedRoomId) {
      addDocument("messages", {
        text: inputMessage,
        uid,
        photoURL,
        displayName,
        roomId: selectedRoomId,
        type: "text",
      });
    }

    if (selectedFriend) {
      addDocument("message_single", {
        text: inputMessage,
        uid,
        photoURL,
        displayName,
        roomId: [uid, selectedFriend.uid].sort((a, b) => a.localeCompare(b)).join('_'),
        type: "text",
        createdAt: new Date(),
      });
    }
    
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
      const roomId = selectedRoomId ? selectedRoomId : (selectedFriend ? [uid, selectedFriend.uid].sort((a, b) => a.localeCompare(b)).join('_') : '');
      const mesageCollection = selectedRoomId ? 'messages' : 'message_single';
      if (roomId) {
        addDocument(mesageCollection, {
          text: data,
          uid,
          photoURL,
          displayName,
          roomId: roomId,
          type: "sticker",
        });
      }
      return;
    }
  }

  const condition = useMemo(() => {
    return {
      fieldName: "roomId",
      operator: "==",
      compareValue: selectedRoomId ? selectedRoomId : [uid, selectedFriend.uid].sort((a, b) => a.localeCompare(b)).join('_'),
    };
  }, [selectedFriend, selectedRoomId, uid]);
  const messages = useFirestore(selectedRoomId ? "messages" : "message_single", condition);
  const selectedFriendOnlineStatus = useMemo(() => {
    if (!selectedFriend) return null;
    const friend = friends.find((f) => f.uid === selectedFriend.uid);
    return friend ? friend.isOnline : null;
  }, [selectedFriend, friends]);

  useEffect(() => {
    if (messageListRef?.current) {
      messageListRef.current.scrollTop =
        messageListRef.current.scrollHeight + 50;
    }
  }, [messages]);
  return (
    <WrapperStyled>
      {selectedRoom.id || selectedFriend.uid ? (
        <>
          <HeaderStyled>
            <div className="header__info" data-test={JSON.stringify(selectedFriend)}>
              {selectedFriend ? (
                <>
                  <p
                    className="header__title"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Avatar src={selectedFriend.photoURL} />
                    <Badge
                      color={selectedFriendOnlineStatus ? "green" : "gray"}
                      dot
                    />
                    {selectedFriend.displayName}
                  </p>
                </>
              ) : (
                <>
                  <p className="header__title">{selectedRoom.name}</p>
                  <span className="header__description">
                    {selectedRoom.description}
                  </span>
                </>
              )}
            </div>
            {selectedRoom.id && (
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
            )}
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
