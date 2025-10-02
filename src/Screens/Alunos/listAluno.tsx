import { useState, useEffect, useCallback } from "react";
import Header from "../../Header/header";
import type { Aluno, AlunoFilters } from "../../Models/aluno";
import { IoAdd } from "react-icons/io5";
import { FiSearch, FiX, FiUser, FiMail, FiPhone, FiUsers, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { MdEditSquare, MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { FaEye, FaGraduationCap, FaCalendarAlt } from "react-icons/fa";
import { getAlunos, deleteAluno } from "../../services/alunoService";
import type { PaginatedResponse } from "../../Pagination/Pagination";

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
    Modal,
    InfoModal,
    PaginationContainer,
    PaginationControls,
    PaginationButton
} from "./style";
import CustomSelect from '../../ui/Select/custumSelect';
import { LoadingState } from "../../ui/Loading/style";
import { AddButton } from '../../ui/AddButton/style';
import { Container } from '../../ui/Container/style';

interface PaginationState {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNext: boolean;
    hasPrev: boolean;
}

const ITEMS_PER_PAGE = 35;

const formatters = {
    cpf: (cpf: string) => cpf?.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") || "",
    telefone: (telefone: string) => {
        if (!telefone) return "";
        const clean = telefone.replace(/\D/g, "");
        return clean.length === 11
            ? clean.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
            : clean.length === 10
                ? clean.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3")
                : telefone;
    },
    sexo: (sexo?: string) => (sexo === "M" ? "Masculino" : sexo === "F" ? "Feminino" : ""),
    idade: (dateString: string) => {
        if (!dateString) return "";
        const hoje = new Date();
        const nascimento = new Date(dateString);
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const m = hoje.getMonth() - nascimento.getMonth();
        if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) idade--;
        return `${idade} anos`;
    },
    data: (dataString?: string) => (dataString ? new Date(dataString).toLocaleDateString("pt-BR") : ""),
};

