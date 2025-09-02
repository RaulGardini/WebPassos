export interface Aluno {
  aluno_id: number;
  nome: string;
  email?: string;
  telefone?: string;
  data_nascimento: string;
}

export interface Matricula {
  matricula_id: number;
  numero_matricula: string;
  aluno_id: number;
  turma_id: number;
  status: "ativa" | "inativa";
  valor_matricula: number;
  data_matricula: Date;
  aluno: Aluno;
}

export interface TurmaInfo {
  turma_id: number;
  nome: string;
  capacidade: number;
  matriculas_ativas: number;
  vagas_disponiveis: number;
  mensalidade: string;
}

export interface MatriculaFilters {
  nome?: string;
}