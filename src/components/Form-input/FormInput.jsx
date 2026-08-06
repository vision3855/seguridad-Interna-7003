import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./FormInput.css";
import { useUser } from "../../contexts/context";
import { copyText } from "../../utils/util";

const FormInput = ({ textToShow, setTextToShow, Products, setProducts }) => {
  const { showAlert } = useUser();
  const token = localStorage.getItem("token");
  const [displayDriverArray, setDisplayDriverArray] = useState([]);
  const ISMRef = useRef(null);
  const terceroRef = useRef(null);
  const driverRef = useRef(null);
  const placaRef = useRef(null);
  const separadorRef = useRef(null);
  const paletasRef = useRef(null);
  const fichaRef = useRef(null);
  const placaUnidadRef = useRef(null);
  const conduceDifRef = useRef(null);
  const entradaRef = useRef(null);
  const salidaRef = useRef(null);
  const displayDriver = useRef(null);
  //const [IngresoVacioRef, setIngresoVacioRef] = useState(null);
  const IngresoVacioRef = useRef(null);
  const salidaPatanaPalySepRef = useRef(null);
  const [isIngreso, setIsIngreso] = useState(true);
  const [isIngresoVacio, setIsIngresoVacio] = useState(false);
  const [howSale, setHowSale] = useState("Vacio");
  const [recogervacio, setRecogervacio] = useState("Productos");
  const [howIngreso, setHowIngreso] = useState("Productos");

  useEffect(() => {
    textToShow !== "" && copyText(textToShow);
  }, [textToShow]);

  async function isAlreadyRegistered(placa) {
    let isExisting = false;
    const date = new Date();
    const todayFormatted = date.toLocaleDateString("en-GB");
    try {
      const response = await axios.post(
        `https://segintco7003.onrender.com/ingreso/date`,
        {
          dia: todayFormatted,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.result.length > 0) {

        response.data.result.find((ingreso) => {
          if (parseInt(ingreso.placa) === parseInt(placa)) {
            isExisting = true;
          }
        });
      }
    } catch (error) {
      showAlert("red", "Error al verificar el registro de la patana.", 5);
      console.error("Error al verificar el registro de la patana:", error);
    }
    if (isExisting) {
      return true;
    } else {
      return false;
    }
  }

  async function driverSearch(event) {
    const value = event.target.value;

    if (!value.trim()) {
      setDisplayDriverArray([]);
      return;
    }

    try {
      const response = await axios(
        `https://segintco7003.onrender.com/patana?driver=${value}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
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

  useEffect(() => {
    if (IngresoVacioRef.current) {
      if (IngresoVacioRef?.current?.checked) {
        setIsIngresoVacio(true);
      }
    }
    if (salidaPatanaPalySepRef.current) {
      if (salidaPatanaPalySepRef?.current?.checked) {
        setHowSale("Pal y/o Sep");
      }
    }
  }, [isIngreso]);

  function selectDriver(item) {
    if (item.patanaType === "TERCERO") {
      driverRef.current.value = item.driver;
      placaRef.current.value = item.placa;
      terceroRef.current.checked = true;
    }
    if (item.patanaType === "ISM") {
      driverRef.current.value = item.driver;
      placaRef.current.value = item.placa;
      fichaRef.current.value = item.ficha;
      placaUnidadRef.current.value = item.placaUnidad;
      ISMRef.current.checked = true;
    }
    displayDriver.current.classList.remove("show");
  }

  async function saveNewDriver() {
    if (!driverRef.current.value || !placaRef.current.value) {
      showAlert("red", "Please provide driver and placa");
      return;
    }

    if (!Products.length) {
      showAlert("red", "Elige al menos un producto para registrar la patana");
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

    const checkResponse = await isAlreadyRegistered(data.placa);

    if (checkResponse) {
      showAlert("red", "Esta patana ya ha sido registrada para hoy.");
      return;
    }

    const url = `https://segintco7003.onrender.com/patana/?driver=${driverRef.current.value}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const dataFetched = response.data.patanas;

    async function postData(data, where) {
      const res = await axios.post(
        `https://segintco7003.onrender.com/${where}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      return res;
    }

    if (dataFetched.length < 1) {
      try {
        const res = await postData(data, "patana");
        showAlert(
          "green",
          `chofer ${res.data.patana.driver} Created succesfully`,
        );
      } catch (error) {
        console.log(error);
      }
    }

    let dataInforme;
    let productsString = "";

    if (Products.length > 1) {
      for (let i = 0; i < Products.length; i++) {
        if (i == Products.length - 1) {
          productsString += `y ${Products[i]}`;
        } else {
          productsString += `${Products[i]}, `;
        }
      }
      dataInforme = {
        ...data,
        productos: productsString,
      };
    } else {
      dataInforme = {
        ...data,
        productos: Products[0],
      };
    }

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
      if (Products.length > 1) {
        for (let i = 0; i < Products.length; i++) {
          if (i == Products.length - 1) {
            productString += `y ${Products[i]}`;
          } else if (i == Products.length - 2) {
            productString += `${Products[i]} `;
          } else {
            productString += `${Products[i]}, `;
          }
        }
      } else {
        productString = Products[0];
      }
    }

    if (isIngreso) {
      if (isIngresoVacio) {
        switch (recogervacio) {
          case "Pal y/o Sep":
            setTextToShow(
              `Se recibió en el centro de Gonaïves una patana vacía con el propósito de retirar paletas y/o separadores destinados al traslado hacia la planta de Limonade.

Chofer: ${driverRef.current.value}
Placa: TM ${placaRef.current.value}
Hora ingreso: ${hourNow.slice(0, 5)}
Fecha: ${todayDate}.`,
            );
            break;
          case "Productos":
            setTextToShow(`Se recibió en el centro de Gonaïves una patana vacía con el propósito de retirar productos destinados al traslado hacia la planta de Limonade.

Chofer: ${driverRef.current.value}
Placa: TM ${placaRef.current.value}
Hora ingreso: ${hourNow.slice(0, 5)}
Fecha: ${todayDate}.`);
            break;
          case "Productos y Pal y/o Sep":
            setTextToShow(`Se recibió en el centro de Gonaïves una patana vacía con el propósito de retirar productos y paletas/separadores destinados al traslado hacia la planta de Limonade.

Chofer: ${driverRef.current.value}
Placa: TM ${placaRef.current.value}
Hora ingreso: ${hourNow.slice(0, 5)}
Fecha: ${todayDate}.`);
            break;

          default:
            setTextToShow("Invalid option selected.");
        }
      } else {
        if (terceroRef.current.checked) {
          conduceDifRef.current.checked
            ? setTextToShow(
                `Se recibió en el centro de Gonaïves una patana procedente de la planta de Limonade, con los productos detallados a continuación. 

Chofer: ${driverRef.current.value}
Placa: TM ${placaRef.current.value}
Hora ingreso: ${hourNow.slice(0, 5)}
Fecha: ${todayDate}

Producto: ${productString} 

Separadores: ${separadorRef.current.value || 147}  unidades
Paletas: 21 unidades

NOTA: CHOFER y PLACA no coinciden con los datos del conduce.
    `,
              )
            : setTextToShow(
                `Se recibió en el centro de Gonaïves una patana procedente de la planta de Limonade, con los productos detallados a continuación. 

Chofer: ${driverRef.current.value}
Placa: TM ${placaRef.current.value}
Hora ingreso: ${hourNow.slice(0, 5)}
Fecha: ${todayDate}

Producto: ${productString} 

Separadores: ${separadorRef.current.value || 147}  unidades
Paletas: 21 unidades`,
              );
        } else {
          setTextToShow(`Se recibió en el centro de Gonaïves una patana ISM, procedente de la planta de Limonade, con los productos detallados a continuación. 

Chofer : ${driverRef.current.value}
Placa Unidad : ${placaUnidadRef.current.value}
Placa Cabezote ${placaRef.current.value}
Ficha : ${fichaRef.current.value}
Hora Ingreso : ${hourNow.slice(0, 5)}
Fecha : ${todayDate}

Producto : ${productString} 

Separadores : ${separadorRef.current.value || 147}  unidades
Paletas : 21 unidades`);
        }
      }
    }
    setProducts([]);
    
  }

  function getOut() {
    if (!driverRef.current.value || !placaRef.current.value) {
      showAlert("red", "Please provide chofer and placa");
      return;
    }

    const date = new Date();

    // European format (DD/MM/YYYY)
    const todayDate = date.toLocaleDateString("en-GB"); // "25/12/2024"

    // 24-hour format
    const hourNow = date.toLocaleTimeString("en-GB");
    // "14:30:45"
    if (terceroRef.current.checked) {
      switch (howSale) {
        case "Vacio":
          setTextToShow(
            `Sale del centro de Gonaïves una patana que había ingresado previamente ${howIngreso === "Productos" ? "con productos" : "vacio"} y que ahora sale vacia.

Chofer: ${driverRef.current.value}
Placa: TM ${placaRef.current.value}
Hora salida: ${hourNow.slice(0, 5)}
Fecha: ${todayDate}.`,
          );
          break;
        case "Pal y/o Sep":
          setTextToShow(`Sale del centro de Gonaïves una patana que había ingresado previamente ${howIngreso === "Productos" ? "con productos" : "vacio"} y que ahora sale con paletas y separadores con destino a la planta de Limonade.


Chofer: ${driverRef.current.value}
Placa: TM ${placaRef.current.value}
Paletas: ${paletasRef.current.value} unidades
${separadorRef.current.value ? `Separadores: ${separadorRef.current.value} unidades` : ""}
Hora salida: ${hourNow.slice(0, 5)}
Fecha: ${todayDate}.`);
          break;
        case "Productos":
          setTextToShow(`Sale del centro de Gonaïves una patana que había ingresado previamente ${howIngreso === "Productos" ? "con productos" : "vacio"} y que ahora sale con los productos destinados a la planta de Limonade.

Chofer: ${driverRef.current.value}
Placa: TM ${placaRef.current.value}
Hora salida: ${hourNow.slice(0, 5)}
Fecha: ${todayDate}.`);
          break;

        default:
          setTextToShow("Invalid option selected.");
      }
    } else {
      switch (howSale) {
        case "Vacio":
          setTextToShow(
            `Sale del centro de Gonaïves la patana ISM ${placaUnidadRef.current.value} que había ingresado previamente ${howIngreso === "Productos" ? "con productos" : "vacio"} y que ahora sale vacia.

Chofer: ${driverRef.current.value}
Placa: TM ${placaRef.current.value}
Hora salida: ${hourNow.slice(0, 5)}
Fecha: ${todayDate}.`,
          );
          break;
        case "Pal y/o Sep":
          setTextToShow(`Sale del centro de Gonaïves la patana ISM ${placaUnidadRef.current.value} que había ingresado previamente ${howIngreso === "Productos" ? "con productos" : "vacio"} y que ahora sale con paletas y separadores con destino a la planta de Limonade.


Chofer: ${driverRef.current.value}
Placa: TM ${placaRef.current.value}
Paletas: ${paletasRef.current.value} unidades
${separadorRef.current.value ? `Separadores: ${separadorRef.current.value} unidades` : ""}
Hora salida: ${hourNow.slice(0, 5)}
Fecha: ${todayDate}.`);
          break;
        case "Productos":
          setTextToShow(`Sale del centro de Gonaïves la patana ISM ${placaUnidadRef.current.value} que había ingresado previamente ${howIngreso === "Productos" ? "con productos" : "vacio"} y que ahora sale con los productos destinados a la planta de Limonade.

Chofer: ${driverRef.current.value}
Placa: TM ${placaRef.current.value}
Hora salida: ${hourNow.slice(0, 5)}
Fecha: ${todayDate}.`);
          break;

        default:
          setTextToShow("Invalid option selected.");
      }
    }
    
  }

  return (
    <section className="record">
      <div className="ingreso-o-salida">
        <button
          className={`record-type-button ${isIngreso ? "active-type" : ""}`}
          onClick={() => {
            setIsIngreso(true);

            /* if (IngresoVacio.current.checked) {
              setIsIngresoVacio(true);
            } */
          }}
        >
          Ingreso
        </button>
        <button
          className={`record-type-button ${!isIngreso ? "active-type" : ""}`}
          onClick={() => {
            setIsIngreso(false);
            setIsIngresoVacio(false);
          }}
        >
          Salida
        </button>
      </div>
      <div>
        {isIngreso ? (
          <div className="ingreso-how">
            <div className="label-input">
              <label htmlFor="ingreso-productos">Productos</label>
              <input
                type="radio"
                name="ingreso-choice"
                id="ingreso-productos"
                defaultChecked
                onChange={() => setIsIngresoVacio(false)}
              />
            </div>

            <div className="label-input">
              <label htmlFor="ingreso-vacio">Vacío</label>
              <input
                type="radio"
                name="ingreso-choice"
                id="ingreso-vacio"
                onChange={() => setIsIngresoVacio(true)}
                ref={IngresoVacioRef}
              />
            </div>
          </div>
        ) : (
          <div className="ingreso-how">
            <div className="label-input">
              <label htmlFor="salida-patana-vacio">Vacio</label>
              <input
                type="radio"
                name="salida-choice"
                id="salida-patana-vacio"
                onChange={() => setHowSale("Vacio")}
                defaultChecked
              />
            </div>
            <div className="label-input">
              <label htmlFor="salida-patana-separadores">
                Paletas y/o Separadores
              </label>
              <input
                type="radio"
                name="salida-choice"
                id="salida-patana-separadores"
                onChange={() => setHowSale("Pal y/o Sep")}
              />
            </div>
            <div className="label-input">
              <label htmlFor="salida-patana-productos">Productos</label>
              <input
                type="radio"
                name="salida-choice"
                id="salida-patana-productos"
                onChange={() => setHowSale("Productos")}
              />
            </div>
          </div>
        )}
        
        {!isIngreso && (
          <>
            <div className="isIngreso-vacio-title">Como ingreso?</div>
            <div className="lab-input-global-wrapper">
              <div className="label-input">
                <label htmlFor="salida-patana-separadores">Vacio</label>
                <input
                  type="radio"
                  name="ingreso-how-choice"
                  id="salida-patana-separadores"
                  onChange={() => setHowIngreso("Vacio")}
                />
              </div>
              <div className="label-input">
                <label htmlFor="salida-patana-productos">Productos</label>
                <input
                  type="radio"
                  name="ingreso-how-choice"
                  id="salida-patana-productos"
                  defaultChecked
                  onChange={() => setHowIngreso("Productos")}
                />
              </div>
            </div>
          </>
        )}
        {isIngresoVacio && (
          <>
            <div className="isIngreso-vacio-title">
              Ingreso para recoger que?
            </div>
            <div className="lab-input-global-wrapper">
              <div className="label-input">
                <label htmlFor="salida-patana-separadores">Pal y/o Sep</label>
                <input
                  type="radio"
                  name="salida-choice"
                  id="salida-patana-separadores"
                  onChange={() => setRecogervacio("Pal y/o Sep")}
                  ref={salidaPatanaPalySepRef}
                />
              </div>
              <div className="label-input">
                <label htmlFor="salida-patana-productos">Productos</label>
                <input
                  type="radio"
                  name="salida-choice"
                  id="salida-patana-productos"
                  onChange={() => setRecogervacio("Productos")}
                  defaultChecked
                />
              </div>
              <div className="label-input">
                <label htmlFor="salida-patana-productos-palysep">
                  Productos y Pal y/o Sep
                </label>
                <input
                  type="radio"
                  name="salida-choice"
                  id="salida-patana-productos-palysep"
                  onChange={() => setRecogervacio("Productos y Pal y/o Sep")}
                />
              </div>
            </div>
          </>
        )}
      </div>
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
                    className={`single-driver ${index % 2 === 0 ? "driver-even" : "driver-odd"}`}
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
        {!isIngreso && howSale === "Pal y/o Sep" && (
          <div className="paletas">
            <label htmlFor="paletas">Paletas</label>
            <input type="text" name="paletas" id="paletas" ref={paletasRef} />
          </div>
        )}

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
              Products.length > 0 && populateText();
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
