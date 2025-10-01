export interface Modalidade {
  modalidade_id: number;
  nome_modalidade: string;
}

export interface CreateModalidadeData {
  nome_modalidade: string;
}

export interface UpdateModalidadeData {
  nome_modalidade?: string;
}