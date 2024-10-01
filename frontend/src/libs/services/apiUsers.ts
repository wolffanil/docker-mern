import { $apiAuth } from "../../context/AuthContext";
import { NewProfileType, UserType } from "../../types";
import { deleteFile, uploadFile } from "./apiPhoto";

export const getAllUsers = async (query: string = ""): Promise<UserType[]> => {
  try {
    const res = await $apiAuth.get(`/users?q=${query}`);

    return res.data.users;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const getUsetById = async (userId: string): Promise<UserType> => {
  try {
    const res = await $apiAuth.get(`/users/${userId}`);

    return res.data.user;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const updateMyProfile = async (
  profile: NewProfileType
): Promise<UserType> => {
  const hasFileToUpdate = profile.file.length > 0;

  try {
    let image = profile.imageUrl;

    if (hasFileToUpdate) {
      const uploadedFile = await uploadFile(
        profile.file[0],
        "uploadProfilePhoto"
      );

      if (!uploadedFile) {
        throw Error;
      }

      if (!image.endsWith("default.svg")) {
        deleteFile(image, "deleteBgPhoto");
      }

      image = uploadedFile;
    }

    const res = await $apiAuth.patch("/users/updateMyProfile", {
      name: profile.name,
      username: profile.username,
      bio: profile.bio,
      photoProfile: image,
      isOnline: profile.isOnline || true,
    });

    if (res.status !== 200) {
      if (!image.endsWith("default.svg"))
        deleteFile(image, "deleteProfilePhoto");

      throw new Error(`Что-то пошло не так`);
    }

    return res.data.profile;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
