import React, { useRef, useState } from "react";
import "./CalculatorAlmacen.css";

const CalculatorAlmacen = () => {
  const [selectedValue, setSelectedValue] = useState("");
  const [textResult, seTextResult] = useState("");
  const cantidadRef = useRef(null);

  function calculation() {
    const value = +cantidadRef.current.value;
    let paletas;
    let paletasUnidades;
    let separador;
    let separadorUnidades;
    let height;
    switch (selectedValue) {
      case "KR":
        separadorUnidades = 30;
        height = 7;
        paletasUnidades = separadorUnidades * height;

        if (value > paletasUnidades) {
          paletas = Math.trunc(value / paletasUnidades); //9
          const unityAfterPaletas = value - paletas * paletasUnidades; //110
          separador = Math.trunc(unityAfterPaletas / separadorUnidades); //3
          const unidades = unityAfterPaletas - separador * separadorUnidades;

          seTextResult(
            `${paletas} paletas, ${separador} separadores y ${unidades} paquetes`,
          );
        } else if (value > separadorUnidades) {
          separador = Math.trunc(value / separadorUnidades); //3
          const unidades = value - separador * separadorUnidades;

          seTextResult(`${separador} separadores y ${unidades} paquetes`);
        } else {
          const unidades = value;
          seTextResult(`${unidades} paquetes`);
        }
        break;

      case "FR3":
        separadorUnidades = 34;
        height = 9;
        paletasUnidades = separadorUnidades * height;

        if (value > paletasUnidades) {
          paletas = Math.trunc(value / paletasUnidades); //9
          const unityAfterPaletas = value - paletas * paletasUnidades; //110
          separador = Math.trunc(unityAfterPaletas / separadorUnidades); //3
          const unidades = unityAfterPaletas - separador * separadorUnidades;

          seTextResult(
            `${paletas} paletas, ${separador} separadores y ${unidades} paquetes`,
          );
        } else if (value > separadorUnidades) {
          separador = Math.trunc(value / separadorUnidades); //3
          const unidades = value - separador * separadorUnidades;

          seTextResult(`${separador} separadores y ${unidades} paquetes`);
        } else {
          const unidades = value;
          seTextResult(`${unidades} paquetes`);
        }
        break;

      case "FR45":
        separadorUnidades = 29;
        height = 7;
        paletasUnidades = separadorUnidades * height;

        if (value > paletasUnidades) {
          paletas = Math.trunc(value / paletasUnidades); //9
          const unityAfterPaletas = value - paletas * paletasUnidades; //110
          separador = Math.trunc(unityAfterPaletas / separadorUnidades); //3
          const unidades = unityAfterPaletas - separador * separadorUnidades;

          seTextResult(
            `${paletas} paletas, ${separador} separadores y ${unidades} paquetes`,
          );
        } else if (value > separadorUnidades) {
          separador = Math.trunc(value / separadorUnidades); //3
          const unidades = value - separador * separadorUnidades;

          seTextResult(`${separador} separadores y ${unidades} paquetes`);
        } else {
          const unidades = value;
          seTextResult(`${unidades} paquetes`);
        }
        break;

      case "ER":
        separadorUnidades = 22;
        height = 6;
        paletasUnidades = separadorUnidades * height;

        if (value > paletasUnidades) {
          paletas = Math.trunc(value / paletasUnidades); //9
          const unityAfterPaletas = value - paletas * paletasUnidades; //110
          separador = Math.trunc(unityAfterPaletas / separadorUnidades); //3
          const unidades = unityAfterPaletas - separador * separadorUnidades;

          seTextResult(
            `${paletas} paletas, ${separador} separadores y ${unidades} paquetes`,
          );
        } else if (value > separadorUnidades) {
          separador = Math.trunc(value / separadorUnidades); //3
          const unidades = value - separador * separadorUnidades;

          seTextResult(`${separador} separadores y ${unidades} paquetes`);
        } else {
          const unidades = value;
          seTextResult(`${unidades} paquetes`);
        }
        break;

      case "GR":
        separadorUnidades = 27;
        height = 7;
        paletasUnidades = separadorUnidades * height;

        if (value > paletasUnidades) {
          paletas = Math.trunc(value / paletasUnidades); //9
          const unityAfterPaletas = value - paletas * paletasUnidades; //110
          separador = Math.trunc(unityAfterPaletas / separadorUnidades); //3
          const unidades = unityAfterPaletas - separador * separadorUnidades;

          seTextResult(
            `${paletas} paletas, ${separador} separadores y ${unidades} paquetes`,
          );
        } else if (value > separadorUnidades) {
          separador = Math.trunc(value / separadorUnidades); //3
          const unidades = value - separador * separadorUnidades;

          seTextResult(`${separador} separadores y ${unidades} paquetes`);
        } else {
          const unidades = value;
          seTextResult(`${unidades} paquetes`);
        }
        break;

      case "AG":
        separadorUnidades = 27;
        height = 7;
        paletasUnidades = separadorUnidades * height;

        if (value > paletasUnidades) {
          paletas = Math.trunc(value / paletasUnidades); //9
          const unityAfterPaletas = value - paletas * paletasUnidades; //110
          separador = Math.trunc(unityAfterPaletas / separadorUnidades); //3
          const unidades = unityAfterPaletas - separador * separadorUnidades;

          seTextResult(
            `${paletas} paletas, ${separador} separadores y ${unidades} paquetes`,
          );
        } else if (value > separadorUnidades) {
          separador = Math.trunc(value / separadorUnidades); //3
          const unidades = value - separador * separadorUnidades;

          seTextResult(`${separador} separadores y ${unidades} paquetes`);
        } else {
          const unidades = value;
          seTextResult(`${unidades} paquetes`);
        }
        break;

      default:
        seTextResult("Por favor selectionar un producto");
    }
  }

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };
  return (
    <div className="calculator-wrapper">
      <div className="calculator-border">
        <div className="cantidad-wrapper">
          <label htmlFor="cantidad-input">Cantidad</label>
          <input
            type="number"
            min="1"
            name="cantidad-input"
            id="cantidad-input"
            ref={cantidadRef}
          />
        </div>
        <div className="product-wrapper">
          <label htmlFor="product-picked">Producto</label>
          <select
            value={selectedValue}
            onChange={handleChange}
            name="product"
            id="product-picked"
          >
            <option value="">seleccionar un producto</option>
            <option value="KR">Kola Real 400 ml</option>
            <option value="FR3">Frutop 300 ml</option>
            <option value="FR45">Frutop 450 ml</option>
            <option value="ER">360 20 Oz</option>
            <option value="GR">Generade 500 ml</option>
            <option value="AG">Agua 500 ml</option>
          </select>
          <button id="calcular" onClick={calculation}>
            Calcular
          </button>
          <p className="calculation-result">{textResult}</p>
        </div>
      </div>
    </div>
  );
};

export default CalculatorAlmacen;
