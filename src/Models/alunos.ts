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

export interface AlunoFilters {
    nome: string;
    email: string;
    telefone: string;
    cidade: string;
    responsavel_financeiro: string;
}