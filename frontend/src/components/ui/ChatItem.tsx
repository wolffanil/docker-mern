import { NavLink } from "react-router-dom";
import { ChatType } from "../../types";

type ChatItemProps = {
  setSelectedChat: (chat: ChatType) => void;
  chat: ChatType;
  n: number;
};

function ChatItem({ setSelectedChat, chat, n }: ChatItemProps) {
  return (
    <li className="nav__item">
      <div className="nav__wrapper-photo">
        <img
          src={chat.isGroupChat ? "/group.svg" : chat.users[n].photoProfile}
          alt="photoChat"
          className="nav__img"
        />
        {!chat.isGroupChat && chat.users[n].isOnline && (
          <span className="nav__online" />
        )}
      </div>
      <div className="nav__wrapper">
        <p>{chat.chatName === "sender" ? chat.users[n].name : chat.chatName}</p>
        <p className="nav__subname">
          {chat.chatName === "sender" ? chat.users[n]?.username || "" : ""}
        </p>
        <p className="nav__latestMessage">
          {(chat?.latestMessage?.content?.length > 16
            ? chat?.latestMessage?.content?.slice(0, 17) + "..."
            : chat?.latestMessage?.content) || ""}
        </p>
      </div>
      <button className="nav__chat" onClick={() => setSelectedChat(chat)}>
        <NavLink to="/chat">
          <img src="/nav/chats.svg" alt="newChat" />
        </NavLink>
      </button>
    </li>
  );
}

export default ChatItem;
