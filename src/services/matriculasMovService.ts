import axios from "axios";

const API_URL = "http://localhost:3000/matriculasMov";

// GET movimentacoes de matriculas
export const getMatriculasMov = async () => {
  const response = await axios.get(`${API_URL}/movimentacoes`);
  return response.data;
};