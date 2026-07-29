import "./header.css";
import ismLogo from "../../assets/images/logo-ism-media.jpg";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { menu } from "../../../data";
import userImg from "../../assets/images/user.png";
import { useUser } from "../../contexts/context";

const Header = () => {
  const { user, login } = useUser();

  const hamburgerRef = useRef(null);
  const menuWrapperRef = useRef(null);

  function toggleMenu() {
    hamburgerRef.current.classList.toggle("active");
    menuWrapperRef.current.classList.toggle("active");
  }

  function removeClass() {
    if (menuWrapperRef.current.classList.contains("active")) {
      menuWrapperRef.current.classList.remove("active");
      hamburgerRef.current.classList.toggle("active");
    }
  }

  function toggleBorderBottom(e) {
    // Remove border-bottom from all li elements
    const allItems = e.currentTarget.parentElement.querySelectorAll("li");
    allItems.forEach((item) => item.classList.remove("border-bottom"));

    // Add border-bottom to the clicked element
    e.currentTarget.classList.add("border-bottom");
  }

  return (
    <div>
      <header>
        <Link to="/">
          <img className="main-logo" src={ismLogo} alt="ism logo" />
        </Link>

        <ul className="menu-wrapper" ref={menuWrapperRef} onClick={removeClass}>
          {menu.map((item) => (
            <li key={item.name} onClick={toggleBorderBottom}>
              <Link className="no-decoration" to={item.link}>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
        {user ? (
          <div className="auth-user-area">
            <Link to={user?.data.name ? "/profile" : "/auth"}>
              <img className="user-area-auth" src={userImg} />
            </Link>
            <p>Saludo {user?.data.name}!</p>
          </div>
        ) : (
          <Link to="/auth">
            <img className="user-area" src={userImg} />
          </Link>
        )}

        <div className="toggle-menu" onClick={toggleMenu} ref={hamburgerRef}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
      </header>
    </div>
  );
};

export default Header;
