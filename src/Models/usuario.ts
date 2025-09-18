export interface Usuario {
    id: number;
    login: string;
    nome: string;
    tipo: 'Professor' | 'Admin';
};