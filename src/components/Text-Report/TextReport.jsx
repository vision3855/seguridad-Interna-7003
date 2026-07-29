import "./TextReport.css";
import { copyText } from "../../utils/util";
import copyImg from "../../assets/images/copy.png";
import { useRef } from "react";
import { useUser } from "../../contexts/context";

const TextReport = ({ textToShow }) => {
  const { showAlert } = useUser();
  const container = useRef(null);

  return (
    <section className="Wrapper-report">
      <div className="copy-container">
        <img
          src={copyImg}
          alt="copy button logo"
          onClick={() => {
            copyText(container.current.textContent);
            showAlert("green", "Text copied", 2000);
          }}
        />
      </div>
      <p ref={container}>{textToShow}</p>
    </section>
  );
};

export default TextReport;
