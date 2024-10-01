import { $apiAuth } from "../../context/AuthContext";

export const getTokens = async () => {
  try {
    const res = await $apiAuth.get("/users/my-tokens");

    return res.data.tokens;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const deleteToken = async (tokenId: string) => {
  try {
    const res = await $apiAuth.delete(`/users/deleteMyToken/${tokenId}`);

    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
