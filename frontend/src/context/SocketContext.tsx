import io from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import toast from "react-hot-toast";
import { createContext, useContext, useEffect } from "react";

import { useAuthContext } from "./AuthContext";
import { ChatType, MessageType, UserType } from "../types";
import { QueryKeys } from "../libs/react-query/reactQueryKeys";
import { useGetMyChats } from "../libs/react-query/reactQueriesAndMutations";

type removeFromGroupType = {
  userId: string;
  chatId: string;
  chatName: string;
};

type SocketContextType = {
  sendMessageToSocket: (message: MessageType) => void;
  handleLogoutFromSocket: () => void;
  handleDeleteDevice: (sessionId: string) => void;
  handleCreateGroupToSocket: ({
    users,
    chatName,
    groupAdmin,
  }: {
    users: string[];
    chatName: string;
    groupAdmin: string;
  }) => void;
  handleRemoveFromGroupSocket: ({
    userId,
    chatId,
    chatName,
  }: removeFromGroupType) => void;
  handleAddToGroupSocket: ({
    userId,
    chatName,
  }: {
    userId: string;
    chatName: string;
  }) => void;
};

const SocketContext = createContext<SocketContextType | undefined>(undefined);

let socket;
const ENPOINT = "https://api.debilgram.ru/";

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, selectedChat, setSelectedChat, setUser } = useAuthContext();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: existChats } = useGetMyChats();
  const { pathname } = useLocation();

  // connect
  useEffect(() => {
    if (!user) return;

    socket = io(ENPOINT);

    const sessionId = localStorage.getItem("sessionId") || "";
    socket.emit("setup", { userData: user, sessionId });
  }, [user]);

  // on Online
  useEffect(() => {
    if (!socket) return;
    socket.on("online", (id: string) => {
      queryClient.setQueryData(
        [QueryKeys.GET_MY_CHATS],
        (chats: ChatType[]) => {
          return chats.map((chat) => {
            const hasUser = chat.users.some((user) => user._id === id);

            if (hasUser) {
              const fixChat = {
                ...chat,
                users: chat.users.map((user) =>
                  user._id === id ? { ...user, isOnline: true } : user
                ),
              };
              if (selectedChat?._id === chat._id) {
                setSelectedChat(fixChat);
              }
              return fixChat;
            } else {
              return chat;
            }
          });
        }
      );
    });

    return () => {
      socket.off("online");
    };
  }, []);

  // emit online
  useEffect(() => {
    if (!socket || !existChats) return;
    const users: UserType[] | [] = [];

    const chats: ChatType[] =
      queryClient.getQueryData([QueryKeys.GET_MY_CHATS]) || [];

    chats.forEach((chat) => {
      if (chat.isGroupChat) return;
      chat.users.forEach((u: UserType) => {
        if (u._id !== user?.id) {
          users.push(u);
        }
      });
    });

    socket.emit("online", { users, id: user?.id });
  }, [existChats]);

  // on offline
  useEffect(() => {
    if (!socket) return;
    socket.on("offline", (id: string) => {
      queryClient.setQueryData(
        [QueryKeys.GET_MY_CHATS],
        (chats: ChatType[]) => {
          return chats.map((chat) => {
            const hasUser = chat.users.some((user) => user._id === id);

            if (hasUser) {
              const fixChat = {
                ...chat,
                users: chat.users.map((user) =>
                  user._id === id ? { ...user, isOnline: false } : user
                ),
              };
              if (selectedChat?._id === chat._id) {
                setSelectedChat(fixChat);
              }
              return fixChat;
            } else {
              return chat;
            }
          });
        }
      );
    });

    return () => {
      socket.off("offline");
    };
  }, []);

  // on signin
  useEffect(() => {
    if (!socket) return;

    socket.on("signin", (sessionId: string) => {
      if (!localStorage.getItem("sessionId")) return;
      if (sessionId === localStorage.getItem("sessionId")) return;
      toast.success("Вошли в твой аккаунт");
      queryClient.refetchQueries([QueryKeys.GET_MY_TOKENS]);
    });

    return () => {
      socket.off("singin");
    };
  }, []);

  // on deleteMyDevice
  useEffect(() => {
    if (!socket) return;

    socket.on("deleteMyDevice", (sessionId: string) => {
      if (sessionId !== localStorage.getItem("sessionId")) return;

      setUser({});
      setSelectedChat({});
      queryClient.clear();
      localStorage.removeItem("token");
      localStorage.removeItem("sessionId");
      navigate("/signin");
      toast.success("Вас удалил из устройств");
    });

    return () => {
      socket.off("deleteMyDevice");
    };
  }, []);

  // on new message
  useEffect(() => {
    if (!socket) return;

    socket.on(
      "message recieved",
      ({ chatId, message }: { chatId: string; message: MessageType }) => {
        let currentChat;

        queryClient.setQueryData(
          [QueryKeys.GET_MY_CHATS],
          (chats: ChatType[]) => {
            const updatedChats = chats.map((chat) =>
              chat._id === chatId
                ? {
                    ...chat,
                    latestMessage: {
                      ...chat.latestMessage,
                      content: message.content,
                      sender: message.sender,
                    },
                  }
                : chat
            );

            const targetIndex = updatedChats.findIndex(
              (chat) => chat._id === chatId
            );
            currentChat = updatedChats.find((chat) => chat._id === chatId);

            if (targetIndex !== -1) {
              const targetChat = updatedChats.splice(targetIndex, 1)[0];
              updatedChats.unshift(targetChat);
            }

            return updatedChats;
          }
        );

        if (!currentChat) {
          queryClient.refetchQueries([QueryKeys.GET_MY_CHATS]);
        }

        queryClient.setQueryData(
          [QueryKeys.GET_MESSAGES_BY_CHAT_ID, chatId],
          (messages: MessageType[]) => {
            if (!messages) return;
            return [...messages, message];
          }
        );

        if (chatId !== selectedChat?._id || pathname !== "/chat") {
          toast((t) => (
            <MessageBlock>
              <MessageImg
                src={message.sender?.photoProfile}
                alt="photoProfile"
              />
              <MessageContent>
                {!currentChat
                  ? "У вас новый собеседник"
                  : message.content.length > 10
                  ? message.content.slice(1, 10) + "..."
                  : message.content}
              </MessageContent>
              {currentChat && (
                <MessageButton
                  onClick={() => {
                    setSelectedChat(currentChat);
                    navigate("/chat");
                    toast.dismiss(t.id);
                  }}
                >
                  Чат
                </MessageButton>
              )}
            </MessageBlock>
          ));
        }
      }
    );

    return () => {
      socket.off("message recieved");
    };
  }, [selectedChat, pathname]);

  // emit offline
  useEffect(() => {
    const handleUnload = () => {
      if (!socket) return;

      const users: UserType[] | [] = [];

      const chats: ChatType[] =
        queryClient.getQueryData([QueryKeys.GET_MY_CHATS]) || [];

      chats.forEach((chat) => {
        if (chat.isGroupChat) return;
        chat.users.forEach((u: UserType) => {
          if (u._id !== user?.id) {
            users.push(u);
          }
        });
      });

      socket.emit("offline", { users, id: user?.id });
      socket.emit("leaveRoom", user?.id);
    };
    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  // on createGroup
  useEffect(() => {
    if (!socket) return;
    socket.on("createGroup", (chatName: string) => {
      queryClient.refetchQueries([QueryKeys.GET_MY_CHATS]);
      toast.success(`Вас добавели в группу ${chatName}`);
    });

    return () => {
      socket.off("createGroup");
    };
  }, []);

  // on addTogroup
  useEffect(() => {
    if (!socket) return;

    socket.on("addToGroup", (chatName: string) => {
      queryClient.refetchQueries([QueryKeys.GET_MY_CHATS]);
      toast.success(`Вас дабавели в группу - ${chatName}`);
    });

    return () => {
      socket.off("addToGroup");
    };
  }, []);

  // on removeFromGRoup
  useEffect(() => {
    if (!socket) return;

    socket.on(
      "removeFromGroup",
      ({ chatId, chatName }: removeFromGroupType) => {
        queryClient.setQueryData(
          [QueryKeys.GET_MY_CHATS],
          (chats: ChatType[]) => {
            const freshChats = chats.filter((c) => c._id !== chatId);
            return freshChats;
          }
        );
        toast.success(`Вас удалили из группу - ${chatName}`);
      }
    );

    return () => {
      socket.off("removeFromGroup");
    };
  }, []);

  // on deleteUserGromGroup and on addUserInGroup

  useEffect(() => {
    if (!socket) return;

    socket.on("newUserInGroup", () => {
      queryClient.refetchQueries([QueryKeys.GET_MY_CHATS]);
    });

    socket.on(
      "deleteUserInGroup",
      ({ chatId, userId }: { chatId: string; userId: string }) => {
        queryClient.setQueryData(
          [QueryKeys.GET_MY_CHATS],
          (chats: ChatType[]) => {
            return chats.map((chat) =>
              chat._id === chatId
                ? {
                    ...chat,
                    users: chat.users.filter(
                      (u: UserType[]) => u._id !== userId
                    ),
                  }
                : chat
            );
          }
        );
      }
    );

    return () => {
      socket.off("newUserInGroup");
      socket.off("deleteUserInGroup");
    };
  }, []);

  // emit offline
  const handleLogoutFromSocket = () => {
    const users: UserType[] | [] = [];

    const chats: ChatType[] =
      queryClient.getQueryData([QueryKeys.GET_MY_CHATS]) || [];

    chats.forEach((chat) => {
      if (chat.isGroupChat) return;
      chat.users.forEach((u: UserType) => {
        if (u._id !== user?.id) {
          users.push(u);
        }
      });
    });

    socket.emit("offline", { users, id: user?.id });
    socket.emit("leaveRoom", user?.id);
  };

  const handleDeleteDevice = (sessionId: string) => {
    if (!socket) return;

    socket.emit("deleteDevice", { myId: user?.id, sessionId });
  };

  // emit message
  const sendMessageToSocket = (message: MessageType) => {
    if (!socket) return;
    socket.emit("new message", { newMessage: message, chat: selectedChat });
  };

  const handleAddToGroupSocket = ({
    userId,
    chatName,
  }: {
    userId: string;
    chatName: string;
  }) => {
    if (!socket) return;

    const users = selectedChat?.users
      .filter((user) => user._id !== user.id)
      .map((user) => user._id);

    socket.emit("addToGroup", {
      userId,
      chatName,
      usersGroup: users,
    });
  };

  const handleRemoveFromGroupSocket = ({
    userId,
    chatId,
    chatName,
  }: removeFromGroupType) => {
    if (!socket) return;

    const users = selectedChat?.users
      .filter((user) => user._id !== user.id)
      .map((u) => u._id);

    socket.emit("removeFromGroup", {
      userId,
      chatId,
      chatName,
      usersGroup: users,
    });
  };

  const handleCreateGroupToSocket = ({
    users,
    chatName,
    groupAdmin,
  }: {
    users: string[];
    chatName: string;
    groupAdmin: string;
  }) => {
    if (!socket) return;

    socket.emit("createGroup", { users, chatName, groupAdmin });
  };

  return (
    <SocketContext.Provider
      value={{
        sendMessageToSocket,
        handleLogoutFromSocket,
        handleDeleteDevice,
        handleCreateGroupToSocket,
        handleRemoveFromGroupSocket,
        handleAddToGroupSocket,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined)
    throw new Error("context was used outline a DarkModeProvider");
  return context;
};

export { SocketProvider, useSocket };

const MessageBlock = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 200px;
`;

const MessageImg = styled.img`
  border-radius: 60px;
  max-width: 60px;
  max-height: 60px;
  object-fit: cover;
`;

const MessageButton = styled.button`
  background-color: var(--violet-color);
  color: var(--text-color);
  padding: 5px 5px;
  font-size: 15px;
`;

const MessageContent = styled.p`
  font-size: 20px;
  color: var(--text-color);
  margin-left: 10px;
`;
