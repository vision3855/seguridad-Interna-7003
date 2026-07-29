import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Header from "./components/Header/Header";
import ReportPatana from "./components/report-patana/ReportPatana";
import Tools from "./Pages/Tools/Tools";
import CalculatorAlmacen from "./components/calculator/CalculatorAlmacen";
import Visitantes from "./Pages/visitantes/Visitantes";
import imgAlm from "./assets/images/menu-details/calcalma.jpeg";
import ingrepat from "./assets/images/menu-details/ingrepat.jpeg";
import ingrevis from "./assets/images/menu-details/ingrevis.jpeg";
import reportpat from "./assets/images/menu-details/reportpat.jpeg";
import reportvis from "./assets/images/menu-details/reportvis.jpeg";
import FilterIngreso from "./components/FilterIngreso/FilterIngreso";
import IngresoPatana from "./Pages/IngresoPatana/IngresoPatana";
import VisitantesCard from "./components/visitantes-card/VisitantesCard";
import Auth from "./components/auth/AuthComponent";
import { UserProvider, useUser } from "./contexts/context";
import UserProfile from "./components/user/UserProfile";
import TemplateIngreso from "./components/template/ingreso/TemplateIngreso";
import Alert from "./components/Alert-message/Alert";

function GlobalAlert() {
  const { alertMessage } = useUser();
  return <Alert alertMessage={alertMessage} />;
}

function App() {
  const driverTemplateData = [
    {
      name: "modelo para ingreso de choferes",
      image: imgAlm,
      to: "/modelo/ingreso",
      path: "/modelo",
    },
    {
      name: "modelo para salida de choferes",
      image: imgAlm,
      to: "/modelo/salida",
      path: "/modelo",    },
  ];

  const toolsData = [
    {
      name: "Calculator para Almacen",
      image: imgAlm,
      to: "/tools/calculator",
      path: "/tools",
    }, ...driverTemplateData
  ];
  
  const redactarData = [
    {
      name: "Ingreso de patanas",
      image: ingrepat,
      to: "/redactar/ingreso",
      path: "/redactar",
    },
    { name: "Visitantes", image: ingrevis, to: "/redactar/visitantes" },
  ];
  const informeData = [
    {
      name: "Ingreso de patanas",
      image: reportpat,
      to: "/informe/patana",
      path: "/informe",
    },
    { name: "Visitantes", image: reportvis, to: "/informe/visitantes" },
  ];

  const bigToolsData = [toolsData, redactarData, informeData, driverTemplateData];

  return (
    <>
      <UserProvider>
        <GlobalAlert />
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/redactar/ingreso" element={<IngresoPatana />} />
          <Route path="/informe/patana" element={<ReportPatana />} />
          <Route path="/informe/visitantes" element={<VisitantesCard />} />
          {bigToolsData.map((data, index) => (
            <Route
              key={index}
              path={`/${data[0].path}`}
              element={<Tools obj={data} />}
            />
          ))}
          <Route path="/tools/calculator" element={<CalculatorAlmacen />} />
          <Route path="/redactar/visitantes" element={<Visitantes />} />
          <Route path="/modelo/ingreso" element={<TemplateIngreso />} />
          <Route path="/modelo/salida" element={<Visitantes />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/alez" element={<FilterIngreso />} />
        </Routes>
      </UserProvider>
    </>
  );
}

export default App;
