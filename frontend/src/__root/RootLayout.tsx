import { Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useEffect } from "react";

import LeftSidebar from "../components/shared/LeftSidebar";
import { useAuthContext } from "../context/AuthContext";
import { SocketProvider } from "../context/SocketContext";

function RootLayout() {
  const { isLoading, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) navigate("/signin");
  }, [isLoading]);

  return (
    <Layout>
      <SocketProvider>
        {/* Topbar  */}
        <LeftSidebar />
        <section className="layout__section">
          <Outlet />
        </section>
        {/* Bottombar */}
      </SocketProvider>
    </Layout>
  );
}

const Layout = styled.div`
  width: 100%;
  display: flex;

  .layout__section {
    margin-left: 600px;
    width: 100%;
    height: 100vh;
    padding: 65px 0px 0px 183px;
    background-color: var(--backgraund-color);
  }
`;

export default RootLayout;
