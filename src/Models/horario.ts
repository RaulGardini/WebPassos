export interface Horario {
  horario_id: number;
  dia_semana: string;
  horario: string;
}

export interface CreateHorarioData {
  dia_semana: string;
  horario: string;
}

export interface UpdateHorarioData {
  dia_semana?: string;
  horario?: string;
}