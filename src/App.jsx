import { Routes, Route } from "react-router";
import Home from "./Pages/Home/Home";
import Header from "./components/Header/Header";
import ReportPatana from "./components/report-patana/ReportPatana";
import Tools from "./Pages/Tools/Tools";
import CalculatorAlmacen from "./components/calculator/CalculatorAlmacen";
import Visitantes from "./Pages/visitantes/Visitantes";
import imgAlm from "./assets/images/calc-img.jpeg";
import IngresoPatana from "./Pages/IngresoPatana/IngresoPatana";
const toolsData = [
  { name: "Calculator para Almacen", image: imgAlm, to: "/tools/calculator" },
];
const redactarData = [
  { name: "Ingreso de patanas", image: imgAlm, to: "/redactar/ingreso" },
  { name: "Visitantes", image: imgAlm, to: "/informe/visitantes" },
];

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/redactar/ingreso" element={<IngresoPatana />} />
        <Route path="/informe" element={<ReportPatana />} />
        <Route path="/tools" element={<Tools obj={toolsData} />} />
        <Route path="/redactar" element={<Tools obj={redactarData} />} />
        <Route path="/tools/calculator" element={<CalculatorAlmacen />} />
        <Route path="/informe/visitantes" element={<Visitantes />} />
      </Routes>
    </>
  );
}

export default App;
