import axios from "axios";

const API_URL = "http://localhost:3000/presencas";

export interface Presenca {
  presenca_id: number;
  chamada_id: number;
  aluno_id: number;
  status: "presente" | "falta";
  aluno: string;
}

export interface ListarPresencasResponse {
  message: string;
  chamada_id: number;
  total: number;
  presentes: number;
  faltas: number;
  presencas: Presenca[];
}

export interface CriarPresencasResponse {
  message: string;
  chamada_id: number;
  total_alunos: number;
  presencas: Array<{
    presenca_id: number;
    chamada_id: number;
    aluno_id: number;
    status: "presente" | "falta";
  }>;
}

export interface AtualizarStatusResponse {
  message: string;
  presenca: {
    presenca_id: number;
    chamada_id: number;
    aluno_id: number;
    status: "presente" | "falta";
  };
}

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

// PATCH atualizar status de uma presença
export const atualizarStatusPresenca = async (
  presencaId: number,
  status: "presente" | "falta"
): Promise<AtualizarStatusResponse> => {
  const response = await axios.patch(`${API_URL}/${presencaId}`, { status });
  return response.data;
};