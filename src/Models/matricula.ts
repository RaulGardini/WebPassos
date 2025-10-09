// Interfaces corrigidas
export interface Aluno {
  aluno_id: number;
  nome: string;
  email?: string;
  telefone?: string;
  data_nascimento: string;
}

export interface Modalidade {
  modalidade_id: number;
  nome: string;
}

export interface Sala {
  sala_id: number;
  nome: string;
}

export interface Turma {
  turma_id: number;
  nome: string;
  capacidade: number;
  matriculas_ativas: number;
  vagas_disponiveis: number;
  mensalidade: number; // Mudou de string para number
  data_inicio: string;
  turma_lotada?: boolean;
  modalidade?: Modalidade; // ou modalidade_id se for apenas o ID
  sala?: Sala; // ou sala_id se for apenas o ID
}

export interface Matricula {
  matricula_id: number;
  numero_matricula: string;
  aluno_id: number;
  turma_id: number;
  nome_turma: string;
  status: "ativa" | "inativa";
  valor_matricula: number;
  data_matricula: Date;
  desconto_perc?: number;
  desconto_num?: number;
  valor_final?: number;
  aluno: Aluno;
}

// OU, se turma_id for apenas o ID, crie uma interface separada para matrícula com turma populada:
export interface MatriculaComTurma {
  matricula_id: number;
  numero_matricula: string;
  aluno_id: number;
  turma_id: number;
  turma: Turma; // Objeto turma completo
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