import styled from "styled-components";
import { useDeleteToken } from "../../libs/react-query/reactQueriesAndMutations";
import toast from "react-hot-toast";
import { errorMessage } from "../../libs/errorMessage";
import { useSocket } from "../../context/SocketContext";

type DeviceItemProps = {
  browser: string;
  device: string;
  ip: string;
  _id: string;
};

function DeviceItem({ browser, device, ip, _id }: DeviceItemProps) {
  const { mutate: deleteToken, isPending: isDeletingToken } =
    useDeleteToken(_id);
  const { handleDeleteDevice } = useSocket();

  const handleDeleteToken = async () => {
    const id = toast.loading("Удаление устройства...");

    await deleteToken(_id, {
      onSuccess: () => {
        toast.success("устройсво успешно удаленно", { id });
        handleDeleteDevice(_id);
      },
      onError: (message) => {
        const messageError = errorMessage(message);
        if (messageError === null) return;

        toast.error(`Ошибка: ${messageError}`, { id });
        return;
      },
    });
  };

  return (
    <ItemLi>
      <ItemImg src="/robot.svg" alt="robot" />

      <ItemWrapper>
        <ItemP>{device}</ItemP>
        <p>
          {" "}
          {ip} <br /> {browser}
        </p>
      </ItemWrapper>

      <ItemButton onClick={handleDeleteToken} disabled={isDeletingToken}>
        Выйти
      </ItemButton>
    </ItemLi>
  );
}

const ItemLi = styled.li`
  display: flex;
  align-items: center;
  width: 100%;
  height: 172px;
  margin-bottom: 100px;
  background-color: var(--backgraund-color);
`;

const ItemImg = styled.img`
  width: 120px;
  height: 120px;
  object-fit: cover;
`;

const ItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  margin-left: 30px;
  color: var(--text-color);
  font-size: 40px;
  font-weight: 400;
`;

const ItemP = styled.p`
  margin-bottom: 19px;
  font-family: "montserrat";
  font-weight: 400;
`;

const ItemButton = styled.button`
  padding: 15px 84px;
  background-color: var(--violet-color);
  border-radius: 20px;
  color: #212121;
  font-size: 40px;
  font-weight: 400;
  display: block;
  margin-left: auto;
`;

export default DeviceItem;
