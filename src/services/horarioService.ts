import axios from "axios";
import type { Horario, CreateHorarioData, UpdateHorarioData } from "../Models/horario";

const API_URL = "http://localhost:3000/horarios";

// GET all horários
export const getHorarios = async (): Promise<Horario[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

// GET horário by id
export const getHorarioById = async (id: number): Promise<Horario> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// CREATE horário
export const createHorario = async (data: CreateHorarioData): Promise<Horario> => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

// UPDATE horário
export const updateHorario = async (id: number, data: UpdateHorarioData): Promise<Horario> => {
  const response = await axios.put(`${API_URL}/${id}`, data);
  return response.data;
};

// DELETE horário
export const deleteHorario = async (id: number): Promise<{ message: string }> => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

// Buscar horários disponíveis para uma turma
export const getHorariosDisponiveisParaTurma = async (turmaId: number): Promise<Horario[]> => {
  const response = await axios.get(`${API_URL}/disponiveis-para-turma/${turmaId}`);
  return response.data;
};