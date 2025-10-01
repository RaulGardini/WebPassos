export interface Presenca {
  presenca_id: number;
  chamada_id: number;
  aluno_id: number;
  status: "presente" | "falta";
  aluno: string;
}

export interface CreatePresencaData {
  chamada_id: number;
  aluno_id: number;
  status: "presente" | "falta";
}

export interface UpdatePresencaData {
  status?: "presente" | "falta";
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