// App.js - Correção da rota
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
// Turmas
import ListTurmas from "./Screens/Turmas/listTurmas";
import AddTurmas from "./Screens/Turmas/addTurmas";
import AddTurmasHorarios from "./Screens/Turmas/addTurmasHorarios";
import UpdateTurmas from "./Screens/Turmas/updateTurmas";
import UpdateTurmasHorarios from "./Screens/Turmas//updateTurmasHorarios";

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
        {/* Turmas */}
        <Route path="/listTurmas" element={<ListTurmas />} />
        <Route path="/addTurmas" element={<AddTurmas />} />
        <Route path="/addhorarios/:turmaId" element={<AddTurmasHorarios />} />
        <Route path="/updateTurmas/:turmaId" element={<UpdateTurmas />} />
        <Route path="/updateturmashorarios/:turmaId" element={<UpdateTurmasHorarios />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;