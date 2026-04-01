import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./ReportPatana.css";
import RegisterPrompt from "../RegisterPrompt";
import { useUser } from "../../contexts/context";

const ReportPatana = () => {
  const token = localStorage.getItem("token");
  const dateRef = useRef(null);
  const date = new Date();
  const formattedDate = new Intl.DateTimeFormat("en-CA").format(date);
  const todayFormatted = date.toLocaleDateString("en-GB");
  const [ingresoPatana, setIngresoPatana] = useState(null);
  const [loading, setLoading] = React.useState(true);
  const [todayHead, setTodayHead] = React.useState(
    date.toLocaleDateString("en-GB"),
  );
  const { login, loading : userLoading } = useUser();
  const [reportBy, setReportBy] = React.useState([]);

  async function getIngreso() {
    setLoading(true);
    const dateChosen = dateRef.current.value;
    const dateAdapted = `${dateChosen[8]}${dateChosen[9]}/${dateChosen[5]}${dateChosen[6]}/${dateChosen[0]}${dateChosen[1]}${dateChosen[2]}${dateChosen[3]}`;

    try {
      axios
        .post(
          `https://segintco7003.onrender.com/ingreso/date`,
          {
            dia: dateAdapted,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        )
        .then((res) => {
          setIngresoPatana(res.data.result);
          if (res.data.result.length > 0) {
            console.log(res.data.result[0].createdBy);

            res.data.result.forEach(async (ingreso) => {
              try {
                const userResponse = await axios.get(
                  `https://segintco7003.onrender.com/api/auth/users/${ingreso.createdBy}`,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  },
                );
                setReportBy((prev) => [
                  ...prev,
                  userResponse.data.name.toUpperCase(),
                ]);
              } catch (error) {
                console.log(error);
              }
            });
          }
        })
        .finally(() => setLoading(false));
      setTodayHead(dateChosen);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {

    if (login && !userLoading) {
      dateRef.current.value = formattedDate;

      axios
        .post(
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
        )
        .then((res) => {
          setIngresoPatana(res.data.result);
          res.data.result.forEach(async (ingreso) => {
            try {
              const userResponse = await axios.get(
                `https://segintco7003.onrender.com/api/auth/users/${ingreso.createdBy}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                },
              );
              setReportBy((prev) => [
                ...prev,
                userResponse.data.name.toUpperCase(),
              ]);
            } catch (error) {
              console.log(error);
            }
          });
          //setReportBy(user.data.createdBy.toUpperCase());
        })
        .finally(() => setLoading(false));
    }
  }, [login]);

  return (
    <>
      {login ? (
        <div className="informe-wrapper">
          <p className="ingreso-title">
            {todayHead} - Informe de Ingreso de patana de provincia en el CO7003
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
                ? ingresoPatana.map((ingreso, index) => (
                    <div key={ingreso._id} className="ingreso-grid-main">
                      <div className="ingreso-grid">
                        <span>{ingreso.dia}</span>
                        <span>{`TM ${ingreso.placa}`}</span>
                        <span>{ingreso.driver}</span>
                        <span>{ingreso.productos}</span>
                        <span>{ingreso.separadores}</span>
                        <span>{ingreso.paletas}</span>
                      </div>
                      <p className="ingreso-report-by">
                        redactar por {reportBy[index]}
                      </p>
                    </div>
                  ))
                : `No hay ingreso por esta fecha`}
          </div>
        </div>
      ) : (
        <RegisterPrompt detail="acceder" />
      )}
    </>
  );
};

export default ReportPatana;
