import { BrowserRouter, Routes, Route } from "react-router-dom";
import Formulario from "./Formulario/formulario";
import Home from "./Screens/Home/home";
//Aluno
import ListAluno from "./Screens/Alunos/listAluno";
import AddAluno from "./Screens/Alunos/addAluno";
import UpdateAluno from "./Screens/Alunos/updateAluno";
//Colaborador
import ListColaborador from "./Screens/Colaboradores/listColaborador";
import AddColaborador from "./Screens/Colaboradores/addColaborador";
import UpdateColaborador from "./Screens/Colaboradores/updateColaborador";
//Escola
import ListEscola from "./Screens/Escola/listEscola";
// Horarios
import ListHorarios from "./Screens/Horarios/listHorarios";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Formulario />} />
        <Route path="/home" element={<Home />} />
        {/* Aluno */}
        <Route path="/listAlunos" element={<ListAluno />} />
        <Route path="/addAlunos" element={<AddAluno />} />
        <Route path="/updateAluno/:id" element={<UpdateAluno />} />
        {/* Colaborador */}
        <Route path="/listColaboradores" element={<ListColaborador />} />
        <Route path="/addColaboradores" element={<AddColaborador />} />
        <Route path="/updateColaborador/:id" element={<UpdateColaborador />} />
        {/* Escola */}
        <Route path="/listEscolas" element={<ListEscola />} />
        {/* Horarios */}
        <Route path="/listHorarios" element={<ListHorarios />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
