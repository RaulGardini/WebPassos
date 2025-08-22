import axios from "axios";
import type { Colaborador, CreateColaboradorData, UpdateColaboradorData, ColaboradorFilters } from '../Models/colaborador';

const API_BASE_URL = "http://localhost:3000";

export const colaboradorService = {
    // Buscar todos os colaboradores ou com filtros
    getColaboradores: async (filters?: ColaboradorFilters): Promise<Colaborador[]> => {
        try {
            let url = `${API_BASE_URL}/colaboradores`;

            // Se há filtros, adiciona como query params
            if (filters && Object.values(filters).some(filter => filter.trim() !== '')) {
                const queryParams = new URLSearchParams();

                Object.entries(filters).forEach(([key, value]) => {
                    if (value && value.trim() !== '') {
                        queryParams.append(key, value.trim());
                    }
                });

                url = `${url}?${queryParams.toString()}`;
            }

            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.error || 'Erro ao buscar colaboradores');
            }
            throw new Error('Erro desconhecido ao buscar colaboradores');
        }
    },

    // Buscar colaborador por ID
    getColaboradorById: async (id: string | number): Promise<Colaborador> => {
        try {
            const response = await axios.get(`${API_BASE_URL}/colaboradores/${id}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.error || `Erro ao buscar colaborador com ID ${id}`);
            }
            throw new Error('Erro desconhecido ao buscar colaborador');
        }
    },

    // Criar novo colaborador
    createColaborador: async (data: CreateColaboradorData): Promise<Colaborador> => {
        try {
            const response = await axios.post(`${API_BASE_URL}/colaboradores`, data, {
                headers: { 
                    "Content-Type": "application/json" 
                }
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.error || 'Erro ao cadastrar colaborador');
            }
            throw new Error('Erro desconhecido ao cadastrar colaborador');
        }
    },

    // Atualizar colaborador
    updateColaborador: async (id: string | number, data: UpdateColaboradorData): Promise<Colaborador> => {
        try {
            const response = await axios.put(`${API_BASE_URL}/colaboradores/${id}`, data, {
                headers: { 
                    "Content-Type": "application/json" 
                }
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.error || 'Erro ao atualizar colaborador');
            }
            throw new Error('Erro desconhecido ao atualizar colaborador');
        }
    },

    // Deletar colaborador
    deleteColaborador: async (id: string | number): Promise<void> => {
        try {
            await axios.delete(`${API_BASE_URL}/colaboradores/${id}`);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || error.response?.data?.error || 'Erro ao deletar colaborador');
            }
            throw new Error('Erro desconhecido ao deletar colaborador');
        }
    }
};

export default colaboradorService;