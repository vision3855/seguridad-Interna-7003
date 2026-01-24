import React, { useRef, useState } from "react";
import axios from "axios";
import "./FormInput.css";

const FormInput = ({ setTextToShow, Products, setProducts }) => {
  const [driver, setDriver] = useState("");
  const [displayDriverArray, setDisplayDriverArray] = useState([]);
  const [displayDriverHTML, setDisplayDriverHTML] = useState("");

  const ISMRef = useRef(null);
  const terceroRef = useRef(null);
  const driverRef = useRef(null);
  const placaRef = useRef(null);
  const separadorRef = useRef(null);
  const fichaRef = useRef(null);
  const placaUnidadRef = useRef(null);
  const conduceDifRef = useRef(null);
  const entradaRef = useRef(null);
  const salidaRef = useRef(null);
  const displayDriver = useRef(null);

  async function driverSearch(event) {
    const textTyped = event.target.value;
    setDriver(textTyped);

    try {
      const response = await axios(
        `https://segintco7003.onrender.com/patana?driver=${textTyped}`,
      );

      const data = response.data.patanas;

      displayDriver.current.classList.add("show");

      // 1️⃣ Build results FIRST
      const htmlResults = data
        .filter((item) =>
          item.driver.toLowerCase().includes(textTyped.toLowerCase().trim()),
        )
        .map(
          (item) => `
        <div className="single-driver" data-placa="${item.placa} onClick=${selectDriver}">
          <span>${item.driver}</span>
          <span>${item.placa}</span>
        </div>
      `,
        );

      // 2️⃣ Then update state ONCE
      setDisplayDriverArray(htmlResults);
      setDisplayDriverHTML(htmlResults.join(" "));
    } catch (error) {
      console.log(error);
    }
  }

  function selectDriver() {
    console.log('tested');
    
  }

  function populateText() {
    const date = new Date();

    // European format (DD/MM/YYYY)
    const todayDate = date.toLocaleDateString("en-GB"); // "25/12/2024"

    const now = new Date();

    // 24-hour format
    const hourNow = now.toLocaleTimeString("en-GB"); // "14:30:45"

    let productString = "";
    if (!Products.length) {
      productString = "*****No hay producto*****";
    } else {
      productString = Products.join(", ");
    }

    if (terceroRef.current.checked) {
      conduceDifRef.current.checked
        ? setTextToShow(
            `Se recibió en el centro de Gonaïves una patana, procedente de la plantación de Limonade, con productos detallados a continuación. 

Chofer: ${driverRef.current.value}
Placa: TM ${placaRef.current.value}
Hora ingreso: ${hourNow}
Fecha: ${todayDate}

Producto: ${productString} 

Separadores: ${separadorRef.current.value || 147}  unidades
Paletas: 21 unidades

NOTA: CHOFER y PLACA no coinciden con los datos del conduce.
    `,
          )
        : setTextToShow(
            `Se recibió en el centro de Gonaïves una patana, procedente de la plantación de Limonade, con productos detallados a continuación. 

Chofer: ${driverRef.current.value}
Placa: TM ${placaRef.current.value}
Hora ingreso: ${hourNow}
Fecha: ${todayDate}

Producto: ${productString} 

Separadores: ${separadorRef.current.value || 147}  unidades
Paletas: 21 unidades`,
          );
    } else {
      setTextToShow(`
Se recibió en el centro de Gonaïves una patana ISM, procedente de la plantación de Limonade, con productos detallados a continuación. 

Chofer : ${driverRef.current.value}
Placa Unidad : ${placaUnidadRef.current.value}
Placa Cabezote ${placaRef.current.value}
Ficha : ${fichaRef.current.value}
Hora Ingreso : ${hourNow}
Fecha : ${todayDate}

Producto : ${productString} 

Separadores : ${separadorRef.current.value || 147}  unidades
Paletas : 21 unidades`);
    }
    setProducts([]);
  }

  return (
    <section className="record">
      <form className="form-record">
        <p className="top-title-text">Registro de nuevo camión</p>

        <div className="camion-type-wrapper">
          <div className="camion-type">
            <label htmlFor="ism-record">ISM</label>
            <input
              type="radio"
              name="camion-type"
              id="ism-record"
              ref={ISMRef}
            />
          </div>
          <div className="camion-type">
            <label htmlFor="tercero-record">TERCERO</label>
            <input
              type="radio"
              name="camion-type"
              id="tercero-record"
              ref={terceroRef}
              defaultChecked
            />
          </div>
        </div>

        <div className="driver-wrapper">
          <div className="nombre-wrapper">
            <label htmlFor="nombre-record">Nombre completo</label>
            <input
              type="text"
              name="nombre-record"
              id="nombre-record"
              ref={driverRef}
              value={driver}
              onChange={driverSearch}
            />
            <div
              className="display-driver"
              ref={displayDriver}
              dangerouslySetInnerHTML={{ __html: displayDriverHTML }}
            />
          </div>
          <div>
            <label htmlFor="placa-record">Placa</label>
            <input
              type="text"
              name="placa-record"
              id="placa-record"
              ref={placaRef}
            />
          </div>
        </div>

        <div className="separador">
          <label htmlFor="separador">Separadores</label>
          <input
            type="text"
            name="separador"
            id="separador"
            ref={separadorRef}
          />
        </div>
        <div className="ficha">
          <label htmlFor="ficha">Ficha</label>
          <input type="text" name="ficha" id="ficha" ref={fichaRef} />
        </div>
        <div className="placa-unidad">
          <label htmlFor="placa-unidad">Placa-unidad</label>
          <input
            type="text"
            name="placa-unidad"
            id="placa-unidad"
            ref={placaUnidadRef}
          />
        </div>

        <div className="conduce-differente">
          <label htmlFor="differente">conduce differente</label>
          <input
            type="radio"
            name="differente"
            id="differente"
            ref={conduceDifRef}
          />
        </div>

        <div className="bottom-button">
          <button
            type="button"
            className="record-camion-button"
            ref={entradaRef}
            onClick={() => {
              populateText();
            }}
          >
            Entrada
          </button>
          <button
            type="button"
            className="record-camion-button rec-salida"
            ref={salidaRef}
          >
            Salida
          </button>
        </div>
      </form>
    </section>
  );
};

export default FormInput;
