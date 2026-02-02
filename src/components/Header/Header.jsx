import "./header.css";
import ismLogo from "../../../../images/logo-ism-media.png";
import { Link } from "react-router";
import { useRef } from "react";

const Header = () => {

  const hamburgerRef = useRef(null);
  const menuWrapperRef = useRef(null);

  const menu = [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "Informe",
      link: "/informe",
    },
    {
      name: "Tools",
      link: "/tools",
    },
  ];

  function toggleMenu() {
    hamburgerRef.current.classList.toggle('active');
    menuWrapperRef.current.classList.toggle('active');
  }

  function removeClass() {
    if (menuWrapperRef.current.classList.contains('active')){
      menuWrapperRef.current.classList.remove('active');
      hamburgerRef.current.classList.toggle('active');
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
        <Link to='/'><img className="main-logo" src={ismLogo} alt="ism logo" /></Link>
        
        <ul className="menu-wrapper" ref={menuWrapperRef} onClick={removeClass}>
          {menu.map((item) => (
            <li key={item.name} onClick={toggleBorderBottom}>
              <Link className="no-decoration" to={item.link}>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
        <p className="main-title">Seguridad Interna</p>
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
