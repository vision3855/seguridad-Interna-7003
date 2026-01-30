import { Routes, Route } from "react-router";
import Home from "./Pages/Home/Home";
import Header from "./components/Header/Header";
import ReportPatana from "./components/report-patana/ReportPatana";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/informe" element={<ReportPatana />} />
      </Routes>
    </>
  );
}

export default App;
