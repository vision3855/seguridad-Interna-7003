import React from "react";
import "./home.css";
import PatanaFlow from "../../components/PatanaFlow/PatanaFlow";
import ImageUpload from "../../trials";
import { Link } from "react-router";
import imgCO7003 from "../../assets/images/ismco7003.jpg";
import { menu } from "../../../../data";

const menuGood = menu.slice(1);

const Home = () => {
  return (
    <main>
      <title>CO 7003 Seguridad Interna</title>

      <div className="top-home">
        <div className="left-top-home">
          <h1>CO 7003</h1>
          <h3>Seguridad Interna Gonaïves</h3>
        </div>
        <div className="right-top-home">
          <img src={imgCO7003} alt="interior del centro" />
        </div>
      </div>
      <div className="center-home">
        <span className="center-title">Vamos a empezar aquí. El viaje importa.</span>
        <div className="center-tiles-wrapper">
          {menuGood.map((item) => (
            <Link className="center-home-tiles no-decoration" key={item.name} to={item.link}>
              <img src={item.icon} alt={`${item.name} picture`} />
              <span>{item.description}</span>
            </Link>
          ))}
        </div>
      </div>
      <div className="bottom-home">
        <span>Este sitio web no es oficial ni sustituye a los sistemas corporativos formales. Se proporciona como herramienta de apoyo interno para optimizar procesos operativos del equipo de seguridad local.</span> <br/>
        <span>La aplicación ha sido desarrollada y facilitada por el asistente Ralph Guerson. Para cualquier consulta o aclaración, puede contactarse a través del correo electrónico: ralph.guerson@ism.global
.</span> <br/>
        <span>Su uso es responsabilidad del usuario.</span>
      </div>
    </main>
  );
};

export default Home;
