import React from "react";
import "./DisplayProducts.css";
import {
  kolaReal,
  frutop300,
  frutop450,
  generade,
  energizante360,
} from "../../productData";

const DisplayProducts = ({ Products, setProducts, setAlertMessage }) => {
  function addSingleProduct(e) {
    const isExisted = Products.find(
      (item) => item == e.target.dataset.systemName,
    );
    if (isExisted) {
      const result = Products.filter((item) => item != isExisted);                            
      setProducts(result);
      setAlertMessage((prev) => ({
        ...prev,
        type: "red",
        message: "products removed successfully",
      }));
    } else {
      setProducts((prev) => [...prev, e.target.dataset.systemName]);
      setAlertMessage((prev) => ({
        ...prev,
        type: "green",
        message: "products added successfully",
      }));
    }

    setTimeout(() => {
      setAlertMessage((prev) => ({
        ...prev,
        type: "inActive",
        message: "Nothing to show right now",
      }));
    }, 2000);
  }

  return (
    <section className="savour-area">
      <div className="savour-wrapper">
        <p id="KR">Kola Real</p>
        <div className="all-savour">
          {kolaReal.map((item) => {
            return (
              <span
                key={item.description}
                id={item.name}
                onClick={(e) => addSingleProduct(e)}
                data-system-name={item.description}
              >
                {item.name}
              </span>
            );
          })}
        </div>
      </div>

      <div className="savour-wrapper">
        <p id="FR">Frutop - 300 ml</p>
        <div className="all-savour">
          {frutop300.map((item) => {
            return (
              <span
                key={item.description}
                id={item.name}
                onClick={(e) => addSingleProduct(e)}
                data-system-name={item.description}
              >
                {item.name}
              </span>
            );
          })}
        </div>
      </div>

      <div className="savour-wrapper">
        <p id="FR">Frutop - 450 ml</p>
        <div className="all-savour">
          {frutop450.map((item) => {
            return (
              <span
                key={item.description}
                id={item.name}
                onClick={(e) => addSingleProduct(e)}
                data-system-name={item.description}
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
