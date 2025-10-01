import { useState, useEffect } from "react";
import Header from "../../Header/header";
import type { Fornecedor, FornecedorFilter } from "../../Models/fornecedor";
import { IoAdd } from "react-icons/io5";
import { FiSearch, FiX, FiUser, FiMail, FiPhone } from "react-icons/fi";
import { MdEditSquare, MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { getFornecedores, deleteFornecedor } from "../../services/fornecedorService";
import {
    Title,
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
    ErrorState,
    EmptyState,
    Table,
    TableHeader,
    TableHeaderCell,
    TableBody,
    TableRow,
    TableCell,
    ActionButtons,
    ClearButton,
    EditButton,
} from "./style";
import { LoadingState } from "../../ui/Loading/style";
import { AddButton } from '../../ui/AddButton/style';
import { Container } from '../../ui/Container/style';

function ListFornecedores() {
    const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [filters, setFilters] = useState<FornecedorFilter>({
        nome: '',
        email: '',
        telefone: ''
    });

    // Função para buscar fornecedores usando o service
    const fetchFornecedores = async (searchFilters?: FornecedorFilter) => {
        try {
            setLoading(true);
            const data = await getFornecedores(searchFilters);
            setFornecedores(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
        } finally {
            setLoading(false);
        }
    };

    // Carregar fornecedores ao montar o componente
    useEffect(() => {
        fetchFornecedores();
    }, []);

    // Função para lidar com mudanças nos filtros
    const handleFilterChange = (field: keyof FornecedorFilter, value: string) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Função para aplicar filtros
    const applyFilters = () => {
        fetchFornecedores(filters);
    };

    // Função para limpar filtros
    const clearFilters = () => {
        const emptyFilters = {
            nome: '',
            email: '',
            telefone: ''
        };
        setFilters(emptyFilters);
        fetchFornecedores(); // Busca todos os fornecedores novamente
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

    const handleDelete = async (fornecedor_id: number) => {
        if (!window.confirm("Tem certeza que deseja deletar este fornecedor?")) return;

        try {
            await deleteFornecedor(fornecedor_id);
            alert("Fornecedor deletado com sucesso!");
            setFornecedores((prev) => prev.filter((fornecedor) => fornecedor.fornecedor_id !== fornecedor_id));
        } catch (error) {
            alert(error instanceof Error ? error.message : "Erro ao deletar fornecedor");
        }
    };

    return (
        <>
            <Header />
            <Container>
                <DisplayFlex>
                    <Title>Fornecedores</Title>
                    <TopLine></TopLine>
                </DisplayFlex>
                <AddButton onClick={() => navigate("/addFornecedores")}><IoAdd />Novo</AddButton>
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
                                placeholder="Digite o nome do fornecedor..."
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

                {/* Tabela de Fornecedores */}
                <TableContainer>
                    {loading && (
                        <LoadingState>
                            Carregando fornecedores...
                        </LoadingState>
                    )}

                    {error && (
                        <ErrorState>
                            {error}
                        </ErrorState>
                    )}

                    {!loading && !error && fornecedores.length === 0 && (
                        <EmptyState>
                            Nenhum fornecedor encontrado
                        </EmptyState>
                    )}

                    {!loading && !error && fornecedores.length > 0 && (
                        <Table>
                            <TableHeader>
                                <tr>
                                    <TableHeaderCell>ID</TableHeaderCell>
                                    <TableHeaderCell>Nome</TableHeaderCell>
                                    <TableHeaderCell>Email</TableHeaderCell>
                                    <TableHeaderCell>Telefone</TableHeaderCell>
                                    <TableHeaderCell className="center">Ações</TableHeaderCell>
                                </tr>
                            </TableHeader>
                            <TableBody>
                                {fornecedores.map((fornecedor, index) => (
                                    <TableRow key={fornecedor.fornecedor_id} index={index}>
                                        <TableCell>{fornecedor.fornecedor_id}</TableCell>
                                        <TableCell fontWeight="500">{fornecedor.nome}</TableCell>
                                        <TableCell color="#6c757d">{fornecedor.email}</TableCell>
                                        <TableCell>{formatTelefone(fornecedor.telefone || '')}</TableCell>
                                        <TableCell textAlign="center">
                                            <ActionButtons>
                                                <EditButton
                                                    onClick={() => navigate(`/updateFornecedores/${fornecedor.fornecedor_id}`)}
                                                >
                                                    <MdEditSquare />
                                                </EditButton>
                                                <EditButton
                                                    onClick={() => handleDelete(fornecedor.fornecedor_id)}
                                                >
                                                    <MdDelete />
                                                </EditButton>
                                            </ActionButtons>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </TableContainer>
            </Container>
        </>
    );
}

export default ListFornecedores;