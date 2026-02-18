import React from "react";

import "./Tools.css";
import SingleWrapper from "../../components/Single-wrapper/SingleWrapper";
//import calcAlmImg from testo;

const Tools = ({ obj }) => {
  return (
    <div className="tools-wrapper">
      {obj.map((each) => (
        <SingleWrapper
          image={each.image}
          name={each.name}
          to={each.to}
          key={each.name}
        />
      ))}
    </div>
  );
};

export default Tools;
