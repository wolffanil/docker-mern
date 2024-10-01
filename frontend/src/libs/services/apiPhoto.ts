import { $apiAuth } from "../../context/AuthContext";

export async function uploadFile(file: File, path: string) {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const resFile = await $apiAuth.post(`/photo/${path}`, formData);

    const dataFile = resFile.data;

    if (resFile.status !== 200) {
      console.log(dataFile.message);
      throw new Error("Something went wrong");
    }

    const imageUrl = dataFile.imageUrl;
    return imageUrl;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}

export async function deleteFile(name: string, path: string) {
  const imageName = name.substring(name.lastIndexOf("/") + 1);

  try {
    const res = await $apiAuth.delete(`/photo/${path}/${imageName}`);

    if (res.status !== 200) {
      throw new Error("Что-то пошло не так");
    }

    return true;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}
