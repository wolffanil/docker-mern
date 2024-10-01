import styled from "styled-components";

import { useGetMyChats } from "../../libs/react-query/reactQueriesAndMutations";
import { ChatType } from "../../types";
import { useAuthContext } from "../../context/AuthContext";
import { getСompanion } from "../../libs/utils";
import ChatItem from "./ChatItem";
import { useState } from "react";
import MenuGroup from "./MenuGroup";

type NavChatsProps = {
  setSettings: (setting: boolean) => void;
};

function NavChats({ setSettings }: NavChatsProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { data: chats, isPending: isLoadingChats } = useGetMyChats();

  const { setSelectedChat, user } = useAuthContext();

  if (!user) return;

  const handleClick = () => {
    if (isOpen) {
      document.body.style.overflowY = "scroll";
    } else {
      document.body.style.overflowY = "hidden";
    }

    setIsOpen((o) => !o);
  };

  if (isLoadingChats) return <NotAndLoadingChats>Загрузка</NotAndLoadingChats>;

  return (
    <>
      <Group onClick={handleClick}>
        <img src="/nav/plus.svg" alt="plus" />
        <p>группа</p>
      </Group>

      <Wrapper>
        {chats?.length ? (
          chats.map((chat: ChatType, i) => {
            const n = chat.isGroupChat
              ? 0
              : getСompanion(chat?.users, user?.id);

            return (
              <ChatItem
                setSelectedChat={setSelectedChat}
                key={i}
                n={n}
                chat={chat}
              />
            );
          })
        ) : (
          <NotAndLoadingChats>Нету чатов</NotAndLoadingChats>
        )}
      </Wrapper>

      <Button onClick={() => setSettings(true)}>
        <img src="/nav/settings.svg" alt="settings" />
        Настройки
      </Button>

      <MenuGroup isOpen={isOpen} handleClick={handleClick} isCreate key="nav" />
    </>
  );
}

const Group = styled.button`
  display: flex;
  padding-left: 7px;
  padding-right: 13px;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  font-weight: 500;
  width: 165px;
  height: 39px;
  margin-left: auto;
  background-color: var(--violet-color);
  margin-top: 41px;
  color: white;
`;

const Wrapper = styled.ul`
  display: flex;
  flex-direction: column;
  margin-top: 40px;
  row-gap: 25px;
  overflow-y: scroll;
  max-height: 500px;

  .nav__item {
    display: flex;
    width: 445px;
    align-items: center;
  }

  .nav__img {
    border-radius: 90px;
    background-color: #ffffff;
    width: 105px;
    height: 105px;
  }

  .nav__wrapper-photo {
    position: relative;
  }

  .nav__wrapper {
    display: flex;
    align-items: start;
    flex-direction: column;
    column-gap: 2px;
    color: var(--text-color);
    font-size: 30px;
    margin-left: 43px;
    /* margin-right: 135px; */
  }

  .nav__latestMessage {
    margin-top: 5px;
    font-size: 25px;
    color: var(--violet-color);
  }

  .nav__online {
    position: absolute;
    right: 0;
    bottom: 0;
    background-color: var(--violet-color);
    width: 38px;
    height: 38px;
    z-index: 2;
    border-radius: 90px;
  }

  .nav__subname {
    font-size: 20px;
  }

  .nav__chat {
    background-color: var(--grey-color);
    margin-left: auto;
  }
`;

const Button = styled.button`
  margin-top: 65px;
  display: flex;
  column-gap: 25px;
  color: var(--text-color);
  align-items: center;
  background-color: var(--grey-color);
  font-size: 30px;
  border: none;
  outline: none;
`;

const NotAndLoadingChats = styled.div`
  width: 445px;
  height: 450px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--text-color);
  font-size: 20px;
  font-weight: 400;
`;

export default NavChats;
