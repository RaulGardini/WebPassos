import { useState, useEffect } from "react";
import Header from "../../Header/header";
import type { Aluno, AlunoFilters } from "../../Models/alunos";
import { IoAdd } from "react-icons/io5";
import { FiSearch, FiX, FiUser, FiMail, FiPhone, FiMapPin, FiUsers } from "react-icons/fi";
import {
    ListAlunosContainer,
    AlunosTitle,
    DisplayFlex,
    TopLine,
    MidLine,
    FilterContainer,
    FilterGrid,
    FilterGroup,
    FilterLabel,
    FilterInput,
    FilterActions,
    FilterButton,
    TableContainer,
    LoadingState,
    ErrorState,
    EmptyState,
    Table,
    TableHeader,
    TableHeaderCell,
    TableBody,
    TableRow,
    TableCell,
    ActionButtons,
    ActionButton,
    ClearButton
} from "./style";
import { AddButton } from '../../ui/AddButton/style';

function ListAlunos() {
    const [alunos, setAlunos] = useState<Aluno[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<AlunoFilters>({
        nome: '',
        email: '',
        telefone: '',
        cidade: '',
        responsavel_financeiro: ''
    });

    // Função para buscar alunos da API
    const fetchAlunos = async (searchFilters?: AlunoFilters) => {
        try {
            setLoading(true);

            let url = 'http://localhost:3000/alunos';

            // Se há filtros, usa o endpoint de filtros
            if (searchFilters && Object.values(searchFilters).some(filter => filter.trim() !== '')) {
                const queryParams = new URLSearchParams();

                Object.entries(searchFilters).forEach(([key, value]) => {
                    if (value && value.trim() !== '') {
                        queryParams.append(key, value.trim());
                    }
                });

                url = `http://localhost:3000/alunos/filter?${queryParams.toString()}`;
            }

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Erro ao buscar alunos');
            }

            const data = await response.json();
            setAlunos(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
        } finally {
            setLoading(false);
        }
    };

    // Carregar alunos ao montar o componente
    useEffect(() => {
        fetchAlunos();
    }, []);

    // Função para lidar com mudanças nos filtros
    const handleFilterChange = (field: keyof AlunoFilters, value: string) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Função para aplicar filtros
    const applyFilters = () => {
        fetchAlunos(filters);
    };

    // Função para limpar filtros
    const clearFilters = () => {
        const emptyFilters = {
            nome: '',
            email: '',
            telefone: '',
            cidade: '',
            responsavel_financeiro: ''
        };
        setFilters(emptyFilters);
        fetchAlunos(); // Busca todos os alunos novamente
    };

    // Verificar se há filtros ativos
    const hasActiveFilters = Object.values(filters).some(filter => filter.trim() !== '');

    // Função para formatar CPF
    const formatCpf = (cpf: string) => {
        if (!cpf) return '';
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    };

    // Função para formatar telefone
    const formatTelefone = (telefone: string) => {
        if (!telefone) return '';
        const clean = telefone.replace(/\D/g, '');
        if (clean.length === 11) {
            return clean.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        }
        if (clean.length === 10) {
            return clean.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        }
        return telefone;
    };

    // Função para formatar data
    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    return (
        <>
            <Header />
            <ListAlunosContainer>
                <DisplayFlex>
                    <AlunosTitle>Alunos</AlunosTitle>
                    <TopLine></TopLine>
                </DisplayFlex>
                <AddButton><IoAdd />Novo</AddButton>
                <MidLine></MidLine>

                {/* Filtros */}
                <FilterContainer>
                    <FilterGrid>
                        <FilterGroup>
                            <FilterLabel>
                                <FiUser />
                                Nome
                            </FilterLabel>
                            <FilterInput
                                type="text"
                                placeholder="Digite o nome do aluno..."
                                value={filters.nome}
                                onChange={(e) => handleFilterChange('nome', e.target.value)}
                            />
                        </FilterGroup>

                        <FilterGroup>
                            <FilterLabel>
                                <FiMail />
                                E-mail
                            </FilterLabel>
                            <FilterInput
                                type="text"
                                placeholder="Digite o e-mail..."
                                value={filters.email}
                                onChange={(e) => handleFilterChange('email', e.target.value)}
                            />
                        </FilterGroup>

                        <FilterGroup>
                            <FilterLabel>
                                <FiPhone />
                                Telefone
                            </FilterLabel>
                            <FilterInput
                                type="text"
                                placeholder="Digite o telefone..."
                                value={filters.telefone}
                                onChange={(e) => handleFilterChange('telefone', e.target.value)}
                            />
                        </FilterGroup>

                        <FilterGroup>
                            <FilterLabel>
                                <FiMapPin />
                                Cidade
                            </FilterLabel>
                            <FilterInput
                                type="text"
                                placeholder="Digite a cidade..."
                                value={filters.cidade}
                                onChange={(e) => handleFilterChange('cidade', e.target.value)}
                            />
                        </FilterGroup>

                        <FilterGroup>
                            <FilterLabel>
                                <FiUsers />
                                Responsável Financeiro
                            </FilterLabel>
                            <FilterInput
                                type="text"
                                placeholder="Digite o nome do responsável..."
                                value={filters.responsavel_financeiro}
                                onChange={(e) => handleFilterChange('responsavel_financeiro', e.target.value)}
                            />
                        </FilterGroup>
                        <FilterActions>
                            <FilterButton onClick={applyFilters} disabled={loading}>
                                <FiSearch />
                                {loading ? 'Buscando...' : 'Buscar'}
                            </FilterButton>

                            <ClearButton onClick={clearFilters}>
                                <FiX />
                                Limpar Filtros
                            </ClearButton>
                        </FilterActions>
                    </FilterGrid>
                </FilterContainer>

                {/* Tabela de Alunos */}
                <TableContainer>
                    {loading && (
                        <LoadingState>
                            Carregando alunos...
                        </LoadingState>
                    )}

                    {error && (
                        <ErrorState>
                            {error}
                        </ErrorState>
                    )}

                    {!loading && !error && alunos.length === 0 && (
                        <EmptyState>
                            Nenhum aluno encontrado
                        </EmptyState>
                    )}

                    {!loading && !error && alunos.length > 0 && (
                        <Table>
                            <TableHeader>
                                <tr>
                                    <TableHeaderCell>ID</TableHeaderCell>
                                    <TableHeaderCell>Nome</TableHeaderCell>
                                    <TableHeaderCell>Email</TableHeaderCell>
                                    <TableHeaderCell>CPF</TableHeaderCell>
                                    <TableHeaderCell>Telefone</TableHeaderCell>
                                    <TableHeaderCell>Cidade</TableHeaderCell>
                                    <TableHeaderCell>Data Nasc.</TableHeaderCell>
                                    <TableHeaderCell className="center">Ações</TableHeaderCell>
                                </tr>
                            </TableHeader>
                            <TableBody>
                                {alunos.map((aluno, index) => (
                                    <TableRow key={aluno.aluno_id} index={index}>
                                        <TableCell>{aluno.aluno_id}</TableCell>
                                        <TableCell fontWeight="500">{aluno.nome}</TableCell>
                                        <TableCell color="#6c757d">{aluno.email}</TableCell>
                                        <TableCell>{formatCpf(aluno.cpf)}</TableCell>
                                        <TableCell>{formatTelefone(aluno.telefone || '')}</TableCell>
                                        <TableCell>{aluno.cidade || '-'}</TableCell>
                                        <TableCell>{formatDate(aluno.data_nascimento || '')}</TableCell>
                                        <TableCell textAlign="center">
                                            <ActionButtons>
                                                <ActionButton
                                                    onClick={() => console.log('Editar aluno:', aluno.aluno_id)}
                                                >
                                                    Editar
                                                </ActionButton>
                                                <ActionButton
                                                    variant="delete"
                                                    onClick={() => console.log('Deletar aluno:', aluno.aluno_id)}
                                                >
                                                    Deletar
                                                </ActionButton>
                                            </ActionButtons>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </TableContainer>
            </ListAlunosContainer>
        </>
    );
}

export default ListAlunos;