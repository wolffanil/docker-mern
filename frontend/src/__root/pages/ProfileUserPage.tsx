import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import Profile from "../../components/ui/Profile";
import {
  useCreateChat,
  useGetMyChats,
  useGetUserById,
} from "../../libs/react-query/reactQueriesAndMutations";
import { useAuthContext } from "../../context/AuthContext";
import { errorMessage } from "../../libs/errorMessage";

function ProfileUserPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { isPending, data: user, isError } = useGetUserById(id || "");
  const { data: chats, isPending: isLoadingChats } = useGetMyChats();

  const { setSelectedChat } = useAuthContext();
  const { mutateAsync: createChat, isPending: isCreatingChat } =
    useCreateChat();

  const handleCreateChat = async () => {
    const existChat = chats
      ?.filter((chat) => !chat.isGroupChat)
      .find((chat) => chat.users.find((u) => u._id === user?._id));
    if (existChat) {
      setSelectedChat(existChat);
      navigate("/chat");
      return;
    }

    const toastId = toast.loading("Создание чата...");

    const newChat = await createChat(user?.id || "", {
      onError: (message) => {
        const messageError = errorMessage(message);
        if (messageError === null) return;
        toast.error("Ошибка: " + messageError, {
          id,
        });
      },
    });

    if (newChat) {
      toast.success(`Связь с ${user?.name || ""} подключенна`, {
        id: toastId,
      });

      navigate("/chat");

      setSelectedChat(newChat);
    }
  };

  const isLoading = isPending || isLoadingChats;

  if (isLoading) return <div>Загрузка...</div>;

  if (isError) return <div>Ошибка пользователь не найден </div>;

  return (
    <Profile
      ver="userProfile"
      user={user}
      handleCreateChat={handleCreateChat}
      isCreatingChat={isCreatingChat}
    />
  );
}

export default ProfileUserPage;
