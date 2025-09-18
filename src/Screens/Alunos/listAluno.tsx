import { useState, useEffect } from "react";
import Header from "../../Header/header";
import type { Aluno, AlunoFilters } from "../../Models/aluno";
import { IoAdd } from "react-icons/io5";
import { FiSearch, FiX, FiUser, FiMail, FiPhone, FiMapPin, FiUsers, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { MdEditSquare, MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { FaEye, FaGraduationCap } from "react-icons/fa";
import { getAlunos, deleteAluno, type PaginatedResponse, type PaginationParams } from "../../services/alunoService";
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
    ClearButton,
    EditButton,
    Modal,
    InfoModal,
    PaginationContainer,
    PaginationControls,
    PaginationButton
} from "./style";
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

function ListAlunos() {
    const [alunos, setAlunos] = useState<Aluno[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [filters, setFilters] = useState<AlunoFilters>({
        nome: '',
        email: '',
        telefone: '',
        cidade: '',
        responsavel_financeiro: ''
    });
    const [selectedAluno, setSelectedAluno] = useState<Aluno | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Estados para paginação
    const [pagination, setPagination] = useState<PaginationState>({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 25,
        hasNext: false,
        hasPrev: false
    });
    const [itemsPerPage] = useState(35);

    const openAlunoModal = (aluno: Aluno) => {
        setSelectedAluno(aluno);
        setIsModalOpen(true);
    };

    const closeAlunoModal = () => {
        setSelectedAluno(null);
        setIsModalOpen(false);
    };

    // Função para verificar se há filtros ativos
    const hasActiveFilters = (searchFilters: AlunoFilters): boolean => {
        return Object.values(searchFilters).some(value => value && value.trim() !== '');
    };

    // Função para limpar filtros vazios
    const cleanFilters = (searchFilters: AlunoFilters): AlunoFilters | undefined => {
        const cleaned: AlunoFilters = {};
        let hasFilters = false;
        
        Object.entries(searchFilters).forEach(([key, value]) => {
            if (value && value.trim() !== '') {
                cleaned[key as keyof AlunoFilters] = value.trim();
                hasFilters = true;
            }
        });
        
        return hasFilters ? cleaned : undefined;
    };

    // Função para buscar alunos usando o service
    const fetchAlunos = async (searchFilters?: AlunoFilters, page: number = 1, limit: number = itemsPerPage) => {
        try {
            setLoading(true);
            setError(null);
            
            const cleanedFilters = searchFilters ? cleanFilters(searchFilters) : undefined;
            const paginationParams: PaginationParams = { page, limit };
            
            console.log('Buscando alunos com:', { filters: cleanedFilters, pagination: paginationParams });
            
            const result = await getAlunos(cleanedFilters, paginationParams);
            
            // Verifica se o resultado tem paginação
            if (result && typeof result === 'object' && 'data' in result && 'pagination' in result) {
                const paginatedResult = result as PaginatedResponse<Aluno>;
                console.log('Resultado paginado recebido:', paginatedResult);
                setAlunos(paginatedResult.data);
                setPagination(paginatedResult.pagination);
            } else {
                // Fallback para caso o backend retorne array simples
                console.log('Resultado simples recebido:', result);
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
            console.error('Erro ao buscar alunos:', err);
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
            setAlunos([]);
            setPagination({
                currentPage: 1,
                totalPages: 1,
                totalItems: 0,
                itemsPerPage: limit,
                hasNext: false,
                hasPrev: false
            });
        } finally {
            setLoading(false);
        }
    };

    // Carregar alunos ao montar o componente e quando itemsPerPage mudar
    useEffect(() => {
        console.log('Effect triggered - carregando alunos...');
        fetchAlunos(undefined, 1, itemsPerPage);
    }, [itemsPerPage]);

    // Função para lidar com mudanças nos filtros
    const handleFilterChange = (field: keyof AlunoFilters, value: string) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Função para aplicar filtros (sempre volta para página 1)
    const applyFilters = () => {
        console.log('Aplicando filtros:', filters);
        fetchAlunos(filters, 1, itemsPerPage);
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
        fetchAlunos(undefined, 1, itemsPerPage);
    };

    // Funções de paginação
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= pagination.totalPages) {
            console.log('Mudando para página:', page);
            const activeFilters = hasActiveFilters(filters) ? filters : undefined;
            fetchAlunos(activeFilters, page, itemsPerPage);
        }
    };

    // Gera números das páginas para exibir
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        const current = pagination.currentPage;
        const total = pagination.totalPages;
        
        let start = Math.max(1, current - Math.floor(maxVisible / 2));
        let end = Math.min(total, start + maxVisible - 1);
        
        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }
        
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        
        return pages;
    };

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

    // Função para formatar sexo
    const formatSexo = (sexo?: string) => {
        if (!sexo) return '';
        return sexo === 'M' ? 'Masculino' : 'Feminino';
    };

    const handleDelete = async (aluno_id: number) => {
        if (!window.confirm("Tem certeza que deseja deletar este aluno?")) return;

        try {
            await deleteAluno(aluno_id);
            alert("Aluno deletado com sucesso!");
            
            // Recarrega a página atual após deletar
            const activeFilters = hasActiveFilters(filters) ? filters : undefined;
            fetchAlunos(activeFilters, pagination.currentPage, itemsPerPage);
        } catch (error) {
            alert(error instanceof Error ? error.message : "Erro ao deletar aluno");
        }
    };

    const calcularIdade = (dateString: string) => {
        if (!dateString) return '';
        const hoje = new Date();
        const nascimento = new Date(dateString);
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const m = hoje.getMonth() - nascimento.getMonth();
        if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
            idade--;
        }
        return `${idade} anos`;
    };

    const formatDataCriacao = (dataString?: string) => {
        if (!dataString) return '';
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR');
    };

    return (
        <>
            <Header />
            <Container>
                <DisplayFlex>
                    <Title>Alunos</Title>
                    <TopLine></TopLine>
                </DisplayFlex>
                <AddButton onClick={() => navigate("/addAlunos")}><IoAdd />Novo</AddButton>
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
                                <FiMapPin />
                                Cidade
                            </FilterLabel>
                            <FilterInput
                                type="text"
                                placeholder="Digite a cidade..."
                                value={filters.cidade}
                                onChange={(e) => handleFilterChange('cidade', e.target.value)}
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
                                            <TableCell>{formatCpf(aluno.cpf)}</TableCell>
                                            <TableCell>{formatTelefone(aluno.telefone || '')}</TableCell>
                                            <TableCell>{aluno.cidade || '-'}</TableCell>
                                            <TableCell>{calcularIdade(aluno.data_nascimento || '')}</TableCell>
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
                            <p><strong>CPF:</strong> {formatCpf(selectedAluno.cpf)}</p>
                            <p><strong>Telefone:</strong> {formatTelefone(selectedAluno.telefone || '')}</p>
                            <p><strong>Sexo:</strong> {formatSexo(selectedAluno.sexo)}</p>
                            <p><strong>Data de Nascimento:</strong> {selectedAluno.data_nascimento ? new Date(selectedAluno.data_nascimento).toLocaleDateString('pt-BR') : '-'}</p>
                            <p><strong>Idade:</strong> {calcularIdade(selectedAluno.data_nascimento || '')}</p>
                            <p><strong>Cidade:</strong> {selectedAluno.cidade || '-'}</p>
                            <p><strong>Endereço:</strong> {selectedAluno.endereco || '-'}</p>
                            <p><strong>CEP:</strong> {selectedAluno.cep || '-'}</p>
                            <p><strong>Responsável Financeiro:</strong> {selectedAluno.responsavel_financeiro || '-'}</p>
                            <p><strong>Data de Criação:</strong> {formatDataCriacao(selectedAluno.data_criacao)}</p>
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