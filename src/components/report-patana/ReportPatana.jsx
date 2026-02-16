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

  function getIngreso() {
    setLoading(true);
    const dateChosen = dateRef.current.value;
    const dateAdapted = `${dateChosen[8]}${dateChosen[9]}/${dateChosen[5]}${dateChosen[6]}/${dateChosen[0]}${dateChosen[1]}${dateChosen[2]}${dateChosen[3]}`;

    try {
      axios
        .post(`https://segintco7003.onrender.com/ingreso/date`, {
          dia: dateAdapted,
        })
        .then((res) => {
          setIngresoPatana(res.data.result);
        })
        .finally(() => setLoading(false));
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    dateRef.current.value = formattedDate;

    axios
      .post(`https://segintco7003.onrender.com/ingreso/date`, {
        dia: todayFormatted,
      })
      .then((res) => {
        setIngresoPatana(res.data.result);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="informe-wrapper">
      <p className="ingreso-title">
        {todayFormatted} - Informe de Ingreso de patana de provincia en el
        CO7003
      </p>
      <div className="icon-wrapper">
        <input
          type="date"
          className="date-icon"
          ref={dateRef}
          onChange={getIngreso}
        />
      </div>

      <div className="informe-body">
        <div className="ingreso-grid">
          <span>Fecha</span>
          <span>Placa</span>
          <span>Chofer</span>
          <span>Productos</span>
          <span>Sep</span>
          <span>Pal</span>
        </div>
        {loading === true
          ? "loading..."
          : ingresoPatana.length > 0
            ? ingresoPatana.map((ingreso) => (
                <div key={ingreso._id} className="ingreso-grid">
                  <span>{ingreso.dia}</span>
                  <span>{`TM ${ingreso.placa}`}</span>
                  <span>{ingreso.driver}</span>
                  <span>{ingreso.productos}</span>
                  <span>{ingreso.separadores}</span>
                  <span>{ingreso.paletas}</span>
                </div>
              ))
            : `No hay ingreso por esta fecha`}
      </div>
    </div>
  );
};

export default ReportPatana;
