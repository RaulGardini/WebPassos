import axios from "axios";
import type { Colaborador, CreateColaboradorData, UpdateColaboradorData, ColaboradorFilters } from '../Models/colaborador';

const API_URL = "http://localhost:3000/colaboradores";

// GET all colaboradores
export const getColaboradores = async (filters?: ColaboradorFilters): Promise<Colaborador[]> => {
  const params: any = {};
  
  // Só adiciona aos params se o filtro tiver valor
  if (filters?.nome && filters.nome.trim()) params.nome = filters.nome.trim();
  if (filters?.email && filters.email.trim()) params.email = filters.email.trim();
  if (filters?.cpf && filters.cpf.trim()) params.cpf = filters.cpf.trim();
  if (filters?.sexo && filters.sexo.trim()) params.sexo = filters.sexo.trim();
  if (filters?.cargo_id && filters.cargo_id.trim()) params.cargo_id = filters.cargo_id.trim();
  
  const response = await axios.get(API_URL, { params });
  return response.data;
};

// GET colaborador by id
export const getColaboradorById = async (id: number): Promise<Colaborador> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// CREATE colaborador
export const createColaborador = async (data: CreateColaboradorData): Promise<Colaborador> => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

// UPDATE colaborador
export const updateColaborador = async (id: number, data: UpdateColaboradorData): Promise<Colaborador> => {
  const response = await axios.put(`${API_URL}/${id}`, data);
  return response.data;
};

// DELETE colaborador
export const deleteColaborador = async (id: number): Promise<{ message: string }> => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};