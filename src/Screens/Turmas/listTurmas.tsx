import { useState, useEffect } from "react";
import Header from "../../Header/header";
import type { Turma, TurmaFilters } from "../../Models/turma";
import { IoAdd } from "react-icons/io5";
import { FiSearch, FiX, FiUser, FiUsers, FiHome } from "react-icons/fi";
import { MdPeopleAlt } from "react-icons/md";
import { MdEditSquare, MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { getTurmas, deleteTurma } from "../../services/turmaService";
import { getSalas } from "../../services/salaService";
import { getModalidades } from "../../services/modalidadeService";
import { getColaboradores } from "../../services/colaboradorService";
import type { Sala } from '../../Models/sala';
import type { Modalidade } from '../../Models/modalidade';
import type { Colaborador } from '../../Models/colaborador';
import type { Matricula, TurmaInfo, MatriculaFilters } from "../../Models/matricula";
import { getTurmaInfo } from "../../services/matriculaService";

import {
    Container,
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
    InfoModal
} from "./style";
import { AddButton } from '../../ui/AddButton/style';

function ListTurmas() {
    const [turmas, setTurmas] = useState<Turma[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [turmaInfo, setTurmaInfo] = useState<TurmaInfo | null>(null);
    const [salas, setSalas] = useState<Sala[]>([]);
    const [modalidades, setModalidades] = useState<Modalidade[]>([]);
    const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);

    const [filters, setFilters] = useState<TurmaFilters>({
        nome: '',
        status: '',
        professor1_id: '',
        modalidade_id: '',
        sala_id: ''
    });
    
    const [selectedTurma, setSelectedTurma] = useState<Turma | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Carregar dados auxiliares
    useEffect(() => {
        const loadAuxiliaryData = async () => {
            try {
                const [salasData, modalidadesData, colaboradoresData] = await Promise.all([
                    getSalas(),
                    getModalidades(),
                    getColaboradores()
                ]);
                setSalas(salasData);
                setModalidades(modalidadesData);
                setColaboradores(colaboradoresData);
            } catch (error) {
                console.error('Erro ao carregar dados auxiliares:', error);
            }
        };
        
        loadAuxiliaryData();
    }, []);

    const openTurmaModal = async (turma: Turma) => {
        setSelectedTurma(turma);
        setIsModalOpen(true);
        const info = await getTurmaInfo(turma.turma_id);
        setTurmaInfo(info);
    };

    const closeTurmaModal = () => {
        setSelectedTurma(null);
        setIsModalOpen(false);
    };

    // Função para buscar turmas usando o service
    const fetchTurmas = async (searchFilters?: TurmaFilters) => {
        try {
            setLoading(true);
            const data = await getTurmas(searchFilters);
            setTurmas(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
        } finally {
            setLoading(false);
        }
    };

    // Carregar turmas ao montar o componente
    useEffect(() => {
        fetchTurmas();
    }, []);

    // Função para lidar com mudanças nos filtros
    const handleFilterChange = (field: keyof TurmaFilters, value: string) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Função para aplicar filtros
    const applyFilters = () => {
        fetchTurmas(filters);
    };

    // Função para limpar filtros
    const clearFilters = () => {
        const emptyFilters: TurmaFilters = {
            nome: '',
            status: '',
            modalidade_id: '',
            sala_id: ''
        };
        setFilters(emptyFilters);
        fetchTurmas(); // Busca todas as turmas novamente
    };

    // Função para formatar status
    const formatStatus = (status: string) => {
        return status === 'ativa' ? 'Ativa' : 'Inativa';
    };

    // Função para formatar mensalidade
    const formatMensalidade = (valor: string) => {
        return `R$ ${parseFloat(valor).toFixed(2).replace('.', ',')}`;
    };

    // Função para formatar horários
    const formatHorarios = (horarios: any[]) => {
        if (!horarios || horarios.length === 0) return 'Sem horários';
        
        return horarios.map(h => `${h.dia_semana}: ${h.horario}`).join(' | ');
    };

    // Função para obter nome da sala
    const getNomeSala = (sala_id: number) => {
        const sala = salas.find(s => s.sala_id === sala_id);
        return sala?.nome_sala || 'N/A';
    };

    // Função para obter nome da modalidade
    const getNomeModalidade = (modalidade_id: number) => {
        const modalidade = modalidades.find(m => m.modalidade_id === modalidade_id);
        return modalidade?.nome_modalidade || 'N/A';
    };

    // Função para obter nome do professor
    const getNomeColaborador = (colaborador_id: number) => {
        const colaborador = colaboradores.find(c => c.colaborador_id === colaborador_id);
        return colaborador?.nome || 'N/A';
    };

    const handleDelete = async (turma_id: number) => {
        if (!window.confirm("Tem certeza que deseja deletar esta turma?")) return;

        try {
            await deleteTurma(turma_id);
            alert("Turma deletada com sucesso!");
            setTurmas((prev) => prev.filter((turma) => turma.turma_id !== turma_id));
        } catch (error) {
            console.error('Erro ao deletar turma:', error);
            alert("Erro ao deletar turma");
        }
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
                    <Title>Turmas</Title>
                    <TopLine></TopLine>
                </DisplayFlex>
                <AddButton onClick={() => navigate("/addTurmas")}><IoAdd />Novo</AddButton>
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
                                placeholder="Digite o nome da turma..."
                                value={filters.nome}
                                onChange={(e) => handleFilterChange('nome', e.target.value)}
                            />
                        </FilterGroup>

                        <FilterGroup>
                            <FilterLabel>
                                <FiUsers />
                                Professor
                            </FilterLabel>
                            <FilterInput
                                as="select"
                                value={filters.professor1_id}
                                onChange={(e) => handleFilterChange('professor1_id', e.target.value)}
                            >
                                <option value="">Todos os professores</option>
                                {colaboradores.map((colaborador) => (
                                    <option key={colaborador.colaborador_id} value={colaborador.colaborador_id.toString()}>
                                        {colaborador.nome}
                                    </option>
                                ))}
                            </FilterInput>
                        </FilterGroup>

                        <FilterGroup>
                            <FilterLabel>
                                <FiUsers />
                                Status
                            </FilterLabel>
                            <FilterInput
                                as="select"
                                value={filters.status}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                            >
                                <option value="">Todos</option>
                                <option value="ativa">Ativa</option>
                                <option value="inativa">Inativa</option>
                            </FilterInput>
                        </FilterGroup>

                        <FilterGroup>
                            <FilterLabel>
                                <FiHome />
                                Sala
                            </FilterLabel>
                            <FilterInput
                                as="select"
                                value={filters.sala_id}
                                onChange={(e) => handleFilterChange('sala_id', e.target.value)}
                            >
                                <option value="">Todas as salas</option>
                                {salas.map((sala) => (
                                    <option key={sala.sala_id} value={sala.sala_id.toString()}>
                                        {sala.nome_sala}
                                    </option>
                                ))}
                            </FilterInput>
                        </FilterGroup>

                        <FilterGroup>
                            <FilterLabel>
                                <FiUsers />
                                Modalidade
                            </FilterLabel>
                            <FilterInput
                                as="select"
                                value={filters.modalidade_id}
                                onChange={(e) => handleFilterChange('modalidade_id', e.target.value)}
                            >
                                <option value="">Todas as modalidades</option>
                                {modalidades.map((modalidade) => (
                                    <option key={modalidade.modalidade_id} value={modalidade.modalidade_id.toString()}>
                                        {modalidade.nome_modalidade}
                                    </option>
                                ))}
                            </FilterInput>
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

                {/* Tabela de Turmas */}
                <TableContainer>
                    {loading && (
                        <LoadingState>
                            Carregando turmas...
                        </LoadingState>
                    )}

                    {error && (
                        <ErrorState>
                            {error}
                        </ErrorState>
                    )}

                    {!loading && !error && turmas.length === 0 && (
                        <EmptyState>
                            Nenhuma turma encontrada
                        </EmptyState>
                    )}

                    {!loading && !error && turmas.length > 0 && (
                        <Table>
                            <TableHeader>
                                <tr>
                                    <TableHeaderCell>ID</TableHeaderCell>
                                    <TableHeaderCell>Nome</TableHeaderCell>
                                    <TableHeaderCell>Sala</TableHeaderCell>
                                    <TableHeaderCell>Modalidade</TableHeaderCell>
                                    <TableHeaderCell>Professor 1</TableHeaderCell>
                                    <TableHeaderCell>Professor 2</TableHeaderCell>
                                    <TableHeaderCell>Status</TableHeaderCell>
                                    <TableHeaderCell>Horários</TableHeaderCell>
                                    <TableHeaderCell className="center">Ações</TableHeaderCell>
                                </tr>
                            </TableHeader>
                            <TableBody>
                                {turmas.map((turma, index) => (
                                    <TableRow key={turma.turma_id} index={index}>
                                        <TableCell>{turma.turma_id}</TableCell>
                                        <TableCell fontWeight="500">{turma.nome}</TableCell>
                                        <TableCell>{getNomeSala(turma.sala_id)}</TableCell>
                                        <TableCell>{getNomeModalidade(turma.modalidade_id)}</TableCell>
                                        <TableCell>{getNomeColaborador(turma.professor1_id)}</TableCell>
                                        <TableCell>{turma.professor2_id ? getNomeColaborador(turma.professor2_id) : 'N/A'}</TableCell>
                                        <TableCell>
                                            <span style={{
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '4px',
                                                fontSize: '0.875rem',
                                                fontWeight: '500',
                                                backgroundColor: turma.status === 'ativa' ? '#d4edda' : '#f8d7da',
                                                color: turma.status === 'ativa' ? '#155724' : '#721c24'
                                            }}>
                                                {formatStatus(turma.status)}
                                            </span>
                                        </TableCell>
                                        <TableCell style={{ maxWidth: '200px', fontSize: '0.875rem' }}>
                                            {formatHorarios(turma.horarios)}
                                        </TableCell>
                                        <TableCell textAlign="center">
                                            <ActionButtons>
                                                <EditButton
                                                    onClick={() => navigate(`/turmas/${turma.turma_id}/matriculas`)}
                                                >
                                                    <MdPeopleAlt />
                                                </EditButton>
                                                <EditButton
                                                    onClick={() => navigate(`/updateTurmas/${turma.turma_id}`)}
                                                >
                                                    <MdEditSquare />
                                                </EditButton>
                                                <EditButton
                                                    onClick={() => openTurmaModal(turma)}
                                                >
                                                    <FaEye />
                                                </EditButton>
                                                <EditButton
                                                    onClick={() => handleDelete(turma.turma_id)}
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

                {/* Modal de Detalhes */}
                {isModalOpen && selectedTurma &&  (
                    <Modal>
                        <InfoModal>
                            <h2>Detalhes da Turma</h2>
                            <p><strong>ID:</strong> {selectedTurma.turma_id}</p>
                            <p><strong>Nome:</strong> {selectedTurma.nome}</p>
                            <p><strong>Sala:</strong> {getNomeSala(selectedTurma.sala_id)}</p>
                            <p><strong>Modalidade:</strong> {getNomeModalidade(selectedTurma.modalidade_id)}</p>
                            <p><strong>Professor 1:</strong> {getNomeColaborador(selectedTurma.professor1_id)}</p>
                            <p><strong>Professor 2:</strong> {selectedTurma.professor2_id ? getNomeColaborador(selectedTurma.professor2_id) : 'Não informado'}</p>
                            <p><strong>Status:</strong> {formatStatus(selectedTurma.status)}</p>
                            <p><strong>Mensalidade:</strong> {formatMensalidade(selectedTurma.mensalidade)}</p>
                            <p><strong>Capacidade:</strong> {selectedTurma.capacidade}</p>
                            <p><strong>Vagas disponíveis:</strong> {turmaInfo?.vagas_disponiveis}</p>
                            <p><strong>Alunas:</strong> {turmaInfo?.matriculas_ativas}</p>
                            <p><strong>Data de Criação:</strong> {formatDataCriacao(selectedTurma.data_criacao)}</p>
                            
                            <div style={{ marginTop: '1rem' }}>
                                <strong>Horários:</strong>
                                {selectedTurma.horarios && selectedTurma.horarios.length > 0 ? (
                                    <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                                        {selectedTurma.horarios.map((horario) => (
                                            <li key={horario.horario_id}>
                                                {horario.dia_semana}: {horario.horario}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p style={{ marginTop: '0.5rem', fontStyle: 'italic' }}>Nenhum horário cadastrado</p>
                                )}
                            </div>

                            <button onClick={closeTurmaModal} style={{
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

export default ListTurmas;