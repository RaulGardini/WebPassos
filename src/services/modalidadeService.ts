import axios from "axios";
import type { Modalidade, CreateModalidadeData, UpdateModalidadeData } from "../Models/modalidade";

const API_URL = "http://localhost:3000/modalidades";

// GET all modalidades
export const getModalidades = async (nome_modalidade?: string): Promise<Modalidade[]> => {
  const response = await axios.get(API_URL, {
    params: nome_modalidade ? { nome_modalidade } : {}
  });
  return response.data;
};

// GET modalidade by id
export const getModalidadeById = async (id: number): Promise<Modalidade> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// CREATE modalidade
export const createModalidade = async (data: CreateModalidadeData): Promise<Modalidade> => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

// UPDATE modalidade
export const updateModalidade = async (id: number, data: UpdateModalidadeData): Promise<Modalidade> => {
  const response = await axios.put(`${API_URL}/${id}`, data);
  return response.data;
};

// DELETE modalidade
export const deleteModalidade = async (id: number): Promise<{ message: string }> => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};