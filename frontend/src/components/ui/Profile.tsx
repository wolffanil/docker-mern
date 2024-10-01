import styled from "styled-components";
import { UserType } from "../../types";
import { Link } from "react-router-dom";
import { useState } from "react";

type version = "userProfile" | "groupProfile" | "myProfile";

type ProfileType = {
  ver: version;
  user: UserType;
  handleCreateChat?: () => void;
  isCreatingChat?: boolean;
  handleSearchUser?: (search: string) => void;
  handleAddUser?: () => void;
  isAddingToGroup?: boolean;
};

function Profile({
  ver,
  user,
  handleCreateChat,
  isCreatingChat,
  handleSearchUser,
  handleAddUser,
  isAddingToGroup,
}: ProfileType) {
  const [searchText, setSearchText] = useState("");

  return (
    <StyleProfile>
      <ProfileHeader>
        <ProfileTitle>ПРОФИЛЬ</ProfileTitle>
        {ver === "groupProfile" && (
          <ProfileSearch>
            <input
              type="text"
              className="profile__input"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <img
              role="button"
              src="/search.svg"
              alt="search"
              className="profile__input_img"
              onClick={() => {
                if (isAddingToGroup) return;
                if (searchText?.length <= 2) return;

                if (handleSearchUser) handleSearchUser(searchText);
              }}
            />
          </ProfileSearch>
        )}
      </ProfileHeader>

      <ProfileWrapper>
        <img src={user?.photoProfile} alt="profile" className="profile__img" />

        {/* {ver === "myProfile" ? (
          <div className="profile__info">
            <p>{user.name}</p>
            <p>{user?.username ? user.username : "Ника нету"}</p>
          </div>
        ) : (
          <p className="profile__info">{user.online ? "online" : "offline"}</p>
        )} */}

        <div className="profile__info">
          <p>{user?.name}</p>
          <p>{user?.username ? user.username : "Ника нету"}</p>
        </div>

        {ver === "groupProfile" ? (
          <img
            role="button"
            src="/addUser.svg"
            alt="addUser"
            className="profile__action"
            onClick={handleAddUser}
          />
        ) : ver === "myProfile" ? (
          <Link to="/update-profile" className="profile__action">
            <img role="button" src="/edit.svg" alt="edit" />
          </Link>
        ) : null}
      </ProfileWrapper>

      <ProfileDesc>Описание</ProfileDesc>

      <ProfileBio>{user?.bio ? user.bio : "Нету биографий :("}</ProfileBio>

      {ver !== "myProfile" && ver !== "groupProfile" && (
        <ProfileButton onClick={handleCreateChat} disabled={isCreatingChat}>
          {" "}
          Написать
        </ProfileButton>
      )}
    </StyleProfile>
  );
}

const StyleProfile = styled.div`
  width: 996px;
  background-color: var(--backgraund-color);
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ProfileTitle = styled.h1`
  font-size: 45px;
  font-weight: 400;
  font-family: "redoctober";
  color: var(--violet-color);
`;

const ProfileSearch = styled.div`
  display: flex;
  border: 1px solid var(--violet-color);
  align-items: center;
  justify-content: space-between;
  padding: 12px 25px;
  background-color: var(--grey-color);
  height: 79px;
  width: 590px;

  .profile__input {
    background-color: var(--grey-color);
    font-size: 25px;
    font-weight: 400;
    color: var(--text-color);
    height: 100%;
    width: 85%;
    outline: none;
  }

  .profile__input_img {
    width: 52px;
    height: 52px;
    object-fit: cover;
    cursor: pointer;
  }
`;

const ProfileWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 62px;
  width: 100%;

  .profile__img {
    height: 163px;
    width: 163px;
    object-fit: cover;
    border-radius: 80px;
  }

  .profile__info {
    display: flex;
    margin-left: 35px;
    flex-direction: column;
    row-gap: 18px;
    color: var(--violet-color);
    font-size: 45px;
    font-weight: 400;
  }

  .profile__action {
    display: block;
    width: 79px;
    height: 90px;
    object-fit: cover;
    margin-left: auto;
    cursor: pointer;
  }
`;

const ProfileDesc = styled.p`
  margin-top: 63px;
  color: var(--violet-color);
  font-size: 45px;
  font-weight: 400;
`;

const ProfileBio = styled.p`
  margin-top: 23px;
  font-size: 45px;
  font-weight: 400;
  color: var(--text-color);
  height: 250px;
  overflow-y: scroll;
`;

const ProfileButton = styled.button`
  display: block;
  padding: 22px 85px;
  background-color: var(--violet-color);
  border-radius: 20px;
  margin-left: auto;
  color: #212121;
  margin-top: 33px;
  font-size: 45px;
  font-weight: 400;
`;

export default Profile;
