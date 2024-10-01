import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useCreateChat } from "../../libs/react-query/reactQueriesAndMutations";
import toast from "react-hot-toast";
import { useAuthContext } from "../../context/AuthContext";
import { errorMessage } from "../../libs/errorMessage";

type UserItemProps = {
  img: string;
  name: string;
  username: string;
  id: string;
};

function UserItem({ id, img, name, username }: UserItemProps) {
  const navigate = useNavigate();
  const { setSelectedChat } = useAuthContext();
  const { mutateAsync: createChat, isPending: isCreatingChat } =
    useCreateChat();

  const handleCreateChat = async () => {
    const toastId = toast.loading("Создание чата...");

    const newChat = await createChat(id, {
      onError: (message) => {
        const messageError = errorMessage(message);
        if (messageError === null) return;
        toast.error("Ошибка: " + messageError, {
          id,
        });
      },
    });

    if (newChat) {
      toast.success(`Связь с ${name} подключенна`, {
        id: toastId,
      });

      navigate("/chat");

      setSelectedChat(newChat);
    }
  };

  return (
    <UserItemLi>
      <UserItemImg
        src={img}
        alt="profile"
        onClick={() => navigate(`/users/${id}`)}
      />

      <UserItemWrapper>
        <p>{name}</p>

        <UserItemNik>{username}</UserItemNik>
      </UserItemWrapper>

      <UserItemButton disabled={isCreatingChat} onClick={handleCreateChat}>
        <img src="/nav/chats.svg" alt="chat" />
      </UserItemButton>
    </UserItemLi>
  );
}

const UserItemLi = styled.li`
  width: 100%;
  display: flex;
  align-items: center;
  height: 120px;
  padding: 20px 27px 0px 12px;
  border-top: 1px solid var(--violet-color);
`;

const UserItemImg = styled.img`
  border-radius: 80px;
  width: 95px;
  height: 95px;
  cursor: pointer;
`;

const UserItemWrapper = styled.div`
  margin-left: 30px;
  display: flex;
  flex-direction: column;
  row-gap: 22px;
  font-size: 40px;
  font-weight: 400;
  font-family: "montserrat";
  color: var(--text-color);
`;

const UserItemNik = styled.p`
  font-size: 30px;
`;

const UserItemButton = styled.button`
  display: block;
  background-color: var(--backgraund-color);
  width: 58px;
  height: 58px;
  object-fit: cover;
  margin-left: auto;
`;

export default UserItem;
