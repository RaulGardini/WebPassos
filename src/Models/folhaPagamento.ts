export interface FolhaPagamento {
  colaborador_id: number;
  nome_colaborador: string;
  nome_cargo: string;
  valor_total_a_receber: number;
  valor_ja_acumulado: number;
}

export interface FolhaPagamentoFilters {
  nome?: string;
  cargo_id?: number;
  mes?: number;
}

export interface HoraAula {
  hora_aula_id: number;
  quant_alunos: number;
  valor_hora_aula: number;
}

export interface HoraAulaProfSec {
  hora_aula_prof_sec_id: number;
  quant_alunos_prof_sec: number;
  valor_hora_aula_prof_sec: number;
}

export interface CreateHoraAulaData {
  quant_alunos: number;
  valor_hora_aula: number;
}

export interface CreateHoraAulaProfSecData {
  quant_alunos_prof_sec: number;
  valor_hora_aula_prof_sec: number;
}

export interface TempoAulaValor {
  tempo_aula_valor_id: number;
  duracao_aula: string;
  valor_aula: number;
}

export interface CreateTempoAulaValorData {
  duracao_aula: string;
  valor_aula: number;
}