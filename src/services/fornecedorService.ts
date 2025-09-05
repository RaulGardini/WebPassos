import axios from "axios";
import type { Fornecedor, CreateFornecedorData, UpdateFornecedorData, FornecedorFilter } from '../Models/fornecedor';

const API_URL = "http://localhost:3000/fornecedores";

// GET all Fornecedor
export const getFornecedores = async (filters?: FornecedorFilter): Promise<Fornecedor[]> => {
  const params: any = {};
  
  if (filters?.nome) params.nome = filters.nome;
  if (filters?.email) params.email = filters.email;
  if (filters?.telefone) params.cpf = filters.telefone;
  
  const response = await axios.get(API_URL, { params });
  return response.data;
};

// GET Fornecedor by id
export const getFornecedorById = async (id: number): Promise<Fornecedor> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// CREATE Fornecedor
export const createFornecedor = async (data: CreateFornecedorData): Promise<Fornecedor> => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

// UPDATE Fornecedor
export const updateFornecedor = async (id: number, data: UpdateFornecedorData): Promise<Fornecedor> => {
  const response = await axios.put(`${API_URL}/${id}`, data);
  return response.data;
};

// DELETE Fornecedor
export const deleteFornecedor = async (id: number): Promise<{ message: string }> => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
