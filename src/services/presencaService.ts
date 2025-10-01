import axios from "axios";
import type {
  UpdatePresencaData,
  ListarPresencasResponse,
  CriarPresencasResponse,
  AtualizarStatusResponse
} from "../Models/presenca";

const API_URL = "http://localhost:3000/presencas";

// POST criar todas as presenças de uma chamada
export const criarPresencas = async (chamadaId: number): Promise<CriarPresencasResponse> => {
  const response = await axios.post(`${API_URL}/chamada/${chamadaId}`);
  return response.data;
};

// GET listar todas as presenças de uma chamada
export const listarPresencas = async (chamadaId: number): Promise<ListarPresencasResponse> => {
  const response = await axios.get(`${API_URL}/chamada/${chamadaId}`);
  return response.data;
};

// PUT atualizar status de uma presença
export const atualizarStatusPresenca = async (
  presencaId: number,
  data: UpdatePresencaData
): Promise<AtualizarStatusResponse> => {
  const response = await axios.patch(`${API_URL}/${presencaId}`, data);
  return response.data;
};