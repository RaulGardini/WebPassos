import axios from "axios";
import type { Aluno, CreateAlunoData, UpdateAlunoData, AlunoFilters } from '../Models/aluno';

const API_URL = "http://localhost:3000/alunos";

// GET all alunos
export const getAlunos = async (filters?: AlunoFilters): Promise<Aluno[]> => {
  const params: any = {};
  
  if (filters?.nome) params.nome = filters.nome;
  if (filters?.email) params.email = filters.email;
  if (filters?.telefone) params.telefone = filters.telefone;
  if (filters?.cidade) params.cidade = filters.cidade;
  if (filters?.responsavel_financeiro) params.responsavel_financeiro = filters.responsavel_financeiro;
  
  const response = await axios.get(API_URL, { params });
  return response.data;
};

// GET aluno by id
export const getAlunoById = async (id: number): Promise<Aluno> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// CREATE aluno
export const createAluno = async (data: CreateAlunoData): Promise<Aluno> => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

// UPDATE aluno
export const updateAluno = async (id: number, data: UpdateAlunoData): Promise<Aluno> => {
  const response = await axios.put(`${API_URL}/${id}`, data);
  return response.data;
};

// DELETE aluno
export const deleteAluno = async (id: number): Promise<{ message: string }> => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};