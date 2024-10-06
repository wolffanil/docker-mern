import { Outlet, useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import styled from "styled-components";
import { ErrorBoundary } from "react-error-boundary";

import { useAuthContext } from "../context/AuthContext";
import Model from "../components/ui/Model";

function AuthLayout() {
  const { isAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  if (isAuthenticated) navigate("/");

  console.log(import.meta.env.VITE_CHECK_URL, "GIT 6");

  return (
    <Wrapper>
      <LeftBlock>
        <Outlet />
      </LeftBlock>
      <RightBlock>
        <ErrorBoundary fallback={<div>Что то пошло не так</div>}>
          <Canvas
            camera={{
              fov: 45,
              near: 0.1,
              far: 2000,
              position: [-4.5, 1.5, 4],
            }}
          >
            <Model />
          </Canvas>
        </ErrorBoundary>
      </RightBlock>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  overflow-y: hidden;
`;

const LeftBlock = styled.section`
  background-color: var(--backgraund-color);
  width: 50%;
  padding: 60px 109px 20px 35px;
  max-height: 100vh;
`;

const RightBlock = styled.div`
  width: 50vw;
  background-color: var(--backgraund-color);
  height: 100vh;
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export default AuthLayout;
