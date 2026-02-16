import React from "react";
import { Link } from "react-router";

const SingleWrapper = ({ image, name, to }) => {
  return (
    <div>
      <Link className="element-wrapper" to={to}>
        <div className="img-tools-wrapper">
          <span className="txt-cal">{name}</span>
          <img src={image} alt="image para representar calculator almacen" />
        </div>
        <div className="txt-tools-wrapper">{name}</div>
      </Link>
    </div>
  );
};

export default SingleWrapper;
