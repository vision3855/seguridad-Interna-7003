import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./FormInput.css";

const FormInput = ({
  setTextToShow,
  Products,
  setProducts,
  setAlertMessage,
}) => {
  const [displayDriverArray, setDisplayDriverArray] = useState([]);
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
    const value = event.target.value;

    if (!value.trim()) {
      setDisplayDriverArray([]);
      return;
    }

    try {
      const response = await axios(
        `https://segintco7003.onrender.com/patana?driver=${value}`,
      );

      const data = response.data?.patanas ?? [];

      const filtered = data.filter((item) =>
        item.driver?.toLowerCase().includes(value.toLowerCase().trim()),
      );

      setDisplayDriverArray(filtered);
      displayDriver.current.classList.add("show");
    } catch (error) {
      console.log("API error:", error);
    }
  }

  function selectDriver(item) {
    if (item.patanaType === "TERCERO") {
      driverRef.current.value = item.driver;
      placaRef.current.value = item.placa;
    }
    if (item.patanaType === "ISM") {
      driverRef.current.value = item.driver;
      placaRef.current.value = item.placa;
      fichaRef.current.value = item.ficha;
      placaUnidadRef.current.value = item.placaUnidad;
    }
    displayDriver.current.classList.remove("show");
  }

  useEffect(() => {
    function removeClass() {
      if (
        !displayDriver.current.contains(event.target) &&
        displayDriver.current.classList.contains("show")
      ) {
        displayDriver.current.classList.remove("show");
      }
    }
    document.addEventListener("click", removeClass);
    return document.removeEventListener("click", removeClass);
    
  }, []);

  async function saveNewDriver() {
    if (!driverRef.current.value || !placaRef.current.value) {
      setAlertMessage((prev) => ({
        ...prev,
        type: "red",
        message: "Please provide driver and placa",
      }));
      setTimeout(() => {
        setAlertMessage((prev) => ({
          ...prev,
          type: "inActive",
          message: "Nothing to show right now",
        }));
      }, 3000);
      return;
    }
    const data = terceroRef.current.checked
      ? {
          patanaType: "TERCERO",
          driver: driverRef.current.value,
          placa: placaRef.current.value,
        }
      : {
          patanaType: "ISM",
          driver: driverRef.current.value,
          placa: placaRef.current.value,
          ficha: fichaRef.current.value,
          placaUnidad: placaUnidadRef.current.value,
        };

    const url = `https://segintco7003.onrender.com/patana?driver=${driverRef.current.value}`;
    const response = await axios(url);

    const dataFetched = response.data.patanas;

    async function postData(data, where) {
      const res = await axios.post(
        `https://segintco7003.onrender.com/${where}`,
        data,
      );
      return res;
    }

    if (!dataFetched.length) {
      try {
        const res = await postData(data, "patana");
        setAlertMessage((prev) => ({
          ...prev,
          type: "green",
          message: `chofer ${res.data.patana.driver} Created succesfully`,
        }));
        setTimeout(() => {
          setAlertMessage((prev) => ({
            ...prev,
            type: "inActive",
            message: "Nothing to show right now",
          }));
        }, 3000);
      } catch (error) {
        console.log(error);
      }
    }

    const dataInforme = {
      ...data,
      productos: Products.join(", "),
    };

    try {
      await postData(dataInforme, "ingreso");
    } catch (error) {
      console.log(error);
    }
  }

  function populateText() {
    const date = new Date();

    // European format (DD/MM/YYYY)
    const todayDate = date.toLocaleDateString("en-GB"); // "25/12/2024"

    // 24-hour format
    const hourNow = date.toLocaleTimeString("en-GB"); // "14:30:45"

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

  function getOut() {
    if (!driverRef.current.value || placaUnidadRef.current.value) {
      setAlertMessage((prev) => ({
        ...prev,
        type: "red",
        message: `Please provide chofer and placa`,
      }));
      setTimeout(() => {
        setAlertMessage((prev) => ({
          ...prev,
          type: "inActive",
          message: "Nothing to show right now",
        }));
      }, 3000);
      return;
    }
    const choferData = {
      driver: driverRef.current.value,
      placa: placaRef.current.value,
    };
    const date = new Date();

    // European format (DD/MM/YYYY)
    const todayDate = date.toLocaleDateString("en-GB"); // "25/12/2024"

    // 24-hour format
    const hourNow = date.toLocaleTimeString("en-GB"); // "14:30:45"

    setTextToShow(`Sale del centro de Gonaïves una patana que había ingresado previamente con productos.

Chófer: ${choferData.driver} 
Placa: TM ${choferData.placa}
Hora salida: ${hourNow}
Fecha: ${todayDate}

Nota: La patana sale vacía, sin producto a bordo.`);
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
            <label htmlFor="nombre-record">Nombre</label>
            <input
              type="text"
              name="nombre-record"
              id="nombre-record"
              ref={driverRef}
              onChange={driverSearch}
            />
            <div className="display-driver" ref={displayDriver}>
              {displayDriverArray.length > 0 &&
                displayDriverArray.map((item, index) => (
                  <div
                    key={item._id}
                    className={`single-driver ${index % 2 === 0 ? 'driver-even' : 'driver-odd'}`}
                    onClick={() => selectDriver(item)}
                  >
                    <span>{item.driver}</span>
                    <span>{item.placa}</span>
                  </div>
                ))}
            </div>
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
              saveNewDriver();
              populateText();
            }}
          >
            Entrada
          </button>
          <button
            type="button"
            className="record-camion-button rec-salida"
            ref={salidaRef}
            onClick={getOut}
          >
            Salida
          </button>
        </div>
      </form>
    </section>
  );
};

export default FormInput;
