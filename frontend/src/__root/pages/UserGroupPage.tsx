import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
  useAddToGroup,
  useSearchUser,
} from "../../libs/react-query/reactQueriesAndMutations";
import Profile from "../../components/ui/Profile";
import MenuGroup from "../../components/ui/MenuGroup";
import { useEffect } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { errorMessage } from "../../libs/errorMessage";
import { useSocket } from "../../context/SocketContext";
function UserGroupPage() {
  const navigate = useNavigate();
  const [searchParams, setSerachParams] = useSearchParams();
  const { selectedChat, setSelectedChat } = useAuthContext();
  const { handleAddToGroupSocket } = useSocket();

  const { data: users, isPending: isSearhingUser } = useSearchUser(
    searchParams.get("q") || ""
  );
  const { mutate: addToGroup, isPending: isAddingToGroup } = useAddToGroup();

  useEffect(() => {
    if (!isSearhingUser && !users[0]) toast.error("Пользователь не найден");
  }, [isSearhingUser]);

  const handleSearchUser = (searchText: string) => {
    if (searchParams.get("action") === "addGroup")
      return navigate(`/users/group?q=${searchText}&action=addGroup`);
    localStorage.setItem("search", searchText);
    navigate(`/users/group?q=${searchText}`);
  };

  const handleAddUser = async () => {
    if (searchParams.get("action") === "addGroup") {
      const existUsetInGroup = selectedChat?.users.find(
        (u) => u._id === users[0]._id
      );
      const toastId = toast.loading("Дабавление пользователя");
      if (existUsetInGroup)
        return toast.error(`${users[0]?.name} уже есть в группе`, {
          id: toastId,
        });

      addToGroup(
        {
          chatId: selectedChat?._id || "",
          user: users[0] || "",
        },

        {
          onSuccess: () => {
            toast.success(`${users[0].name} дабавлен в группу`, {
              id: toastId,
            });
            setSelectedChat({
              ...selectedChat,
              users: [...selectedChat.users, { ...users[0] }],
            });
            localStorage.removeItem("search");
            document.body.style.overflowY = "scroll";
            handleAddToGroupSocket({
              userId: users[0]._id || "",
              chatName: selectedChat?.chatName || "",
            });
            navigate("/chat");
          },
          onError: (message) => {
            const messageError = errorMessage(message);
            toast.error("Ошибка: " + messageError, {
              id: toastId,
            });
          },
        }
      );
    } else {
      const usersGroup = JSON.parse(localStorage.getItem("users")!) || [];

      if (
        usersGroup.find(
          (u: { id: string; name: string }) => u.id === users[0]._id
        )
      ) {
        toast.error("Вы уже дабавели этого пользователя");
        return;
      }
      usersGroup.push({ id: users[0]._id, name: users[0].name });

      localStorage.setItem("users", JSON.stringify(usersGroup));
      toast.success("Пользователь добавлен");
      navigate(`/`);
    }
  };

  if (isSearhingUser) return <div>Поиск...</div>;

  if (!isSearhingUser && !users![0]) {
    return <MenuGroup isOpen={true} isCreate key="group" />;
  }

  return (
    <Profile
      ver="groupProfile"
      user={users![0]}
      handleSearchUser={handleSearchUser}
      handleAddUser={handleAddUser}
      isAddingToGroup={isAddingToGroup}
    />
  );
}

export default UserGroupPage;
