import axios from "axios";
import type { Cargo } from "../Models/cargo";

const API_URL = "http://localhost:3000/cargos";

// GET all cargos
export const getCargos = async (nome_cargo?: string): Promise<Cargo[]> => {
  const response = await axios.get(API_URL, {
    params: nome_cargo ? { nome_cargo } : {}
  });
  return response.data;
};

// GET cargo by id
export const getCargoById = async (id: number): Promise<Cargo> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// CREATE cargo
export const createCargo = async (data: Omit<Cargo, "cargo_id">): Promise<Cargo> => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

// UPDATE cargo
export const updateCargo = async (id: number, data: Partial<Cargo>): Promise<Cargo> => {
  const response = await axios.put(`${API_URL}/${id}`, data);
  return response.data;
};

// DELETE cargo
export const deleteCargo = async (id: number): Promise<{ message: string }> => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
