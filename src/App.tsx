import { BrowserRouter, Routes, Route } from "react-router-dom";
import Formulario from "./Formulario/formulario";
import Home from "./Screens/Home/home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Formulario />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
