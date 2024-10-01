import { NavLink } from "react-router-dom";
import styled, { css } from "styled-components";
import { useEffect, useState } from "react";
import InputEmoji from "react-input-emoji";

import MessageItem from "../../components/ui/MessageItem";
import MenuGroup from "../../components/ui/MenuGroup";
import { useAuthContext } from "../../context/AuthContext";
import {
  useGetAllMessages,
  useSendMessage,
} from "../../libs/react-query/reactQueriesAndMutations";
import { getСompanion } from "../../libs/utils";
import { useDarkMode } from "../../context/DarkModeProvider";
import { useSocket } from "../../context/SocketContext";

function ChatPage() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { selectedChat, user } = useAuthContext();
  const [message, setMessage] = useState<string>("");

  const { data: messages, isPending: isGetingMessages } = useGetAllMessages(
    selectedChat?._id || ""
  );

  const { sendMessageToSocket } = useSocket();

  const { isDarkMode } = useDarkMode();

  const { mutateAsync: sendMessage } = useSendMessage({
    photoProfile: user?.photoProfile || "",
    name: user?.name || "",
    _id: user?.id || "",
  });

  useEffect(() => {
    setMessage("");
  }, [selectedChat]);

  if (!user) return;

  const n = getСompanion(selectedChat?.users, user?.id);

  const handleClick = () => {
    console.log(isOpen);
    if (isOpen) {
      document.body.style.overflowY = "scroll";
      setIsOpen(false);
    } else {
      document.body.style.overflowY = "hidden";
      setIsOpen(true);
    }
  };

  const handleSendMessage = async () => {
    if (message.length < 1) return;

    setMessage("");
    const newMessage = await sendMessage({
      content: message,
      chatId: selectedChat?._id || "",
    });

    const newMessageData = {
      content: newMessage.content,
      chat: selectedChat?._id || "",
      createdAt: newMessage.createdAt,
      sender: {
        _id: user.id,
        name: user.name,
        photoProfile: user.photoProfile,
      },
    };

    sendMessageToSocket(newMessageData);
  };

  const isGroup = selectedChat?.isGroupChat;

  return (
    <Chat>
      <ChatHeader>
        {isGroup ? (
          <img
            className="chat__img"
            src="/group.svg"
            alt="group"
            onClick={handleClick}
          />
        ) : (
          <NavLink to={`/users/${selectedChat!.users[n]._id}`}>
            <img
              className="chat__img"
              src={selectedChat?.users[n].photoProfile}
              alt="profile"
            />
          </NavLink>
        )}

        <div className="chat__info">
          <p>
            {selectedChat?.isGroupChat
              ? selectedChat.chatName
              : selectedChat?.users[n].name}
          </p>
          <p className="chat__online">
            {selectedChat?.isGroupChat
              ? selectedChat.users.length + " участников"
              : selectedChat?.users[n].isOnline
              ? "Онлайн"
              : "Оффлайн"}
          </p>
        </div>
      </ChatHeader>

      <ChatBlock background={selectedChat?.background}>
        {isGetingMessages ? (
          <div>Загрузка...</div>
        ) : (
          messages?.map((m, i) => (
            <MessageItem
              myId={user?.id || ""}
              data={m.createdAt}
              img={m.sender.photoProfile}
              message={m.content}
              name={m.sender.name}
              userId={m.sender._id}
              key={i}
            />
          ))
        )}
      </ChatBlock>

      <ChatSend>
        <InputEmoji
          value={message}
          onChange={setMessage}
          cleanOnEnter
          onEnter={handleSendMessage}
          placeholder="Написать сообщение"
          background="var(--grey-color)"
          borderRadius={0}
          borderColor="var(--grey-color)"
          fontFamily="montserrat"
          fontSize={30}
          theme={isDarkMode ? "light" : "dark"}
        />

        <ChatIcons>
          <button role="button" className="chatIcons__button">
            <img
              src="/icons/smile.svg"
              alt="smile"
              className="chatIcons__img"
            />
          </button>
          <button
            type="submit"
            className="chatIcons__button"
            onClick={handleSendMessage}
          >
            <img src="/icons/send.svg" alt="send" className="chatIcons__img" />
          </button>
        </ChatIcons>
      </ChatSend>

      <MenuGroup
        isOpen={isOpen}
        handleClick={handleClick}
        data={selectedChat}
        isCreate={false}
      />
    </Chat>
  );
}

const Chat = styled.div`
  width: 920px;
  background-color: var(--backgraund-color);
`;

const ChatHeader = styled.header`
  width: 100%;
  height: 110px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--violet-color);
  padding-right: 15px;
  padding-left: 15px;
  column-gap: 157px;

  .chat__img {
    height: 95px;
    width: 95px;
    object-fit: cover;
    border-radius: 80px;
    display: block;
    cursor: pointer;
  }

  .chat__info {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 386px;
    color: var(--text-color);
    font-family: "monsterrat", sans-serif;
    font-size: 40px;
    font-weight: 400;
    row-gap: 15px;
  }

  .chat__online {
    font-size: 25px;
  }
`;

const ChatBlock = styled.ul<{ background?: string }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 560px;
  max-height: 560px;
  overflow-y: scroll;
  ${(props) =>
    props.background &&
    css`
      background: url(${props.background}) center center/cover no-repeat;
    `}
  margin-top: 94px;
`;

const ChatSend = styled.div`
  border: 1px solid var(--violet-color);
  background-color: var(--grey-color);
  width: 100%;
  height: 116px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 31px 45px 31px 45px;
  margin-top: 77px;

  .react-input-emoji--input {
    outline: none;
    font-size: 30px;
    font-weight: 400;
    font-family: "montserrat", sans-serif;
    color: var(--text-color) !important;
    background-color: var(--grey-color);
    width: 80%;
    height: 40px;

    max-height: unset;
    min-height: unset;
    overflow-x: unset;
    overflow-y: unset;
    position: unset;
    white-space: unset;
    word-wrap: unset;
    z-index: 1;
    user-select: text;
    padding: unset;
    padding-top: 10px;
    text-align: unset;
  }

  .react-input-emoji--button {
    position: absolute;
    display: block;
    text-align: center;
    padding: 0 10px;
    overflow: hidden;
    transition: color 0.1s ease-out;
    margin: 0;
    box-shadow: none;
    background: none;
    border: none;
    outline: none;
    cursor: pointer;
    flex-shrink: 0;
    right: -50px;
    z-index: 50;
    width: 50px;
    height: 50px;
    opacity: 0;
  }
`;

const ChatIcons = styled.div`
  width: 134px;
  display: flex;
  column-gap: 25px;

  .chatIcons__img {
    width: 54px;
    height: 54px;
    object-fit: cover;
  }

  .chatIcons__button {
    background-color: var(--grey-color);
  }
`;

export default ChatPage;
