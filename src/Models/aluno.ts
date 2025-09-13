export interface Aluno {
    aluno_id: number;
    nome: string;
    email: string;
    cpf: string;
    telefone?: string;
    sexo?: "M" | "F";
    data_criacao?: string;
    endereco?: string;
    cep?: string;
    responsavel_financeiro?: string;
    cidade?: string;
    data_nascimento?: string;
}

// Interface para dados de criação de aluno
export interface CreateAlunoData {
    nome: string;
    email: string;
    cpf: string;
    telefone?: string;
    sexo?: "M" | "F";
    endereco?: string;
    cep?: string;
    responsavel_financeiro?: string;
    cidade?: string;
    data_nascimento?: Date;
}

// Interface para dados de atualização de aluno
export interface UpdateAlunoData {
    nome?: string;
    email?: string;
    cpf?: string;
    telefone?: string;
    sexo?: "M" | "F";
    endereco?: string;
    cep?: string;
    responsavel_financeiro?: string;
    cidade?: string;
    data_nascimento?: Date;
}

export interface AlunoFilters {
    nome?: string;
    email?: string;
    telefone?: string;
    cidade?: string;
    responsavel_financeiro?: string;
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
  mensalidade: number;
  data_inicio: string;
  turma_lotada?: boolean;
  modalidade?: Modalidade;
  sala?: Sala;
}

export interface Matricula {
  matricula_id: number;
  numero_matricula: string;
  aluno_id: number;
  turma_id: number;
  status: "ativa" | "inativa";
  valor_matricula: number;
  data_matricula: Date;
  turma?: Turma; // Objeto turma quando incluído via include
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