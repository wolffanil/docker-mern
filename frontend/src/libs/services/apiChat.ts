import { $apiAuth } from "../../context/AuthContext";
import { ChatType, CreateGroupType, UpdateDataGroupType } from "../../types";
import { deleteFile, uploadFile } from "./apiPhoto";

export const getMyChats = async (): Promise<ChatType[]> => {
  try {
    const res = await $apiAuth.get("/chats");

    return res.data.chats;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const createNewChat = async (userId: string): Promise<ChatType> => {
  try {
    const res = await $apiAuth.post("/chats", {
      userId,
    });

    return res.data.chat;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const createGroupChat = async ({
  users,
  name,
  file,
}: CreateGroupType): Promise<ChatType> => {
  try {
    let uploadedFile;
    if (file.length > 0) {
      uploadedFile = await uploadFile(file[0], "uploadBgPhoto");
    }

    const res = await $apiAuth.post("/chats/group", {
      clients: JSON.stringify(users),
      name,
      background: uploadedFile || "",
    });

    return res.data.chat;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const addToGroup = async (chatId: string, userId: string) => {
  try {
    const res = await $apiAuth.patch("/chats/groupadd", {
      chatId,
      userId,
    });

    return res.data.chat;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const removeFromGroup = async (
  chatId: string,
  userId: string
): Promise<ChatType> => {
  try {
    const res = await $apiAuth.patch("/chats/groupremove", {
      chatId,
      userId,
    });

    return res.data.chat;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const changeDataGroup = async ({
  chatId,
  file,
  backgroundUrl,
  chatName,
}: UpdateDataGroupType): Promise<ChatType> => {
  const hasFileToUpdate = file.length > 0;

  try {
    let image = backgroundUrl;

    if (hasFileToUpdate) {
      const uploadedFile = await uploadFile(file[0], "uploadBgPhoto");

      if (!uploadedFile) {
        throw Error;
      }

      if (backgroundUrl !== "") deleteFile(image, "deleteBgPhoto");

      image = uploadedFile;
    }

    const res = await $apiAuth.patch(`/chats/${chatId}`, {
      chatName,
      background: image,
    });

    return res.data.chat;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
