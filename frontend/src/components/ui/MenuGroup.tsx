import { createPortal } from "react-dom";
import FileUploader from "../forms/FileUploader";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { ChatType, UserType } from "../../types";
import { useNavigate } from "react-router-dom";
import {
  useChangeDataGroup,
  useCreateGroupChat,
  useRemoveFromGroup,
} from "../../libs/react-query/reactQueriesAndMutations";
import toast from "react-hot-toast";
import { useAuthContext } from "../../context/AuthContext";
import { errorMessage } from "../../libs/errorMessage";
import { useSocket } from "../../context/SocketContext";

type MenuGroupProps = {
  isOpen: boolean;
  handleClick?: () => void;
  isCreate: boolean;
  data?: ChatType;
  r?: boolean;
};

function MenuGroup({
  isOpen,
  handleClick,
  isCreate = false,
  data,
}: MenuGroupProps) {
  const navigate = useNavigate();
  const { mutateAsync: createGroupChat, isPending: isCreatingGroup } =
    useCreateGroupChat();
  const { mutate: removeUser, isPending: isDeletingUser } =
    useRemoveFromGroup();
  const { mutateAsync: changeDataGroup, isPending: isUpdating } =
    useChangeDataGroup();
  const { handleCreateGroupToSocket, handleRemoveFromGroupSocket } =
    useSocket();

  const { setSelectedChat, user, selectedChat } = useAuthContext();

  const [file, setFile] = useState<File[]>([]);

  const [searchText, setSearchText] = useState<string>(
    () => localStorage.getItem("search") || ""
  );
  const [nameGroup, setNameGroup] = useState<string>(
    () => data?.chatName || localStorage.getItem("name") || ""
  );
  const [users, setUsers] = useState<Pick<UserType, "id" | "name">[]>(() => {
    if (data?.users) return data.users;

    const storedUsers = localStorage.getItem("users");
    return storedUsers ? JSON.parse(storedUsers) : [];
  });

  useEffect(() => {
    localStorage.setItem("search", searchText);
    localStorage.setItem("name", nameGroup);

    if (users !== JSON.parse(localStorage.getItem("users")) && !data?.users) {
      setUsers(JSON.parse(localStorage.getItem("users")));
      setNameGroup(localStorage.getItem("name"));
      setSearchText(localStorage.getItem("search"));
    } else if (data) {
      setUsers(data?.users);
      setNameGroup(data?.chatName);
    }

    () => {
      localStorage.setItem("search", searchText);
      localStorage.setItem("name", nameGroup);
    };
  }, [
    localStorage.getItem("users"),
    localStorage.getItem("name"),
    localStorage.getItem("search"),
    selectedChat,
  ]);

  const handleSearchUser = () => {
    if (searchText.length <= 2) return;

    if (data) {
      navigate(`/users/group?q=${searchText}&action=addGroup`);
    } else {
      navigate(`/users/group?q=${searchText}`);
    }

    if (handleClick) handleClick();
  };

  const handleCreateGroup = async () => {
    if (nameGroup.length <= 2) return toast.error("Название слишком кароткое");
    if (users.length < 1) return toast.error("Должен быть собиседник");
    if (nameGroup === "sender") return toast.error("Название группы странное");

    const clients = users.map((u) => u.id);

    const toastId = toast.loading("Создание группы");
    const group = await createGroupChat(
      {
        name: nameGroup,
        file,
        users: clients,
      },
      {
        onError: (message) => {
          const messageError = errorMessage(message);
          toast.error("Ошибка: " + messageError, {
            id: toastId,
          });
        },
        onSuccess: () => {
          handleCreateGroupToSocket({
            users: clients,
            groupAdmin: user?.id || "",
            chatName: nameGroup,
          });
        },
      }
    );

    if (group) {
      toast.success("Чат успешно создан", {
        id: toastId,
      });
      localStorage.removeItem("users");
      localStorage.removeItem("name");
      localStorage.removeItem("search");
      setSelectedChat(group);
      navigate("/chat");
      if (handleClick) handleClick();
    }
  };

  const handleRemoveUser = (userId: string) => {
    if (isDeletingUser) return;
    const toastId = toast.loading("Удаление пользователя...");
    if (user?.id !== selectedChat?.groupAdmin?._id)
      return toast.error("Ты не админ", {
        id: toastId,
      });
    removeUser(
      { chatId: selectedChat?._id || "", userId },
      {
        onSuccess: () => {
          toast.success("Пользователь удалён", {
            id: toastId,
          });
          setSelectedChat({
            ...selectedChat,
            users: selectedChat?.users.filter((u) => u._id !== userId),
          });
          handleRemoveFromGroupSocket({
            userId,
            chatId: selectedChat?._id || "",
            chatName: selectedChat?.chatName || "",
          });
        },
        onError: (message) => {
          const messageError = errorMessage(message);
          toast.error("Ошибка: " + messageError, {
            id: toastId,
          });
        },
      }
    );
  };

  const handleDeleteClients = (id: string) => {
    localStorage.setItem(
      "users",
      JSON.stringify(users.filter((u) => u.id !== id))
    );
    setUsers(() => {
      const storedUsers = localStorage.getItem("users");
      return storedUsers ? JSON.parse(storedUsers) : [];
    });
  };

  const handleChangeDataGroup = () => {
    const toastId = toast.loading("Обновление группы");

    if (data?.chatName === nameGroup && file.length < 1)
      return toast.error("Данные группы не были изменины", { id: toastId });

    if (nameGroup === "sender")
      return toast.error("Название группы странное", { id: toastId });

    changeDataGroup(
      {
        chatId: selectedChat?._id || "",
        chatName: nameGroup,
        backgroundUrl: data?.background || "",
        file,
      },
      {
        onSuccess: (chat) => {
          toast.success("Данные успешно обновились", {
            id: toastId,
          });
          setSelectedChat({
            ...selectedChat,
            chatName: nameGroup,
            background: chat.background,
          });
        },
        onError: (message) => {
          const messageError = errorMessage(message);
          toast.error("Ошибка: " + messageError, {
            id: toastId,
          });
        },
      }
    );
  };

  if (!isOpen) return;

  return createPortal(
    <MenuBG
      onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        if (handleClick) {
          handleClick();
        } else {
          document.body.style.overflowY = "scroll";
        }
      }}
    >
      <MenuBlock
        onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
          e.stopPropagation();
        }}
      >
        <MenuSearch>
          <input
            type="text"
            required
            className="menuSearch__input"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Поиск пользователя"
          />
          <img
            src="/search.svg"
            alt="search"
            className="menuSearch__img"
            onClick={handleSearchUser}
          />
        </MenuSearch>

        <MenuChatName
          value={nameGroup}
          onChange={(e) => setNameGroup(e.target.value)}
          placeholder="Название группы"
        />

        <MenuWrapper>
          <MenuUsers>
            {users?.length
              ? users?.map((u, i) => (
                  <li key={i} className="menuWrapper__item">
                    <p>{u.name}</p>
                    {u?._id !== user?.id && (
                      <img
                        src="/icons/close.svg"
                        alt="delete"
                        className="menuWrapper__img"
                        onClick={
                          isCreate
                            ? () => handleDeleteClients(u._id || u.id)
                            : () => handleRemoveUser(u._id || u.id)
                        }
                      />
                    )}
                  </li>
                ))
              : ""}
          </MenuUsers>

          <FileUploader
            fieldChange={(file) => setFile(file)}
            mediaUrl={data?.background || ""}
          />

          <MenuButton
            type="submit"
            disabled={isCreatingGroup || isUpdating}
            onClick={isCreate ? handleCreateGroup : handleChangeDataGroup}
          >
            {isCreate ? "Создать чат" : "Обновить"}
          </MenuButton>
        </MenuWrapper>
      </MenuBlock>
    </MenuBG>,
    document.body
  );
}

