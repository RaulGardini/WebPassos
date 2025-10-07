export interface Colaborador {
  colaborador_id: number;
  nome: string;
  email: string;
  cpf: string;
  telefone?: string;
  sexo?: "M" | "F";
  data_criacao?: string;
  data_nascimento: string;
  cargo_id: number;
}

// Interface para dados de criação de colaborador
export interface CreateColaboradorData {
    nome: string;
    email: string;
    cpf: string;
    telefone?: string;
    sexo?: string;
    data_nascimento: Date;
    cargo_id: number;
}

// Interface para dados de atualização de colaborador
export interface UpdateColaboradorData {
    nome: string;
    email: string;
    cpf: string;
    telefone?: string;
    sexo?: string;
    data_nascimento: Date;
    cargo_id: number;
}

export interface ColaboradorFilters {
  nome?: string;
  email?: string;
  cpf?: string;
  sexo?: string;
  cargo_id?: string;
}