import React, { useState } from "react";
import FormInput from "../Form-input/FormInput";
import TextReport from "../Text-Report/TextReport";
import DisplayProducts from "../Display-products/DisplayProducts";
import "./PatanaFlow.css";
import { Link } from "react-router-dom";
import { useUser } from "../../contexts/context";
import RegisterPrompt from "../RegisterPrompt";
import Spin from "../Spin/Spin";

const PatanaFlow = () => {
  const { user, loading } = useUser();
  const [textToShow, setTextToShow] = useState("");
  const [Products, setProducts] = useState([]);
  return (
    <>
      {loading ? <Spin /> : 
      user ? (
        <div className="bg-ingreso-patana">
          <FormInput
            setTextToShow={setTextToShow}
            Products={Products}
            setProducts={setProducts}
            textToShow={textToShow}
          />
          <DisplayProducts
            Products={Products}
            setProducts={setProducts}
          />
          <TextReport
            textToShow={textToShow}
          />
        </div>
      ) : (
        <RegisterPrompt detail="redactar" />
      )}
      
    </>
  );
};

export default PatanaFlow;
