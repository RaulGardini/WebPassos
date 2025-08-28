import axios from "axios";
import type { Turma, CreateTurmaData, UpdateTurmaData, TurmaFilters } from '../Models/turma';

const API_URL = "http://localhost:3000/turmas";

// GET all turmas
export const getTurmas = async (filters?: TurmaFilters): Promise<Turma[]> => {
  const params: any = {};
  
  if (filters?.nome) params.nome = filters.nome;
  if (filters?.professor1_id) params.professor1_id = filters.professor1_id;
  if (filters?.status) params.status = filters.status;
  if (filters?.sala_id) params.sala_id = filters.sala_id;
  if (filters?.modalidade_id) params.modalidade_id = filters.modalidade_id;
  
  const response = await axios.get(API_URL, { params });
  return response.data;
};

// GET turma by id
export const getTurmaById = async (id: number): Promise<Turma> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// CREATE turma
export const createTurma = async (data: CreateTurmaData): Promise<Turma> => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

// UPDATE turma
export const updateTurma = async (id: number, data: UpdateTurmaData): Promise<Turma> => {
  const response = await axios.put(`${API_URL}/${id}`, data);
  return response.data;
};

// DELETE turma
export const deleteTurma = async (id: number): Promise<{ message: string }> => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

export const getTurmaWithHorarios = async (id: number): Promise<Turma> => {
  const response = await axios.get(`${API_URL}/${id}?include=horarios`);
  return response.data;
};

// Função para verificar se uma turma pode ser editada
export const checkTurmaEditPermission = async (id: number): Promise<{canEdit: boolean, reason?: string}> => {
  try {
    const response = await axios.get(`${API_URL}/${id}/edit-permission`);
    return response.data;
  } catch (error: any) {
    return {
      canEdit: false,
      reason: error.response?.data?.message || "Erro ao verificar permissões"
    };
  }
};

// Função para obter estatísticas da turma
export const getTurmaStats = async (id: number): Promise<{
  totalAlunos: number,
  totalHorarios: number,
  horariosDisponiveis: number,
  capacidadeOcupada: number
}> => {
  const response = await axios.get(`${API_URL}/${id}/stats`);
  return response.data;
};