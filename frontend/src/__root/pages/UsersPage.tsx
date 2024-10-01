import styled from "styled-components";

import UserItem from "../../components/ui/UserItem";
import { useGetUsers } from "../../libs/react-query/reactQueriesAndMutations";

function UsersPage() {
  const { data: users, isLoading } = useGetUsers();

  return (
    <Users>
      <UsersTitle>ПОЛЬЗОВАТЕЛИ</UsersTitle>

      {isLoading ? (
        <div>Загрузка...</div>
      ) : (
        <UsersBlock>
          {users?.map((user, i) => (
            <UserItem
              key={i}
              id={String(user.id)}
              name={user.name}
              username={user?.username || ""}
              img={user.photoProfile}
            />
          ))}
        </UsersBlock>
      )}
    </Users>
  );
}

const Users = styled.div`
  width: 920px;
  background-color: var(--backgraund-color);
`;

const UsersTitle = styled.h1`
  font-size: 45px;
  font-weight: 400;
  font-family: "redoctober";
  color: var(--violet-color);
`;

const UsersBlock = styled.div`
  margin-top: 72px;
  overflow-y: scroll;
  height: 855px;
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  align-items: start;
  width: 100%;
`;

export default UsersPage;
