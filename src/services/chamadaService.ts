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

// POST criar chamada para turma hoje
export const criarChamadaHoje = async (turmaId: number): Promise<{
  message: string;
  chamada: {
    chamada_id: number;
    turma_id: number;
    colaborador_id: number;
    data_aula: string;
  };
  data_aula: string;
}> => {
  const response = await axios.post(`${API_URL}/turma/${turmaId}/hoje`);
  return response.data;
};

// GET chamadas por colaborador e mês
export const buscarChamadasPorMes = async (
  colaboradorId: number, 
  mes: number
): Promise<{ chamadas: Array<{
  chamada_id: number;
  turma_id: number;
  turma_nome: string;
  colaborador_id: number;
  data_aula: string;
}> }> => {
  const response = await axios.get(`${API_URL}/colaborador/${colaboradorId}/mes?mes=${mes}`);
  return response.data;
};

export const gerarChamadasMes = async (colaboradorId: number): Promise<{
  message: string;
  chamadas_ja_existentes: number;
  chamadas_criadas: number;
  total_chamadas_mes: number;
  mes: number;
  ano: number;
  detalhes: Array<{
    chamada_id: number;
    turma_id: number;
    colaborador_id: number;
    data_aula: string;
  }>;
}> => {
  const response = await axios.post(`${API_URL}/gerar/${colaboradorId}`);
  return response.data;
};