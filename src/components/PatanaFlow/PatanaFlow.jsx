import React, { useState } from "react";
import FormInput from "../Form-input/FormInput";
import TextReport from "../Text-Report/TextReport";
import DisplayProducts from "../Display-products/DisplayProducts";
import Alert from "../Alert-message/Alert";
import './PatanaFlow.css';

const PatanaFlow = () => {
  const [textToShow, setTextToShow] = useState("");
  const [Products, setProducts] = useState([]);
  const [alertMessage, setAlertMessage] = useState({
    type: "inActive",
    message: "",
  });
  return (
    <div className="bg-ingreso-patana">
      <FormInput
        setTextToShow={setTextToShow}
        Products={Products}
        setProducts={setProducts}
        setAlertMessage={setAlertMessage}
      />
      <DisplayProducts
        Products={Products}
        setProducts={setProducts}
        setAlertMessage={setAlertMessage}
      />
      <TextReport textToShow={textToShow} setAlertMessage={setAlertMessage} />
      <Alert alertMessage={alertMessage} />
    </div>
  );
};

export default PatanaFlow;
