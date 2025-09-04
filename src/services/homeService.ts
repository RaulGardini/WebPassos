import axios from "axios";
import type { EscolaInfoData } from '../Models/home';

const API_URL = "http://localhost:3000/dashboard";

// GET ocupação das turmas
export const getInfoEscola = async (): Promise<EscolaInfoData> => {
  const response = await axios.get(`${API_URL}/escola/info`);
  return response.data.data; // Retorna apenas os dados, não a estrutura completa
};