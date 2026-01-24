import React from "react";
import "./header.css"
import ismLogo from "../../../../images/logo-ism-media.png"

const Header = () => {
  return (
    <div>
      <header>
        <img className="main-logo" src={ismLogo} alt="ism logo" />
        <p className="main-title">Seguridad Interna</p>
      </header>
    </div>
  );
};

export default Header;
