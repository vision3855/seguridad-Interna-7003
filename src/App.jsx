import { Routes, Route } from "react-router";
import Home from "./Pages/Home/Home";
import Header from "./components/Header/Header";
import ReportPatana from "./components/report-patana/ReportPatana";
import Tools from "./Pages/Tools/Tools";
import CalculatorAlmacen from "./components/calculator/CalculatorAlmacen";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/informe" element={<ReportPatana />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/tools/calculator" element={<CalculatorAlmacen />} />
      </Routes>
    </>
  );
}

export default App;
