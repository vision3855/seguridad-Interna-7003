import React, { useRef, useState } from "react";
import "./Visitantes.css";
import axios from "axios";

const Visitantes = () => {
  const [visitanteOption, setVisitanteOption] = useState("nuevo");
  const nameRef = useRef(null);
  const idNumberRef = useRef(null);
  const businessRef = useRef(null);
  const areaRef = useRef(null);
  const motifRef = useRef(null);
  const autorizadoRef = useRef(null);
  const wrapperVisit = useRef(null);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [dataVisited, setDataVisited] = useState([]);
  const [actualVisitor, setActualVisitor] = useState({});

  const formRef = useRef(null);

  const API_URL = "https://segintco7003.onrender.com/api/images";

  async function handleSearchName(e) {
    const value = e.target.value;
    if (!value.trim()) {
      setDataVisited([]);
      return;
    }

    try {
      const response = await axios.get(
        `https://segintco7003.onrender.com/api/images/?name=${nameRef.current.value}`,
      );
      setDataVisited(response.data.images);
      wrapperVisit.current.classList.add("visit-search-visible");
    } catch (error) {
      console.error(error);
      setUploadMessage(
        "❌ Error: " + (error.response?.data?.error || error.message),
      );
    }
  }

  function fillField(obj) {
    nameRef.current.value = obj.name;
    businessRef.current.value = obj.business;
    areaRef.current.value = obj.zoneVisited;
    motifRef.current.value = obj.visitMotif;
    autorizadoRef.current.value = obj.authorizedBy;

    setActualVisitor(obj);

    wrapperVisit.current.classList.remove("visit-search-visible");
  }

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

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    const myDate = new Date();
    const formData = new FormData();

    if (visitanteOption === "nuevo") {
      if (!selectedFile) {
        setUploadMessage("Please select an image first");
        return;
      }
      formData.append("image", selectedFile);
      formData.append("name", nameRef.current.value);
      formData.append("idNumber", idNumberRef.current.value);
      formData.append("business", businessRef.current.value);
      formData.append("hourIn", formatDateHour(myDate).split(" ")[1]);
      formData.append("hourOut", formatDateHour(myDate).split(" ")[1]);
      formData.append("zoneVisited", areaRef.current.value);
      formData.append("visitMotif", motifRef.current.value);
      formData.append("authorizedBy", autorizadoRef.current.value);

      try {
        const response = await axios.post(
          "https://segintco7003.onrender.com/api/images/upload",
          formData,
          // 🚫 no headers
        );
        console.log(response.data.data.id);

        const visitData = {
          hourIn: response.data.data.hourIn,
          name: response.data.data.name,
          idNumber: response.data.data.idNumber,
          business: response.data.data.business,
          zoneVisited: response.data.data.zoneVisited,
          visitMotif: response.data.data.visitMotif,
          authorizedBy: response.data.data.authorizedBy,
          hourOut: response.data.data.hourOut,
          refImg: response.data.data.id,
        };

        await axios.post(
          "https://segintco7003.onrender.com/visit",
          visitData,
        );

        setUploadMessage("✅ " + response.data.message);
        setSelectedFile(null);
        setPreview(null);
        formRef.current.reset();
      } catch (error) {
        console.error(error);
        setUploadMessage(
          "❌ Error: " + (error.response?.data?.error || error.message),
        );
      }
    } else {
      const visitData = {
        hourIn: formatDateHour(myDate).split(" ")[1],
        name: actualVisitor.name,
        idNumber: actualVisitor.idNumber,
        business: businessRef.current.value,
        zoneVisited: areaRef.current.value,
        visitMotif: motifRef.current.value,
        authorizedBy: autorizadoRef.current.value,
        hourOut: formatDateHour(myDate).split(" ")[1],
        refImg: actualVisitor._id,
      };
      console.log(visitData);
      
      try {
        const visitResponse = await axios.post(
          "https://segintco7003.onrender.com/visit",
          visitData,
        );

        setUploadMessage("✅ " + visitResponse.data.message);
        setSelectedFile(null);
        setPreview(null);
        formRef.current.reset();
        console.log(visitResponse);
      } catch (error) {
        console.error(error);
        setUploadMessage(
          "❌ Error: " + (error.response?.data?.error || error.message),
        );
      }
    }
  };

  function handleVisitanteOption(option) {
    if (option === "nuevo") {
      setVisitanteOption("nuevo");
    } else {
      setVisitanteOption("ya");
    }
  }
  return (
    <div
      className={
        visitanteOption === "nuevo"
          ? "form-visitantes-wrapper"
          : "form-visitantes-wrapper ya-visitado"
      }
    >
      <div className="visitantes-option">
        <span
          className="option-span-visitantes1"
          onClick={() => handleVisitanteOption("nuevo")}
        >
          nuevo visitante
        </span>
        <span
          className="option-span-visitantes2"
          onClick={() => handleVisitanteOption("ya")}
        >
          ya visitado
        </span>
      </div>
      <form
        className="form-visitantes"
        ref={formRef}
        action=""
        onSubmit={(e) => handleUpload(e)}
      >
        <div style={styles.uploadBox}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={styles.fileInput}
          />

          {preview && (
            <div style={styles.previewBox}>
              <img src={preview} alt="Preview" style={styles.previewImage} />
            </div>
          )}
        </div>

        {uploadMessage && (
          <div
            style={{
              ...styles.message,
              backgroundColor: uploadMessage.includes("✅")
                ? "#d4edda"
                : "#f8d7da",
              color: uploadMessage.includes("✅") ? "#155724" : "#721c24",
            }}
          >
            {uploadMessage}
          </div>
        )}
        {visitanteOption === "nuevo" ? (
          <>
            <div className="nombre-wrapper-vis grid-visitantes">
              <label htmlFor="nombre-record">Nombre completo</label>
              <input
                type="text"
                name="nombre-record"
                id="nombre-record"
                ref={nameRef}
              />
            </div>

            <div className="cedula-wrapper grid-visitantes">
              <label htmlFor="cedula-record">Cedula</label>
              <input
                type="text"
                name="cedula-record"
                id="cedula-record"
                ref={idNumberRef}
              />
            </div>

            <div className="business-wrapper grid-visitantes">
              <label htmlFor="business-record">Empresa</label>
              <input
                type="text"
                name="business-record"
                id="business-record"
                ref={businessRef}
              />
            </div>

            <div className="nombre-wrapper grid-visitantes">
              <label htmlFor="area-record">Area visitada</label>
              <input
                type="text"
                name="area-record"
                id="area-record"
                ref={areaRef}
              />
            </div>

            <div className="cedula-wrapper grid-visitantes">
              <label htmlFor="motivo-record">Motivo de la visita</label>
              <input
                type="text"
                name="motivo-record"
                id="motivo-record"
                ref={motifRef}
              />
            </div>

            <div className="nombre-wrapper grid-visitantes">
              <label htmlFor="autorizado-record">Autorizado por</label>
              <input
                type="text"
                name="autorizado-record"
                id="autorizado-record"
                ref={autorizadoRef}
              />
            </div>
          </>
        ) : (
          <>
            <div className="nombre-wrapper grid-visitantes ">
              <label htmlFor="nombre-record">Nombre completo</label>
              <input
                type="text"
                name="nombre-record"
                id="nombre-record"
                ref={nameRef}
                onChange={(e) => {
                  handleSearchName(e);
                }}
              />

              <div className="wrapper-display-visitantes" ref={wrapperVisit}>
                {dataVisited.map((result) => (
                  <div
                    className="display-visitantes-search"
                    onClick={() => fillField(result)}
                    key={result._id}
                  >
                    <div className="left-visitantes-search">
                      <img
                        src={`${API_URL}/${result._id}`}
                        alt={`image of ${result.name}`}
                      />
                    </div>
                    <div className="right-visitantes-search">
                      <p id="first-vis-search">{result.name}</p>
                      <p id="second-vis-search">{result.business}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="business-wrapper grid-visitantes">
              <label htmlFor="business-record">Empresa</label>
              <input
                type="text"
                name="business-record"
                id="business-record"
                ref={businessRef}
              />
            </div>

            <div className="nombre-wrapper grid-visitantes">
              <label htmlFor="area-record">Area visitada</label>
              <input
                type="text"
                name="area-record"
                id="area-record"
                ref={areaRef}
              />
            </div>

            <div className="cedula-wrapper grid-visitantes">
              <label htmlFor="motivo-record">Motivo de la visita</label>
              <input
                type="text"
                name="motivo-record"
                id="motivo-record"
                ref={motifRef}
              />
            </div>

            <div className="nombre-wrapper grid-visitantes">
              <label htmlFor="autorizado-record">Autorizado por</label>
              <input
                type="text"
                name="autorizado-record"
                id="autorizado-record"
                ref={autorizadoRef}
              />
            </div>
          </>
        )}

        <button onClick={(e) => handleUpload(e)} className="registrar-button">
          Registrar
        </button>
      </form>
    </div>
  );
};

// Styles
const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    textAlign: "center",
    color: "#333",
    marginBottom: "30px",
  },
  form: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    marginBottom: "40px",
  },
  uploadBox: {
    marginBottom: "20px",
  },
  fileInput: {
    width: "100%",
    padding: "10px",
    border: "2px dashed #ccc",
    borderRadius: "5px",
    cursor: "pointer",
  },
  previewBox: {
    marginTop: "20px",
    textAlign: "center",
  },
  previewImage: {
    maxWidth: "300px",
    maxHeight: "300px",
    borderRadius: "10px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  button: {
    width: "100%",
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "12px 30px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  },
  message: {
    marginTop: "20px",
    padding: "15px",
    borderRadius: "5px",
    textAlign: "center",
  },
  imagesSection: {
    marginTop: "40px",
  },
  subtitle: {
    color: "#333",
    marginBottom: "20px",
  },
  noImages: {
    textAlign: "center",
    color: "#999",
    fontSize: "18px",
  },
  imageGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
  },
  imageCard: {
    backgroundColor: "white",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    transition: "transform 0.2s",
  },
  thumbnailImage: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
  },
  imageInfo: {
    padding: "15px",
  },
  imageName: {
    margin: "0 0 5px 0",
    fontSize: "16px",
    color: "#333",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  imageDate: {
    margin: "0 0 10px 0",
    fontSize: "12px",
    color: "#999",
  },
  deleteButton: {
    width: "100%",
    backgroundColor: "#f44336",
    color: "white",
    padding: "8px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Visitantes;
