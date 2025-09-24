import axios from "axios";
import type { ChamadasResponse } from '../Models/chamada';

const API_URL = "http://localhost:3000/chamadas";

// GET chamadas do dia por colaborador
export const buscarChamadasDoDia = async (colaboradorId: number): Promise<ChamadasResponse> => {
  const response = await axios.get(`${API_URL}/colaborador/${colaboradorId}/hoje`);
  return response.data;
};

// POST gerar chamadas do mês
export const gerarChamadasDoMes = async (colaboradorId: number): Promise<{ message: string }> => {
  const response = await axios.post(`${API_URL}/gerar/${colaboradorId}`);
  return response.data;
};