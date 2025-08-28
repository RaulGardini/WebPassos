// services/turmasHorariosService.ts
import axios from "axios";

// Interface para horarios_turmas (baseada no seu modelo)
export interface TurmaHorario {
  turma_horario_id?: number;
  turma_id: number;
  horario_id: number;
  data_criacao?: Date;
}

// Interface para criação múltipla
export interface CreateMultipleHorariosTurma {
  turma_id: number;
  horarios_ids: number[];
}

const API_URL = "http://localhost:3000";

// GET horários de uma turma específica
export const getHorariosByTurmaId = async (turmaId: number): Promise<TurmaHorario[]> => {
  const response = await axios.get(`${API_URL}/turmas/${turmaId}/horarios`);
  return response.data;
};

// GET all horarios-turmas com filtros opcionais
export const getAllHorariosTurmas = async (turmaId?: number, horarioId?: number): Promise<TurmaHorario[]> => {
  const params = new URLSearchParams();
  if (turmaId) params.append('turma_id', turmaId.toString());
  if (horarioId) params.append('horario_id', horarioId.toString());
  
  const response = await axios.get(`${API_URL}/horarios-turmas?${params.toString()}`);
  return response.data;
};

// GET horario-turma by id
export const getHorarioTurmaById = async (id: number): Promise<TurmaHorario> => {
  const response = await axios.get(`${API_URL}/horarios-turmas/${id}`);
  return response.data;
};

// CREATE horário único para turma
export const addHorarioToTurma = async (turmaId: number, horarioId: number): Promise<TurmaHorario> => {
  const response = await axios.post(`${API_URL}/turmas/${turmaId}/horarios`, {
    horario_id: horarioId
  });
  return response.data;
};

// CREATE múltiplos horários para turma
export const addMultipleHorariosToTurma = async (turmaId: number, horariosIds: number[]): Promise<{ message: string; data: TurmaHorario[] }> => {
  const response = await axios.post(`${API_URL}/turmas/${turmaId}/horarios`, {
    horarios_ids: horariosIds
  });
  return response.data;
};

// DELETE todos os horários da turma
export const deleteAllHorariosFromTurma = async (turmaId: number): Promise<{ message: string; deletedCount: number }> => {
  const response = await axios.delete(`${API_URL}/turmas/${turmaId}/horarios`);
  return response.data;
};