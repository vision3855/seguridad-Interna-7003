import React, { useEffect, useRef, useState } from "react";
import "./VisitantesCard.css";
import axios from "axios";

const VisitantesCard = () => {
  const date = new Date();
  const formattedDate = new Intl.DateTimeFormat("en-CA").format(date);
  const todayFormatted = date.toLocaleDateString("en-GB");
  const dateRef = useRef(null);
  const [allCardData, setAllCardData] = useState([]);
  const [loading, setLoading] = React.useState(true);
  const [todayHead, setTodayHead] = React.useState(
    date.toLocaleDateString("en-GB"),
  );

  const URL = "https://segintco7003.onrender.com/visit";

  useEffect(() => {
    dateRef.current.value = formattedDate;
    async function callAPI() {
      const response = await axios.get(
        `https://segintco7003.onrender.com/visit/?dia=${todayFormatted}`,
      );
      setLoading(false);
      setAllCardData(response.data.data);
    }
    callAPI();
  }, []);

  function getIngreso() {
    setLoading(true);
    const dateChosen = dateRef.current.value;
    const dateAdapted = `${dateChosen[8]}${dateChosen[9]}/${dateChosen[5]}${dateChosen[6]}/${dateChosen[0]}${dateChosen[1]}${dateChosen[2]}${dateChosen[3]}`;

    try {
      axios
        .get(`https://segintco7003.onrender.com/visit/?dia=${dateAdapted}`)
        .then((res) => {
          setAllCardData(res.data.data);
        })
        .finally(() => setLoading(false));
      setTodayHead(dateChosen);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  return (
    <div className="full-vis-container">
      <p className="ingreso-title">
        {todayHead} - Informe de Relacion visitantes en el CO7003
      </p>

      <div className="icon-wrapper">
        <input
          type="date"
          className="date-icon"
          ref={dateRef}
          onChange={getIngreso}
        />
      </div>

      <div className="master-card-visit">
        {loading
          ? "Loading"
          : allCardData.map((card) => (
              <div className="wrapper-card-visitor" key={card._id}>
                <div className="top-visitor-card">
                  <img
                    src={`https://segintco7003.onrender.com/api/images/${card.refImg}`}
                    alt=""
                  />
                </div>
                <div className="bottom-visitor-card">
                  <p className="visitor-name">{card.name}</p>
                  <p className="visitor-business">{card.business}</p>
                  <p className="visitor-id">{card.idNumber}</p>
                  <p className="visitor-area">
                    Area visitada: {card.zoneVisited}
                  </p>
                  <p className="visitor-motivo">
                    Motivo de la visita: {card.visitMotif}
                  </p>
                  <p className="visitor-autorization">
                    Autorizado por: {card.authorizedBy}
                  </p>
                  <div className="hora-visita">
                    <p className="left-hora">8:51</p>
                    <p className="right-hora">9:10</p>
                  </div>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default VisitantesCard;
