import axios from "axios";

export const getAulasHoje = async (): Promise<{
  data: string;
  total_aulas: number;
  aulas: Array<{
    turma_id: number;
    nome_turma: string;
    sala_id: number;
    modalidade_id: number;
    professor1_id?: number;
    professor2_id?: number;
    capacidade: number;
    matriculas_ativas: number;
    horarios: Array<{
      horario_id: number;
      dia_semana: string;
      horario: string;
    }>;
  }>;
}> => {
  const response = await axios.get(`http://localhost:3000/turmas/hoje`);
  return response.data;
};