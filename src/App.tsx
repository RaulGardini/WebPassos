// App.js - Correção da rota
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Formulario from "./Formulario/formulario";
import Home from "./Screens/Home/home";
// Professor
import Professor from "./ProfessorScreens/dashboard";
import ListChamadaProfessor from "./ProfessorScreens/Chamadas/listChamada"
//Aluno
import ListAluno from "./Screens/Alunos/listAluno";
import AddAluno from "./Screens/Alunos/addAluno";
import UpdateAluno from "./Screens/Alunos/updateAluno";
import TurmasAluno from "./Screens/Alunos/TurmasAlunos/listTurmasAluno";
//Colaborador
import ListColaborador from "./Screens/Colaboradores/listColaborador";
import AddColaborador from "./Screens/Colaboradores/addColaborador";
import UpdateColaborador from "./Screens/Colaboradores/updateColaborador";
import ListChamada from "./Screens/Colaboradores/Chamada/listChamada"
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
import AddMatricula from "./Screens/Turmas/addMatricula";
// TurmasHoje
import TurmasHoje from "./Screens/TurmasHoje/turmasHoje"
//Fornecedor
import ListFornecedor from "./Screens/Fornecedores/listFornecedor";
import AddFornecedor from "./Screens/Fornecedores/addFornecedores";
import UpdateFornecedor from "./Screens/Fornecedores/updateFornecedor"
// Gerenciar Usuários
import GerenciarUsuarios from "./Screens/GerenciarUsuarios/gerenciarUsuarios";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Formulario />} />
        <Route path="/home" element={<Home />} />
        {/* Professor */}
        <Route path="/professor" element={<Professor />} />
        <Route path="/listChamadaProfessor" element={<ListChamadaProfessor />} />
        {/* Aluno */}
        <Route path="/listAlunos" element={<ListAluno />} />
        <Route path="/addAlunos" element={<AddAluno />} />
        <Route path="/updateAluno/:id" element={<UpdateAluno />} />
        <Route path="/listTurmasAluno/:id" element={<TurmasAluno />} />
        {/* Colaborador */}
        <Route path="/listColaboradores" element={<ListColaborador />} />
        <Route path="/addColaboradores" element={<AddColaborador />} />
        <Route path="/updateColaborador/:id" element={<UpdateColaborador />} />
        <Route path="/listChamada/:id" element={<ListChamada />} />
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
        <Route path="/turmas/:turmaId/matriculas" element={<AddMatricula />} />
        {/* TurmasHoje */}
        <Route path="turmasHoje" element={<TurmasHoje />} />
        {/* Fornecedor */}
        <Route path="/listFornecedores" element={<ListFornecedor />} />
        <Route path="/addFornecedores" element={<AddFornecedor />} />
        <Route path="/updateFornecedores/:id" element={<UpdateFornecedor />} />
        {/* Fornecedor */}
        <Route path="/gerenciarUsuarios" element={<GerenciarUsuarios />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;