import { Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";

import AuthLayout from "./__auth/AuthLayout";

const ChatPage = lazy(() => import("./__root/pages/ChatPage"));
const DevicePage = lazy(() => import("./__root/pages/DevicePage"));
const PageNotFound = lazy(() => import("./__root/pages/PageNotFound"));
const StartPage = lazy(() => import("./__root/pages/StartPage"));
const UpdateProfile = lazy(() => import("./__root/pages/UpdateProfile"));
const UsersPage = lazy(() => import("./__root/pages/UsersPage"));
const MyProfilePage = lazy(() => import("./__root/pages/MyProfilePage"));
const UserGroupPage = lazy(() => import("./__root/pages/UserGroupPage"));

const Login = lazy(() => import("./__auth/pages/Login"));
const Register = lazy(() => import("./__auth/pages/Register"));

import LoadingPage from "./components/ui/LoadingPage";
import RootLayout from "./__root/RootLayout";
import ProfileUserPage from "./__root/pages/ProfileUserPage";

function App() {
  return (
    <>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route
            path="signin"
            element={
              <Suspense fallback={<LoadingPage />}>
                <Login />
              </Suspense>
            }
          />
          <Route
            path="signup"
            element={
              <Suspense fallback={<LoadingPage />}>
                <Register />
              </Suspense>
            }
          />
        </Route>

        <Route element={<RootLayout />}>
          <Route index element={<StartPage />} />
          <Route
            path="update-profile"
            element={
              <Suspense fallback={<LoadingPage />}>
                <UpdateProfile />
              </Suspense>
            }
          />
          <Route
            path="devices"
            element={
              <Suspense fallback={<LoadingPage />}>
                <DevicePage />
              </Suspense>
            }
          />
          <Route
            path="users"
            element={
              <Suspense fallback={<LoadingPage />}>
                <UsersPage />
              </Suspense>
            }
          />
          <Route
            path="profile"
            element={
              <Suspense fallback={<LoadingPage />}>
                <MyProfilePage />
              </Suspense>
            }
          />
          <Route
            path="users/:id"
            element={
              <Suspense fallback={<LoadingPage />}>
                <ProfileUserPage />
              </Suspense>
            }
          />
          <Route
            path="users/group"
            element={
              <Suspense fallback={<LoadingPage />}>
                <UserGroupPage />
              </Suspense>
            }
          />
          <Route
            path="chat"
            element={
              <Suspense fallback={<LoadingPage />}>
                <ChatPage />
              </Suspense>
            }
          />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
