import axios from "axios";
import type { Aluno } from "../Models/aluno";
import type { Matricula, TurmaInfo, MatriculaFilters } from "../Models/matricula";

const API_URL = "http://localhost:3000/matricula";

// GET alunos disponíveis para matrícula
export const getAlunosDisponiveis = async (turma_id: number, filters?: MatriculaFilters): Promise<Aluno[]> => {
  const params: any = {};
  if (filters?.nome) params.nome = filters.nome;
  
  const response = await axios.get(`${API_URL}/turmas/${turma_id}/alunos-disponiveis`, { params });
  return response.data.data;
};

// GET alunos matriculados na turma
export const getAlunosMatriculados = async (turma_id: number, filters?: MatriculaFilters): Promise<Matricula[]> => {
  const params: any = {};
  if (filters?.nome) params.nome = filters.nome;
  
  const response = await axios.get(`${API_URL}/turmas/${turma_id}/alunos-matriculados`, { params });
  return response.data.data;
};

// POST matricular aluno
export const matricularAluno = async (turma_id: number, aluno_id: number) => {
  const response = await axios.post(`${API_URL}/turmas/${turma_id}/matricular`, { aluno_id });
  return response.data;
};

// DELETE matrícula
export const deletarMatricula = async (matricula_id: number) => {
  const response = await axios.delete(`${API_URL}/${matricula_id}`);
  return response.data;
};

// GET informações da turma
export const getTurmaInfo = async (turma_id: number): Promise<TurmaInfo> => {
  const response = await axios.get(`${API_URL}/turmas/${turma_id}/info`);
  return response.data.data;
};

// GET turmas onde o aluno está matriculado
export const getTurmasDoAluno = async (aluno_id: number): Promise<Matricula[]> => {
  const response = await axios.get(`${API_URL}/alunos/${aluno_id}/turmas-matriculadas`);
  return response.data.data;
};

// GET turmas disponíveis para matrícula do aluno
export const getTurmasDisponiveis = async (aluno_id: number): Promise<any[]> => {
  const response = await axios.get(`${API_URL}/alunos/${aluno_id}/turmas-disponiveis`);
  return response.data.data;
};

// POST matricular aluno em turma específica
export const matricularAlunoNaTurma = async (aluno_id: number, turma_id: number) => {
  const response = await axios.post(`${API_URL}/alunos/${aluno_id}/matricular/${turma_id}`);
  return response.data;
};