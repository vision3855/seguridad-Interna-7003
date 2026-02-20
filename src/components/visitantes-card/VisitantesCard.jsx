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

  const [noVisDate, setNoVisDate] = React.useState(todayFormatted);

  const URL = "https://segintco7003.onrender.com/visit";

  async function fetchCard() {
      const dateChosen = dateRef.current.value;
    const dateAdapted = `${dateChosen[8]}${dateChosen[9]}/${dateChosen[5]}${dateChosen[6]}/${dateChosen[0]}${dateChosen[1]}${dateChosen[2]}${dateChosen[3]}`;
      try {
        const response = await axios.get(
          `https://segintco7003.onrender.com/visit/?dia=${dateAdapted}`,
        );
        setLoading(false);
        setAllCardData(response.data.data);
        
      } catch (error) {
        console.log(error);
      }
    }

  useEffect(() => {
    async function fetchCard() {
      dateRef.current.value = formattedDate;
      try {
        const response = await axios.get(
          `https://segintco7003.onrender.com/visit/?dia=${todayFormatted}`,
        );
        setLoading(false);
        setAllCardData(response.data.data);
        
      } catch (error) {
        console.log(error);
      }
    }
    
    fetchCard();

  }, [todayFormatted, formattedDate]);

  function formatDateHour(date) {
    return (
      date.getDate().toString().padStart(2, "0") +
      "/" +
      (date.getMonth() + 1).toString().padStart(2, "0") +
      "/" +
      date.getFullYear() +
      " " +
      date.getHours().toString().padStart(2, "0") +
      ":" +
      date.getMinutes().toString().padStart(2, "0")
    );
  }

  async function changeStatus(card) {
    try {
      const response = await axios.patch(
        `https://segintco7003.onrender.com/visit/${card._id}`,
        {
          ...card,
          status: "salio",
          hourOut: formatDateHour(date).split(" ")[1],
        },
      );

      console.log(response.data.data);
      fetchCard();
    } catch (error) {
      console.error(error);
    }
  }

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
      setTodayHead(dateAdapted);
      setNoVisDate(dateAdapted);
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

      <div
        className={
          loading || allCardData.length < 1
            ? "load-center"
            : allCardData.length < 3 ? 'master-card-visit center-less-two-visit' : "master-card-visit"
        }
      >
        {loading ? (
          "Loading..."
        ) : allCardData.length ? (
          allCardData.map((card) => (
            <div className={"wrapper-card-visitor"} key={card._id}>
              <div
                className={card.status === 'salio'? "check-finished disabled" : "check-finished"}
                onClick={() => changeStatus(card)}
              >
                &#10003;
              </div>
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
                  <p className="left-hora">{card.hourIn}</p>
                  <p className="right-hora">
                    {card.status !== "salio"
                      ? "Dentro del centro"
                      : card.hourOut}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <span className="no-vis-txt">No hay visitantes {noVisDate}</span>
        )}
      </div>
    </div>
  );
};

export default VisitantesCard;
