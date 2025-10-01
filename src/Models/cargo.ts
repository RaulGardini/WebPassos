
export interface Cargo {
  cargo_id: number;
  nome_cargo: string;
}

export interface CreateCargoData {
  nome_cargo: string;
}

export interface UpdateCargoData {
  nome_cargo?: string;
}