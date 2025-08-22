import axios from "axios";
import type { Cargo}  from '../Models/cargo';

export const getCargos = async (): Promise<Cargo[]> => {
  const response = await axios.get("http://localhost:3000/cargos");
  return response.data;
};