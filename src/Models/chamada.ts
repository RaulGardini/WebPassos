export interface Usuario {
  id: number;
  colaborador_id?: number;
  nome?: string;
  login: string;
  tipo: string;
}

export interface Chamada {
  chamada_id: number;
  turma_id: number;
  turma_nome: string;
  colaborador_id: number;
  data_aula: string;
  horario: string;
  dia_semana: string;
  data_formatada: string;
  nome_sala: string;
}

export interface ChamadasResponse {
  message: string;
  data: string;
  total_aulas?: number;
  chamadas: Chamada[];
}