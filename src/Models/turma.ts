export interface Turma {
    turma_id: number;
    nome: string;
    sala_id: number;
    modalidade_id: number;
    professor1_id: number;
    professor2_id?: number;
    status: 'ativa' | 'inativa';
    mensalidade: string;
    data_criacao: string;
    capacidade: number;
    horarios: Horario[];
}

export interface Horario {
    horario_id: number;
    dia_semana: string;
    horario: string;
}

export interface TurmaFilters {
    nome?: string;
    status?: string;
    professor1_id?: string;
    modalidade_id?: string;
    sala_id?: string;
}

// Interface para dados de criação de turma
export interface CreateTurmaData {
  nome: string;
  sala_id: number;
  modalidade_id: number;
  professor1_id?: number;
  professor2_id?: number;
  professor3_id?: number;
  status: "ativa" | "inativa";
  mensalidade: number;
  capacidade: number;
}

// Interface para dados de atualização de turma
export interface UpdateTurmaData {
  nome?: string;
  sala_id?: number;
  modalidade_id?: number;
  professor1_id?: number;
  professor2_id?: number;
  professor3_id?: number;
  status?: "ativa" | "inativa";
  mensalidade?: number;
}