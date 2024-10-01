import { NavLink, useNavigate } from "react-router-dom";
import { navLinks } from "../../constants/navLinks";
import styled from "styled-components";
import { useDarkMode } from "../../context/DarkModeProvider";
import { useLogout } from "../../libs/react-query/reactQueriesAndMutations";
import { useAuthContext } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";

type NavLinksProps = {
  setSettings: (b: boolean) => void;
};

function NavLinks({ setSettings }: NavLinksProps) {
  const { toggleDarkMode } = useDarkMode();
  const { mutate: logout, isPending: isLogoutLoading } = useLogout();
  const { handleLogoutFromSocket } = useSocket();
  const navigate = useNavigate();
  const { setUser, setIsAuthenticated } = useAuthContext();

  const handleLogout = () => {
    if (isLogoutLoading) return;
    localStorage.removeItem("token");
    localStorage.removeItem("sessionId");
    handleLogoutFromSocket();
    setUser(undefined);
    setIsAuthenticated(false);
    logout();
    navigate("/signin");
  };

  return (
    <WrapperSettings>
      {navLinks.map((links) => (
        <li className="nav__item_settings" key={links.title}>
          <NavLink to={links.link} className="nav__item_settings">
            <img
              src={links.img}
              alt={links.alt}
              className="nav__img_settings"
            />
            <p className="nav__title_settings">{links.title}</p>
          </NavLink>
        </li>
      ))}

      <li onClick={() => setSettings(false)} className="nav__item_settings">
        <img src="/nav/chats.svg" alt="chat" className="nav__img_settings" />
        <p className="nav__title_settings">Чаты</p>
      </li>
      <li className="nav__item_settings" onClick={toggleDarkMode}>
        <img src="/nav/theme.svg" alt="theme" className="nav__img_settings" />
        <p className="nav__title_settings">Тема</p>
      </li>
      <li className="nav__item_settings" onClick={handleLogout}>
        <img src="/nav/exit.svg" alt="exit" className="nav__img_settings" />
        <p className="nav__title_settings">Выход</p>
      </li>
    </WrapperSettings>
  );
}

const WrapperSettings = styled.ul`
  margin-top: 99px;
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 65px;

  .nav__item_settings {
    display: flex;
    min-width: 286px;
    column-gap: 33px;
    align-items: center;
    cursor: pointer;
  }

  .active {
    background-color: var(--backgraund-color);
    border-radius: 20px;
    padding: 15px 15px;
    border-left: 10px solid var(--violet-color);
  }

  .nav__img_settings {
    width: 45px;
    height: 45px;
  }

  .nav__title_settings {
    color: var(--text-color) !important;
    font-weight: 400;
    font-size: 30px;
  }
`;

export default NavLinks;
