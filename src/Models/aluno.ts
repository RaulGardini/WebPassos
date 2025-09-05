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
    nome: string;
    email: string;
    telefone: string;
    cidade: string;
    responsavel_financeiro: string;
}