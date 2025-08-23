import axios from "axios";
import type { Sala } from "../Models/sala";

const API_URL = "http://localhost:3000/salas";

// GET all salas
export const getSalas = async (nome_sala?: string): Promise<Sala[]> => {
  const response = await axios.get(API_URL, {
    params: nome_sala ? { nome_sala } : {}
  });
  return response.data;
};


// GET sala by id
export const getSalaById = async (id: number): Promise<Sala> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// CREATE sala
export const createSala = async (data: Omit<Sala, "sala_id">): Promise<Sala> => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

// UPDATE sala
export const updateSala = async (id: number, data: Partial<Sala>): Promise<Sala> => {
  const response = await axios.put(`${API_URL}/${id}`, data);
  return response.data;
};

// DELETE sala
export const deleteSala = async (id: number): Promise<{ message: string }> => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
