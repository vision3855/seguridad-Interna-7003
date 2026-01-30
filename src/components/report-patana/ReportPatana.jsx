import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./ReportPatana.css";

const ReportPatana = () => {
  const dateRef = useRef(null);
  const date = new Date();
  const formattedDate = new Intl.DateTimeFormat("en-CA").format(date);
  const todayFormatted = date.toLocaleDateString("en-GB");
  const [ingresoPatana, setIngresoPatana] = useState(null);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    dateRef.current.value = formattedDate;

    axios
      .get(`https://segintco7003.onrender.com/ingreso`)
      .then((res) => {
        setIngresoPatana(res.data.ingresos);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="informe-wrapper">
      <p>
        {todayFormatted} - Informe de Ingreso de patana de provincia en el
        CO7003
      </p>
      <div className="icon-wrapper">
        <input type="date" className="date-icon" ref={dateRef} />
      </div>

      <div className="informe-body">
        <div  className="ingreso-grid">
          <span>Fecha</span>
          <span>Placa</span>
          <span>Chofer</span>
          <span>Productos</span>
          <span>Sep</span>
          <span>Pal</span>
        </div>
        {loading === true
          ? "loading..."
          : ingresoPatana.map((ingreso) => (
              <div key={ingreso.placa} className="ingreso-grid">
                <span>{ingreso.dia}</span>
                <span>{ingreso.placa}</span>
                <span>{ingreso.driver}</span>
                <span>{ingreso.productos}</span>
                <span>{ingreso.separadores}</span>
                <span>{ingreso.paletas}</span>
              </div>
            ))}
      </div>
    </div>
  );
};

export default ReportPatana;
