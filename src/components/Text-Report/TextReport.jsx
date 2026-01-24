import "./TextReport.css";
import { copyText } from "../../utils/util";
import copyImg from "../../assets/images/copy.png";
import { useRef } from "react";

const TextReport = ({ textToShow, setAlertMessage }) => {
  const container = useRef(null);

  return (
    <section className="Wrapper-report">
      <div className="copy-container">
        <img
          src={copyImg}
          alt="copy button logo"
          onClick={() => {
            copyText(container.current.textContent);
            setAlertMessage((prev) => ({
              ...prev,
              type: "green",
              message: "Text copied",
            }));
            setTimeout(() => {
              setAlertMessage((prev) => ({
                ...prev,
                type: "inActive",
                message: "Nothing to show right now",
              }));
            }, 2000);
          }}
        />
      </div>
      <p ref={container}>{textToShow}</p>
    </section>
  );
};

export default TextReport;