function ListAlunos() {
    const navigate = useNavigate();
    const [alunos, setAlunos] = useState<Aluno[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedAluno, setSelectedAluno] = useState<Aluno | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [filters, setFilters] = useState<AlunoFilters>({
        nome: '',
        email: '',
        telefone: '',
        responsavel_financeiro: '',
        mes_nascimento: undefined
    });

    const [pagination, setPagination] = useState<PaginationState>({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: ITEMS_PER_PAGE,
        hasNext: false,
        hasPrev: false
    });

    const hasActiveFilters = useCallback(() => {
        return Object.values(filters).some(value => value && value.toString().trim() !== '');
    }, [filters]);

    const fetchAlunos = useCallback(async (searchFilters?: AlunoFilters, page: number = 1) => {
        try {
            setLoading(true);
            setError(null);

            const result = await getAlunos(searchFilters, { page, limit: ITEMS_PER_PAGE });

            if (result && typeof result === 'object' && 'data' in result && 'pagination' in result) {
                const paginatedResult = result as PaginatedResponse<Aluno>;
                setAlunos(paginatedResult.data);
                setPagination(paginatedResult.pagination);
            } else {
                const alunosArray = result as Aluno[];
                setAlunos(alunosArray);
                setPagination({
                    currentPage: 1,
                    totalPages: 1,
                    totalItems: alunosArray.length,
                    itemsPerPage: alunosArray.length,
                    hasNext: false,
                    hasPrev: false
                });
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao buscar alunos');
            setAlunos([]);
            setPagination({
                currentPage: 1,
                totalPages: 1,
                totalItems: 0,
                itemsPerPage: ITEMS_PER_PAGE,
                hasNext: false,
                hasPrev: false
            });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAlunos();
    }, [fetchAlunos]);

    const handleFilterChange = (field: keyof AlunoFilters, value: string | number | undefined) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const applyFilters = () => {
        const activeFilters = hasActiveFilters() ? filters : undefined;
        fetchAlunos(activeFilters, 1);
    };

    const clearFilters = () => {
        setFilters({
            nome: '',
            email: '',
            telefone: '',
            responsavel_financeiro: '',
            mes_nascimento: undefined
        });
        fetchAlunos(undefined, 1);
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= pagination.totalPages) {
            const activeFilters = hasActiveFilters() ? filters : undefined;
            fetchAlunos(activeFilters, page);
        }
    };

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        const { currentPage, totalPages } = pagination;

        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);

        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    };

    const handleDelete = async (aluno_id: number) => {
        if (!window.confirm("Tem certeza que deseja deletar este aluno?")) return;

        try {
            await deleteAluno(aluno_id);
            alert("Aluno deletado com sucesso!");

            const activeFilters = hasActiveFilters() ? filters : undefined;
            fetchAlunos(activeFilters, pagination.currentPage);
        } catch (error) {
            alert(error instanceof Error ? error.message : "Erro ao deletar aluno");
        }
    };

    const openAlunoModal = (aluno: Aluno) => {
        setSelectedAluno(aluno);
        setIsModalOpen(true);
    };

    const closeAlunoModal = () => {
        setSelectedAluno(null);
        setIsModalOpen(false);
    };

    return (
        <>
            <Header />
            <Container>
                <DisplayFlex>
                    <Title>Alunos</Title>
                    <TopLine></TopLine>
                </DisplayFlex>
                <AddButton onClick={() => navigate("/addAlunos")}>
                    <IoAdd />Novo
                </AddButton>
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
                                onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
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
                                onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
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
                                onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
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
                                onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
                            />
                        </FilterGroup>

                        <FilterGroup>
                            <FilterLabel>
                                <FaCalendarAlt />
                                Mês de Nascimento
                            </FilterLabel>
                            <CustomSelect
                                value={filters.mes_nascimento || ''}
                                onChange={(value) => handleFilterChange('mes_nascimento', value ? Number(value) : undefined)}

                                options={[
                                    { value: '', label: 'Todos os meses' },
                                    { value: 1, label: 'Janeiro' },
                                    { value: 2, label: 'Fevereiro' },
                                    { value: 3, label: 'Março' },
                                    { value: 4, label: 'Abril' },
                                    { value: 5, label: 'Maio' },
                                    { value: 6, label: 'Junho' },
                                    { value: 7, label: 'Julho' },
                                    { value: 8, label: 'Agosto' },
                                    { value: 9, label: 'Setembro' },
                                    { value: 10, label: 'Outubro' },
                                    { value: 11, label: 'Novembro' },
                                    { value: 12, label: 'Dezembro' }
                                ]}
                                placeholder="Selecione o mês"
                            />
                        </FilterGroup>

                        <FilterActions>
                            <FilterButton onClick={applyFilters} disabled={loading}>
                                <FiSearch />
                                {loading ? 'Buscando...' : 'Buscar'}
                            </FilterButton>

                            <ClearButton onClick={clearFilters} disabled={loading}>
                                <FiX />
                                Limpar Filtros
                            </ClearButton>
                        </FilterActions>
                    </FilterGrid>
                </FilterContainer>

                {/* Tabela de Alunos */}
                <TableContainer>
                    {loading && <LoadingState>Carregando alunos...</LoadingState>}
                    {error && <ErrorState>{error}</ErrorState>}
                    {!loading && !error && alunos.length === 0 && (
                        <EmptyState>Nenhum aluno encontrado</EmptyState>
                    )}

                    {!loading && !error && alunos.length > 0 && (
                        <>
                            <Table>
                                <TableHeader>
                                    <tr>
                                        <TableHeaderCell>ID</TableHeaderCell>
                                        <TableHeaderCell>Nome</TableHeaderCell>
                                        <TableHeaderCell>Email</TableHeaderCell>
                                        <TableHeaderCell>CPF</TableHeaderCell>
                                        <TableHeaderCell>Telefone</TableHeaderCell>
                                        <TableHeaderCell>Cidade</TableHeaderCell>
                                        <TableHeaderCell>Idade</TableHeaderCell>
                                        <TableHeaderCell className="center">Ações</TableHeaderCell>
                                    </tr>
                                </TableHeader>
                                <TableBody>
                                    {alunos.map((aluno, index) => (
                                        <TableRow key={aluno.aluno_id} index={index}>
                                            <TableCell>{aluno.aluno_id}</TableCell>
                                            <TableCell fontWeight="500">{aluno.nome}</TableCell>
                                            <TableCell color="#6c757d">{aluno.email}</TableCell>
                                            <TableCell>{formatters.cpf(aluno.cpf)}</TableCell>
                                            <TableCell>{formatters.telefone(aluno.telefone || '')}</TableCell>
                                            <TableCell>{aluno.cidade || '-'}</TableCell>
                                            <TableCell>{formatters.idade(aluno.data_nascimento || '')}</TableCell>
                                            <TableCell textAlign="center">
                                                <ActionButtons>
                                                    <EditButton
                                                        onClick={() => navigate(`/listTurmasAluno/${aluno.aluno_id}`)}
                                                        title="Gerenciar turmas"
                                                    >
                                                        <FaGraduationCap />
                                                    </EditButton>
                                                    <EditButton
                                                        onClick={() => navigate(`/updateAluno/${aluno.aluno_id}`)}
                                                        title="Editar aluno"
                                                    >
                                                        <MdEditSquare />
                                                    </EditButton>
                                                    <EditButton
                                                        onClick={() => openAlunoModal(aluno)}
                                                        title="Ver detalhes"
                                                    >
                                                        <FaEye />
                                                    </EditButton>
                                                    <EditButton
                                                        onClick={() => handleDelete(aluno.aluno_id)}
                                                        title="Deletar aluno"
                                                    >
                                                        <MdDelete />
                                                    </EditButton>
                                                </ActionButtons>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            {/* Controles de Paginação */}
                            {pagination.totalPages > 1 && (
                                <PaginationContainer>
                                    <PaginationControls>
                                        <PaginationButton
                                            onClick={() => handlePageChange(pagination.currentPage - 1)}
                                            disabled={!pagination.hasPrev || loading}
                                            title="Página anterior"
                                        >
                                            <FiChevronLeft />
                                        </PaginationButton>

                                        {getPageNumbers().map(pageNum => (
                                            <PaginationButton
                                                key={pageNum}
                                                onClick={() => handlePageChange(pageNum)}
                                                active={pageNum === pagination.currentPage}
                                                disabled={loading}
                                            >
                                                {pageNum}
                                            </PaginationButton>
                                        ))}

                                        <PaginationButton
                                            onClick={() => handlePageChange(pagination.currentPage + 1)}
                                            disabled={!pagination.hasNext || loading}
                                            title="Próxima página"
                                        >
                                            <FiChevronRight />
                                        </PaginationButton>
                                    </PaginationControls>
                                </PaginationContainer>
                            )}
                        </>
                    )}
                </TableContainer>

                {/* Modal de Detalhes */}
                {isModalOpen && selectedAluno && (
                    <Modal>
                        <InfoModal>
                            <h2>Detalhes do Aluno</h2>
                            <p><strong>ID:</strong> {selectedAluno.aluno_id}</p>
                            <p><strong>Nome:</strong> {selectedAluno.nome}</p>
                            <p><strong>Email:</strong> {selectedAluno.email}</p>
                            <p><strong>CPF:</strong> {formatters.cpf(selectedAluno.cpf)}</p>
                            <p><strong>Telefone:</strong> {formatters.telefone(selectedAluno.telefone || '')}</p>
                            <p><strong>Sexo:</strong> {formatters.sexo(selectedAluno.sexo)}</p>
                            <p><strong>Data de Nascimento:</strong> {formatters.data(selectedAluno.data_nascimento)}</p>
                            <p><strong>Idade:</strong> {formatters.idade(selectedAluno.data_nascimento || '')}</p>
                            <p><strong>Cidade:</strong> {selectedAluno.cidade || '-'}</p>
                            <p><strong>Endereço:</strong> {selectedAluno.endereco || '-'}</p>
                            <p><strong>CEP:</strong> {selectedAluno.cep || '-'}</p>
                            <p><strong>Responsável Financeiro:</strong> {selectedAluno.responsavel_financeiro || '-'}</p>
                            <p><strong>Data de Criação:</strong> {formatters.data(selectedAluno.data_criacao)}</p>
                            <button onClick={closeAlunoModal} style={{
                                marginTop: '1rem',
                                padding: '0.5rem 1rem',
                                borderRadius: '4px',
                                border: 'none',
                                backgroundColor: '#333',
                                color: 'white',
                                cursor: 'pointer'
                            }}>Fechar</button>
                        </InfoModal>
                    </Modal>
                )}
            </Container>
        </>
    );
}

export default ListAlunos;