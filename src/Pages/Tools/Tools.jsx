import React from "react";

import "./Tools.css";
import SingleWrapper from "../../components/Single-wrapper/SingleWrapper";
//import calcAlmImg from testo;

const Tools = ({ obj }) => {
  return (
    <>
      {obj.map((each) => (
        <SingleWrapper
          image={each.image}
          name={each.name}
          to={each.to}
          key={each.name}
        />
      ))}
    </>
  );
};

export default Tools;
