export interface Fornecedor {
  fornecedor_id: number;
  nome: string;
  email: string;
  telefone: string;
}

export interface CreateFornecedorData {
  nome: string;
  email: string;
  telefone: string;
}

export interface UpdateFornecedorData {
  nome: string;
  email: string;
  telefone: string;
}

export interface FornecedorFilter {
  nome: string;
  email: string;
  telefone: string;
}