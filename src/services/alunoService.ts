import axios from "axios";
import type { Aluno, CreateAlunoData, UpdateAlunoData, AlunoFilters } from '../Models/aluno';
import type { PaginatedResponse, PaginationParams } from "../Pagination/Pagination"

const API_URL = "http://localhost:3000/alunos";

// GET all alunos with optional pagination
export const getAlunos = async (filters?: AlunoFilters, pagination?: PaginationParams): Promise<PaginatedResponse<Aluno> | Aluno[]> => {
  const params: any = {};
  
  // Adiciona filtros apenas se tiverem valores
  if (filters?.nome?.trim()) params.nome = filters.nome.trim();
  if (filters?.email?.trim()) params.email = filters.email.trim();
  if (filters?.telefone?.trim()) params.telefone = filters.telefone.trim();
  if (filters?.cidade?.trim()) params.cidade = filters.cidade.trim();
  if (filters?.responsavel_financeiro?.trim()) params.responsavel_financeiro = filters.responsavel_financeiro.trim();
  if (filters?.mes_nascimento !== undefined && filters.mes_nascimento !== null) params.mes_nascimento = filters.mes_nascimento;
  
  // Adiciona parâmetros de paginação se fornecidos
  if (pagination) {
    params.page = pagination.page;
    params.limit = pagination.limit;
  }
  
  try {
    const response = await axios.get(API_URL, { params });
    
    // Verifica se a resposta tem estrutura de paginação
    if (response.data && typeof response.data === 'object' && 'data' in response.data && 'pagination' in response.data) {
      return response.data as PaginatedResponse<Aluno>;
    } else {
      // Se não tem paginação, retorna array simples
      return response.data as Aluno[];
    }
  } catch (error) {
    console.error('Erro ao buscar alunos:', error);
    throw error;
  }
};

// GET aluno by id
export const getAlunoById = async (id: number): Promise<Aluno> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

// CREATE aluno
export const createAluno = async (data: CreateAlunoData): Promise<Aluno> => {
    const response = await axios.post(API_URL, data);
    return response.data;
};

// UPDATE aluno
export const updateAluno = async (id: number, data: UpdateAlunoData): Promise<Aluno> => {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
};

// DELETE aluno
export const deleteAluno = async (id: number): Promise<{ message: string }> => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};