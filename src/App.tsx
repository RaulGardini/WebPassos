import { BrowserRouter, Routes, Route } from "react-router-dom";
import Formulario from "./Formulario/formulario";
import Home from "./Screens/Home/home";
import ListAluno from "./Screens/Alunos/listAluno";
import AddAluno from "./Screens/Alunos/addAluno";
import UpdateAluno from "./Screens/Alunos/updateAluno";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Formulario />} />
        <Route path="/home" element={<Home />} />
        <Route path="/listAlunos" element={<ListAluno />} />
        <Route path="/addAlunos" element={<AddAluno />} />
        <Route path="/updateAluno/:id" element={<UpdateAluno />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