export default MenuGroup;

const MenuBG = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: #0000006a;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
`;

const MenuBlock = styled.div`
  width: 767px;
  min-height: 773px;
  padding: 78px 95px 49px 95px;
  background-color: var(--grey-color);
  display: flex;
  flex-direction: column;
`;

const MenuSearch = styled.div`
  width: 100%;
  background-color: var(--grey-color);
  border: 1px solid var(--violet-color);
  height: 76px;
  display: flex;
  padding: 11px 24px;
  justify-content: space-between;
  align-items: center;

  .menuSearch__input {
    background-color: var(--grey-color);
    color: var(--text-color);
    font-size: 23px;
    font-weight: 400;
    width: 80%;
    outline: none;
  }

  .menuSearch__img {
    width: 51px;
    height: 51px;
    object-fit: cover;
    display: block;
    cursor: pointer;
  }
`;

const MenuChatName = styled.input`
  width: 100%;
  border: 1px solid var(--violet-color);
  background-color: var(--grey-color);
  margin-top: 50px;
  padding: 10px 20px;
  height: 76px;
  color: var(--text-color);
  font-size: 23px;
  font-weight: 400;
  outline: none;
`;

const MenuUsers = styled.ul`
  display: flex;
  width: 100%;
  max-height: 140px;
  overflow-y: scroll;
  justify-content: space-between;
  align-items: start;
  row-gap: 17px;
  flex-wrap: wrap;
`;

const MenuWrapper = styled.div`
  margin-top: 63px;
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: start;
  row-gap: 17px;
  flex-wrap: wrap;

  .menuWrapper__item {
    display: flex;
    background-color: #d9d9d9;
    border-radius: 17px;
    min-width: 171px;
    justify-content: space-between;
    align-items: center;
    padding: 11px 17px;
    color: #000000;
    font-size: 32px;
    font-weight: 400;
  }

  .menuWrapper__img {
    width: 25px;
    height: 25px;
    object-fit: cover;
    display: block;
    cursor: pointer;
    margin-left: 10px;
  }
`;

const MenuButton = styled.button`
  margin-top: 27px;
  border-radius: 15px;
  background-color: var(--violet-color);
  padding: 18px 47px;
  display: block;
  font-size: 32px;
  font-weight: 400;
  color: var(--text-color);
  margin-left: auto;
`;
