import React from "react";
import { Link } from "react-router";
import "./Tools.css";
import calcAlmImg from "../../assets/images/calc-img.jpeg";

const Tools = () => {
  return (
    <div>
      <Link className="element-wrapper" to="/tools/calculator">
        <div className="img-tools-wrapper">
          <span className="txt-cal">Calculator para Almacen</span>
          <img
            src={calcAlmImg}
            alt="image para representar calculator almacen"
          />
        </div>
        <div className="txt-tools-wrapper">Calculator para Almacen</div>
      </Link>
    </div>
  );
};

export default Tools;
