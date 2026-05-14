import "./TemplateIngreso.css";
import copyImg from "../../../assets/images/copy.png";
import { copyText } from "../../../utils/util";

import React, { useEffect } from "react";

const driversData = [
  { name: "Octelus Clemson", Placa: "Z506939", type: "ISM" },
  { name: "Fleurvil Patrick", Placa: "IT 00041", type: "ISM" },
  { name: "Bathelemy Charlot", Placa: "Z506607", type: "ISM" },
  { name: "Duken Eloisin", Placa: "Z506603", type: "ISM" },
  { name: "Jean Claude Petit-Homme", Placa: "Z506491", type: "ISM" },
  { name: "Rigaud Gady", Placa: "TM 86295", type: "TERCERO" },
  { name: "Macsene Derissier", Placa: "TM 85923", type: "TERCERO" },
  { name: "Pierre Garcia", Placa: "TM 06479", type: "TERCERO" },
  { name: "Alex Jean-Baptiste", Placa: "TM 87420", type: "TERCERO" },
];

const TemplateIngreso = () => {
  const [outputText, setOutputText] = React.useState("");
  const [restante, setRestante] = React.useState({ paquetes: 0, unidades: 0 });
  const [ifVacio, setIfVacio] = React.useState(true);
  const [isVisible, setIsVisible] = React.useState(true);
  const [isIngreso, setIsIngreso] = React.useState(false);
  const selectRef = React.useRef(null);
  const vacioRef = React.useRef(null);
  const restanteRef = React.useRef(null);
  const paquetesRef = React.useRef(null);
  const unidadesRef = React.useRef(null);
  const container = React.useRef(null);

  function handleRestante() {
    setRestante({
      paquetes: paquetesRef.current.value,
      unidades: unidadesRef.current.value,
    });
  }

  function handleChoferText() {
    const date = new Date();
    const hourNow = date.toLocaleTimeString("en-GB");

    const actualData = driversData.find(
      (driver) => driver.name === selectRef.current.value,
    );

    if (isIngreso) {
      if (ifVacio) {
        setOutputText(`Ingresó al centro el chofer de distribución ${actualData.type}
${actualData.name} con placa ${actualData.Placa}

hora de ingreso: ${hourNow.slice(0, 5)} 
Nota: Vacio.
      `);
      } else {
        setOutputText(`Ingresó al centro el chofer de distribución ${actualData.type}
${actualData.name} con placa ${actualData.Placa} con el siguiente restante:

Paquetes: ${restante.paquetes}
Unidades: ${restante.unidades}

hora de ingreso: ${hourNow.slice(0, 5)} 
      `);
      }
    } else {
      setOutputText(`Sale del centro el chofer de distribución ${actualData.type}
${actualData.name} con placa ${actualData.Placa}

Paquetes: ${restante.paquetes}
Unidades: ${restante.unidades}

hora de salida: ${hourNow.slice(0, 5)} 

      `);
    }
  }

  useEffect(() => {
    handleChoferText();
  }, [ifVacio, restante, isIngreso]);

  useEffect(() => {
    if (isIngreso) {
      if (vacioRef.current) {
        if (vacioRef?.current?.checked) {
          console.log("here i'm");

          setIfVacio(true);
          setIsVisible(false);
        }
      }
    }
  }, [isIngreso]);

  return (
    <div className="main-container-template-ingreso">
      <div className="wrapper-ingreso-choffer-template">
        <div className="lab-input-global-wrapper">
          <div className="label-input">
            <label htmlFor="salida-patana-separadores">Ingreso</label>
            <input
              type="radio"
              name="in-out-choice"
              id="salida-patana-separadores"
              onChange={() => setIsIngreso(true)}
            />
          </div>
          <div className="label-input">
            <label htmlFor="salida-patana-productos">Salida</label>
            <input
              type="radio"
              name="in-out-choice"
              id="salida-patana-productos"
              onChange={() => {
                setIsIngreso(false);
                setIsVisible(true);
              }}
              defaultChecked
            />
          </div>
        </div>

        {isIngreso && (
          <div className="ingreso-type-template">
            <label className="switch">
              <input
                type="radio"
                name="toggle"
                value="vacio"
                ref={vacioRef}
                onClick={() => {
                  setIfVacio(true);
                  setIsVisible(false);
                }}
                defaultChecked
              />
              <span className="slider">vacio</span>
            </label>

            <label className="switch">
              <input
                type="radio"
                name="toggle"
                value="Restante"
                ref={restanteRef}
                onClick={() => {
                  setIfVacio(false);
                  setIsVisible(true);
                }}
              />
              <span className="slider">Restante</span>
            </label>
          </div>
        )}

        <div className="select-driver-ingreso-template">
          <label htmlFor="chofer">Chofer:</label>
          <select
            id="chofer"
            name="chofer"
            onChange={handleChoferText}
            ref={selectRef}
          >
            {driversData.map((driver, index) => (
              <option key={index} value={driver.name}>
                {driver.name}
              </option>
            ))}
          </select>
        </div>

        {isVisible && (
          <div className="display-pqt-un">
            <label htmlFor="paquetes-restante">Paquetes:</label>
            <input
              onInput={() => {
                setRestante((prev) => ({
                  ...prev,
                  paquetes: paquetesRef.current.value,
                }));
              }}
              type="number"
              name="paquetes-restante"
              id="paquetes-restante"
              ref={paquetesRef}
            />
            <label htmlFor="unidades-restante">Unidades:</label>
            <input
              onInput={() => {
                setRestante((prev) => ({
                  ...prev,
                  unidades: unidadesRef.current.value,
                }));
              }}
              type="number"
              name="unidades-restante"
              id="unidades-restante"
              ref={unidadesRef}
            />
          </div>
        )}

        <div className="ingreso-template-output" ref={container}>
          <img
            className="copy-button-ingreso"
            src={copyImg}
            alt="copy button logo"
            onClick={() => {
              copyText(container.current.textContent);
            }}
          />

          {outputText && <p>{outputText}</p>}
        </div>
      </div>
    </div>
  );
};

export default TemplateIngreso;
