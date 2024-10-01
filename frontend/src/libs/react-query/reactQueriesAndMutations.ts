import { login, logout, register } from "../services/apiAuth";
import {
  ChatType,
  CreateGroupType,
  MessageType,
  NewMessageType,
  NewProfileType,
  TokenType,
  UpdateDataGroupType,
  UserType,
  loginType,
  registerType,
} from "../../types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "./reactQueryKeys";
import { deleteToken, getTokens } from "../services/apiToken";
import {
  getAllUsers,
  getUsetById,
  updateMyProfile,
} from "../services/apiUsers";
import {
  addToGroup,
  changeDataGroup,
  createGroupChat,
  createNewChat,
  getMyChats,
  removeFromGroup,
} from "../services/apiChat";
import { createNewMessage, getAllMessages } from "../services/apiMessage";

export const useSignUpAccount = () => {
  return useMutation({
    mutationFn: (data: registerType) => register(data),
  });
};

export const useSignInAccount = () => {
  return useMutation({
    mutationFn: (data: loginType) => login(data),
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => logout(),
    onSettled: () => {
      queryClient.clear();
    },
  });
};

export const useGetTokens = () => {
  return useQuery({
    queryKey: [QueryKeys.GET_MY_TOKENS],
    queryFn: () => getTokens(),
    staleTime: Infinity,
  });
};

export const useDeleteToken = (Id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tokenId: string) => deleteToken(tokenId),
    onSuccess: () => {
      queryClient.setQueryData(
        [QueryKeys.GET_MY_TOKENS],
        (oldTokens: TokenType[]) =>
          oldTokens.filter((token) => token._id !== Id)
      );
    },
  });
};

export const useGetUsers = () => {
  return useQuery({
    queryKey: [QueryKeys.GET_USERS],
    queryFn: () => getAllUsers(),
    staleTime: 1000 * 60 * 2,
    refetchInterval: 1000 * 60 * 2,
  });
};

export const useGetUserById = (userId: string) => {
  return useQuery({
    queryKey: [QueryKeys.GET_USER_BY_ID, userId],
    queryFn: () => getUsetById(userId),
    staleTime: 1000 * 60 * 2,
    refetchInterval: 1000 * 60 * 2,
  });
};

export const useSearchUser = (search: string) => {
  return useQuery({
    queryKey: [QueryKeys.SEARCH_USERS, search],
    queryFn: () => getAllUsers(search),
    staleTime: 1000 * 60 * 2,
    enabled: !!search,
  });
};

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: (newProfile: NewProfileType) => updateMyProfile(newProfile),
  });
};

export const useGetMyChats = () => {
  return useQuery({
    queryKey: [QueryKeys.GET_MY_CHATS],
    queryFn: () => getMyChats(),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
};

export const useCreateChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => createNewChat(userId),

    onSuccess: (newChat: ChatType) => {
      queryClient.setQueryData(
        [QueryKeys.GET_MY_CHATS],
        (oldChats: ChatType[]) => {
          if (oldChats.find((chat) => chat._id === newChat._id)) return;
          return [newChat, ...oldChats];
        }
      );
    },
  });
};

export const useGetAllMessages = (chatId: string) => {
  return useQuery({
    queryKey: [QueryKeys.GET_MESSAGES_BY_CHAT_ID, chatId],
    queryFn: () => getAllMessages(chatId),
    staleTime: Infinity,
    enabled: !!chatId,
  });
};

export const useSendMessage = ({
  photoProfile,
  name,
  _id,
}: Pick<UserType, "photoProfile" | "_id" | "name">) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ content, chatId }: NewMessageType) =>
      createNewMessage({ content, chatId }),
    retry: false,
    onMutate: ({ content, chatId }: NewMessageType) => {
      const oldMessages: MessageType[] =
        queryClient.getQueryData([QueryKeys.GET_MESSAGES_BY_CHAT_ID, chatId]) ||
        [];

      const date = new Date();

      date.toISOString();

      const newMessage: MessageType = {
        _id: String(Date.now()),
        sender: {
          _id: _id || "",
          name,
          photoProfile,
        },
        content,
        createdAt: String(date),
      };

      queryClient.setQueryData(
        [QueryKeys.GET_MESSAGES_BY_CHAT_ID, chatId],
        (oldMessages: MessageType[]) => {
          return [...oldMessages, newMessage];
        }
      );

      return { oldMessages };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(
        [QueryKeys.GET_MESSAGES_BY_CHAT_ID, variables.chatId],
        context
      );
    },
    onSuccess: (message: MessageType, variables) => {
      queryClient.setQueryData(
        [QueryKeys.GET_MY_CHATS],
        (chats: ChatType[]) => {
          const updatedChats = chats.map((chat) =>
            chat._id === variables.chatId
              ? {
                  ...chat,
                  latestMessage: {
                    ...chat.latestMessage,
                    content: message.content,
                  },
                }
              : chat
          );

          const targetIndex = updatedChats.findIndex(
            (chat) => chat._id === variables.chatId
          );

          if (targetIndex !== -1) {
            const targetChat = updatedChats.splice(targetIndex, 1)[0];
            updatedChats.unshift(targetChat);
          }

          return updatedChats;
        }
      );
    },
  });
};

export const useCreateGroupChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ users, name, file }: CreateGroupType) =>
      createGroupChat({ users, name, file }),

    onSuccess: (newChat: ChatType) => {
      queryClient.setQueryData(
        [QueryKeys.GET_MY_CHATS],
        (oldChats: ChatType[]) => {
          return [newChat, ...oldChats];
        }
      );
    },
  });
};

export const useAddToGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ chatId, user }: { chatId: string; user: UserType }) =>
      addToGroup(chatId, user._id || ""),

    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        [QueryKeys.GET_MY_CHATS],
        (Chats: ChatType[]) => {
          return Chats.map((chat: ChatType) =>
            chat._id === variables.chatId
              ? { ...chat, users: [...chat.users, { ...variables.user }] }
              : chat
          );
        }
      );
    },
  });
};

export const useRemoveFromGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ chatId, userId }: { chatId: string; userId: string }) =>
      removeFromGroup(chatId, userId),

    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        [QueryKeys.GET_MY_CHATS],
        (Chats: ChatType[]) => {
          return Chats.map((chat: ChatType) =>
            chat._id === variables.chatId
              ? {
                  ...chat,
                  users: chat.users.filter((u) => u._id !== variables.userId),
                }
              : chat
          );
        }
      );
    },
  });
};

export const useChangeDataGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      chatName,
      chatId,
      backgroundUrl,
      file,
    }: UpdateDataGroupType) =>
      changeDataGroup({ chatName, chatId, backgroundUrl, file }),

    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        [QueryKeys.GET_MY_CHATS],
        (Chats: ChatType[]) => {
          return Chats.map((chat: ChatType) =>
            chat._id === variables.chatId
              ? {
                  ...chat,
                  chatName: variables.chatName,
                  background: data.background,
                }
              : chat
          );
        }
      );
    },
  });
};
