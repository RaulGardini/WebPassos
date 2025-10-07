import axios from 'axios';
import type { 
  FolhaPagamento,
  FolhaPagamentoFilters,
  HoraAula,
  HoraAulaProfSec,
  CreateHoraAulaData,
  CreateHoraAulaProfSecData,
  TempoAulaValor,
  CreateTempoAulaValorData
} from '../Models/folhaPagamento';

const API_URL = 'http://localhost:3000';

export const getFolhaPagamento = async (filters?: FolhaPagamentoFilters): Promise<FolhaPagamento[]> => {
  try {
    const params = new URLSearchParams();
    
    if (filters?.nome) {
      params.append('nome', filters.nome);
    }
    if (filters?.cargo_id) {
      params.append('cargo_id', filters.cargo_id.toString());
    }
    if (filters?.mes) {
      params.append('mes', filters.mes.toString());
    }

    const response = await axios.get(`${API_URL}/folhaPagamento?${params.toString()}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Erro ao buscar folha de pagamento');
    }
    throw error;
  }
};

export const getHoraAula = async (): Promise<HoraAula[]> => {
    const response = await axios.get(`${API_URL}/horaAula`);
    return response.data;
};

export const createHoraAula = async (data: CreateHoraAulaData): Promise<HoraAula> => {
    const response = await axios.post(`${API_URL}/horaAula`, data);
    return response.data;
};

export const deleteHoraAula = async (hora_aula_id: number): Promise<void> => {
    await axios.delete(`${API_URL}/horaAula/${hora_aula_id}`);
};

export const getHoraAulaProfSec = async (): Promise<HoraAulaProfSec[]> => {
    const response = await axios.get(`${API_URL}/horaAulaProfSec`);
    return response.data;
};

export const createHoraAulaProfSec = async (data: CreateHoraAulaProfSecData): Promise<HoraAulaProfSec> => {
    const response = await axios.post(`${API_URL}/horaAulaProfSec`, data);
    return response.data;
};

export const deleteHoraAulaProfSec = async (hora_aula_prof_sec_id: number): Promise<void> => {
    await axios.delete(`${API_URL}/horaAulaProfSec/${hora_aula_prof_sec_id}`);
};

export const getTempoAulaValor = async (): Promise<TempoAulaValor[]> => {
    const response = await axios.get(`${API_URL}/tempoAulaValor`);
    return response.data;
};

export const createTempoAulaValor = async (data: CreateTempoAulaValorData): Promise<TempoAulaValor> => {
    const response = await axios.post(`${API_URL}/tempoAulaValor`, data);
    return response.data;
};

export const deleteTempoAulaValor = async (tempo_aula_valor_id: number): Promise<void> => {
    await axios.delete(`${API_URL}/tempoAulaValor/${tempo_aula_valor_id}`);
};