import axios from "axios";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { ChatType, UserType } from "../types";
import { getCorrentAccount } from "../libs/services/apiAuth";

export const API_URL = import.meta.env.VITE_API_URL;

export const $apiAuth = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

export const $api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

interface AuthContextProps {
  user: UserType | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: UserType | undefined) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  checkAuthUser: () => void;
  selectedChat: ChatType | undefined;
  setSelectedChat: (chat: ChatType) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [selectedChat, setSelectedChat] = useState<ChatType | undefined>(
    undefined
  );

  const checkAuthUser = async () => {
    try {
      setIsLoading(true);
      const currentAccount = await getCorrentAccount();

      if (currentAccount) {
        setIsAuthenticated(true);
        setUser({
          id: currentAccount.id,
          name: currentAccount.name,
          username: currentAccount?.username || "",
          email: currentAccount.email,
          isOnline: currentAccount.isOnline,
          bio: currentAccount?.bio || "",
          photoProfile: currentAccount.photoProfile,
          createdAt: currentAccount.createdAt,
        });

        return true;
      }

      return false;
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  $apiAuth.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  });

  $apiAuth.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      if (
        (error.response.status === 401 ||
          error.response.data.message === "jwt expired") &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;
        try {
          const response = await $api.post(`${API_URL}/auth/refresh`, {
            withCredentials: true,
          });

          const user: UserType = response.data.userData.userClean;

          localStorage.setItem("token", response.data.userData.accessToken);
          setUser({
            id: user.id,
            name: user.name,
            username: user?.username || "",
            email: user.email,
            isOnline: user.isOnline,
            bio: user?.bio || "",
            photoProfile: user.photoProfile,
            createdAt: user.createdAt,
          });
          return $apiAuth(originalRequest);
        } catch (e) {
          console.log("Unauthorized");
          setUser(undefined);
          setIsAuthenticated(false);
        }
      }
      throw error;
    }
  );

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token === "[]" || token === null || isAuthenticated) {
      return;
    }

    checkAuthUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoading,
        isAuthenticated,
        setIsAuthenticated,
        setIsLoading,
        checkAuthUser,
        selectedChat,
        setSelectedChat,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("context was used outline a AuthContext");
  return context;
};

export { AuthProvider, useAuthContext };
