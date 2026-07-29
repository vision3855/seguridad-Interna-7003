import React from "react";
import "./DisplayProducts.css";
import {
  kolaReal,
  frutop300,
  frutop450,
  generade,
  energizante360,
  aguaCoolHeaven,
} from "../../productData";
import { useUser } from "../../contexts/context";

const DisplayProducts = ({ Products, setProducts }) => {
  const { showAlert } = useUser();
  function addSingleProduct(e) {
    const productFound = Products.find(
      (item) => item == e.target.dataset.systemName,
    );
    if (productFound) {
      const result = Products.filter((item) => item != productFound);
      setProducts(result);
      showAlert("red", "products removed successfully", 2000);
      e.target.classList.remove("glow");
    } else {
      setProducts((prev) => [...prev, e.target.dataset.systemName]);
      showAlert("green", "products added successfully", 2000);
      e.target.classList.add("glow");
    }
  }

  return (
    <section className="savour-area">
      <div className="productos-title">
        <div className="bar"></div>
        <span>PRODUCTOS</span>
      </div>

      <div className="savour-wrapper">
        <p id="KR">Kola Real</p>
        <div className="all-savour frutop">
          {kolaReal.map((item) => {
            return (
              <span
                key={item.description}
                id={item.name}
                onClick={(e) => addSingleProduct(e)}
                data-system-name={item.description}
                className=""
              >
                {item.name}
              </span>
            );
          })}
        </div>
      </div>

      <div className="savour-wrapper">
        <p id="FR">Frutop - 300 ml</p>
        <div className="all-savour frutop">
          {frutop300.map((item) => {
            return (
              <span
                key={item.description}
                id={item.name}
                onClick={(e) => addSingleProduct(e)}
                data-system-name={item.description}
                className=""
              >
                {item.name}
              </span>
            );
          })}
        </div>
      </div>

      <div className="savour-wrapper">
        <p id="FR">Frutop - 450 ml</p>
        <div className="all-savour frutop">
          {frutop450.map((item) => {
            return (
              <span
                key={item.description}
                id={item.name}
                onClick={(e) => addSingleProduct(e)}
                data-system-name={item.description}
                className=""
              >
                {item.name}
              </span>
            );
          })}
        </div>
      </div>

      <div className="savour-wrapper">
        <p id="ER">360</p>
        <div className="all-savour">
          {energizante360.map((item) => {
            return (
              <span
                key={item.description}
                id={item.name}
                onClick={(e) => addSingleProduct(e)}
                data-system-name={item.description}
                className=""
              >
                {item.name}
              </span>
            );
          })}
        </div>
      </div>

      <div className="savour-wrapper">
        <p id="GR">Generade</p>
        <div className="all-savour">
          {generade.map((item) => {
            return (
              <span
                key={item.description}
                id={item.name}
                onClick={(e) => addSingleProduct(e)}
                data-system-name={item.description}
                className=""
              >
                {item.name}
              </span>
            );
          })}
        </div>
      </div>

      <div className="savour-wrapper">
        <p id="AG">Agua Cool Heaven</p>
        <div className="all-savour">
          {aguaCoolHeaven.map((item) => {
            return (
              <span
                key={item.description}
                id={item.name}
                onClick={(e) => addSingleProduct(e)}
                data-system-name={item.description}
                className=""
              >
                {item.name}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DisplayProducts;
