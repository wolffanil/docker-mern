export type UserType = {
  email: string;
  name: string;
  username?: string;
  bio?: string;
  id: string;
  _id?: string;
  photoProfile: string;
  isOnline: boolean;
  createdAt: Date;
};

export type registerType = {
  email: string;
  name: string;
  password: string;
};

export type loginType = {
  email: string;
  password: string;
};

export type TokenType = {
  _id: string;
  browser: string;
  device: string;
  ip: string;
};

export type NewProfileType = {
  name: string;
  username?: string;
  bio?: string;
  file: File[];
  imageUrl: string;
  isOnline?: boolean;
};

export type ChatType = {
  _id: string;
  chatName: string;
  isGroupChat: boolean;
  users: Omit<UserType, "bio" | "createdAt">[];
  background: string;
  latestMessage?: {
    _id: string;
    sender: UserType;
    content: string;
  };
  groupAdmin?: UserType;
};

export type NewMessageType = {
  content: string;
  chatId: string;
};

export type MessageType = {
  _id: string;
  sender: {
    _id: string;
    name: string;
    photoProfile: string;
  };
  content: string;
  createdAt: string;
  chat: string;
};

export type UpdateDataGroupType = {
  chatId: string;
  chatName: string;
  backgroundUrl: string;
  file: File[];
};

export type CreateGroupType = {
  users: string[];
  name: string;
  file: File[];
};
