import { NavLink } from "react-router-dom";
import styled, { css } from "styled-components";
import { formatTime } from "../../libs/utils";
import { useEffect, useRef } from "react";

type MessageItemProps = {
  img: string;
  name: string;
  data: string;
  message: string;
  userId: string;
  myId: string;
};

function MessageItem({
  userId,
  img,
  name,
  data,
  message,
  myId,
}: MessageItemProps) {
  const scroll = useRef<HTMLLIElement>();
  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [img]);

  const isMyMessage = userId == myId;

  return (
    <StyleMessageItem isMyMessage={isMyMessage} ref={scroll}>
      <NavLink to={isMyMessage ? "/profile" : `/users/${userId}`}>
        <MessageItemImg src={img} alt="profile" />
      </NavLink>
      <MessageItemWrapper isMyMessage={isMyMessage}>
        <div className="messageItem__info">
          <p className="messageItem__name">{name}</p>
          <p>{formatTime(data)}</p>
        </div>
        <p className="messageItem__message">{message}</p>
      </MessageItemWrapper>
    </StyleMessageItem>
  );
}

const StyleMessageItem = styled.li<{ isMyMessage: boolean }>`
  display: flex;
  min-height: 89px;
  min-width: 290px;
  margin-bottom: 40px;
  column-gap: 17px;
  align-items: center;
  margin-top: 50px;
  background-color: var(--backgraund-color);
  padding: 5px 5px;

  ${(props) =>
    props.isMyMessage
      ? css`
          margin-left: auto;
          flex-direction: row-reverse;
        `
      : css`
          margin-right: auto;
        `}
`;

const MessageItemImg = styled.img`
  cursor: pointer;
  width: 88px;
  height: 88px;
  object-fit: cover;
  border-radius: 80px;
`;

const MessageItemWrapper = styled.div<{ isMyMessage: boolean }>`
  display: flex;
  flex-direction: column;
  font-family: "montserrat";
  color: var(--text-color);
  font-size: 25px;
  font-weight: 400;
  row-gap: 5px;

  .messageItem__info {
    display: flex;
    column-gap: 20px;
    align-items: center;

    ${(props) =>
      props.isMyMessage &&
      css`
        flex-direction: row-reverse;
      `}
  }

  .messageItem__name {
    color: var(--violet-color);
    font-size: 35px;
  }

  .messageItem__message {
    font-size: 30px;
    max-width: 250px;

    ${(props) =>
      props.isMyMessage &&
      css`
        margin-left: auto;
      `}
  }
`;

export default MessageItem;
