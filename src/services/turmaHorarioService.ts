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

const API_URL = "http://localhost:3000/horarioTurma";

// CREATE múltiplos horários para turma
export const addMultipleHorariosToTurma = async (turmaId: number, horariosIds: number[]): Promise<{ message: string; data: TurmaHorario[] }> => {
  const response = await axios.post(`${API_URL}/turmas/${turmaId}/horarios`, {
    horarios_ids: horariosIds
  });
  return response.data;
};

// DELETE todos os horários da turma
export const removeAllHorariosFromTurma = async (turmaId: number): Promise<{ message: string; deletedCount: number }> => {
  const response = await axios.delete(`${API_URL}/turmas/${turmaId}/horarios`);
  return response.data;
};