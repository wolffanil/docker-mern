import { $api, $apiAuth } from "../../context/AuthContext";
import { loginType, registerType } from "../../types";

const getMyIp = async () => {
  let ipAddress;
  await fetch("https://api.ipify.org?format=json")
    .then((response) => response.json())
    .then((data) => {
      ipAddress = data.ip;
    });

  return ipAddress;
};

export const register = async (data: registerType) => {
  try {
    const ip = await getMyIp();

    const res = await $api.post("/auth/register", {
      ...data,
      ip,
    });

    localStorage.setItem("token", res.data.userData.accessToken);

    localStorage.setItem("sessionId", res.data.userData.session.id);

    return res.data.userData.userData;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const login = async (data: loginType) => {
  try {
    const ip = await getMyIp();
    const res = await $api.post("/auth/login", {
      ...data,
      ip,
    });

    localStorage.setItem("token", res.data.userData.accessToken);

    localStorage.setItem("sessionId", res.data.userData.session.id);

    return res.data.userData.userData;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const logout = async () => {
  try {
    await $apiAuth.post("/auth/logout");

    localStorage.removeItem("sessionId");

    return;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const getCorrentAccount = async () => {
  try {
    const ip = await getMyIp();

    const res = await $api.post(`/auth/refresh`, { ip });

    localStorage.setItem("token", res.data.userData.accessToken);

    localStorage.setItem("sessionId", res.data.userData.session.id);

    return res.data.userData.userClean;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
