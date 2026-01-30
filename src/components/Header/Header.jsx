import "./header.css";
import ismLogo from "../../../../images/logo-ism-media.png";
import { Link } from "react-router";

const Header = () => {
  const menu = [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "informe",
      link: "/informe",
    },
  ];

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
        <img className="main-logo" src={ismLogo} alt="ism logo" />
        <ul className="menu-wrapper">
          {menu.map((item) => (
            <li key={item.name} onClick={toggleBorderBottom}>
              <Link className="no-decoration" to={item.link}>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
        <p className="main-title">Seguridad Interna</p>
      </header>
    </div>
  );
};

export default Header;
