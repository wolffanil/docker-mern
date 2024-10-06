import { memo, useState } from "react";
import NavChats from "../ui/NavChats";
import NavLinks from "../ui/NavLinks";
import styled from "styled-components";

function LeftSidebar() {
  const [settings, setSettings] = useState(false);
  return (
    <Nav>
      <h1 className="nav__title">
        {" "}
        <img src="/logo.svg" alt="logo" />
        ДЕБИЛГРАММ 6
      </h1>

      {!settings ? (
        <NavChats setSettings={setSettings} />
      ) : (
        <NavLinks setSettings={setSettings} />
      )}
    </Nav>
  );
}

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 600px;
  min-height: 1073px;
  /* overflow-y: scroll; */
  background-color: var(--grey-color);
  border-right: 1px solid var(--violet-color);
  padding: 60px 33px 0px 42px;
  position: fixed;
  left: 0;
  top: 0;

  .nav__title {
    display: flex;
    column-gap: 33px;
    color: var(--violet-color);
    font-size: 50px;
    font-family: "redoctober";
    font-weight: 400;
  }
`;

export default LeftSidebar;
