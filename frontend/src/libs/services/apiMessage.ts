import { $apiAuth } from "../../context/AuthContext";
import { MessageType, NewMessageType } from "../../types";

export const getAllMessages = async (
  chatId: string
): Promise<MessageType[]> => {
  try {
    const res = await $apiAuth.get(`/messages/${chatId}`);

    return res.data.messages;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const createNewMessage = async ({
  content,
  chatId,
}: NewMessageType): Promise<MessageType> => {
  try {
    const res = await $apiAuth.post("/messages", {
      content,
      chatId,
    });

    return res.data.message;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
