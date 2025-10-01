import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../../Header/header";
import { FiUsers, FiMapPin, FiDollarSign, FiCalendar, FiUser, FiArrowLeft } from "react-icons/fi";
import { IoAdd } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { 
  getTurmasDoAluno, 
  getTurmasDisponiveis, 
  matricularAlunoNaTurma,
  deletarMatricula 
} from "../../../services/matriculaService";
import { getAlunoById } from "../../../services/alunoService";
import type { Aluno, Turma, Matricula } from "../../../Models/aluno";
import {
    Title,
    DisplayFlex,
    TopLine,
    MidLine,
    ErrorState,
    EmptyState,
    BackButton,
    TabContainer,
    Tab,
    AlunoInfo,
    TurmasGrid,
    TurmaCard,
    TurmaHeader,
    TurmaInfo,
    ActionButton,
    StatusBadge,
    MatriculaInfo
} from "../style";
import { LoadingState } from "../../../ui/Loading/style";
import { Container } from '../../../ui/Container/style';

type TabType = 'disponiveis' | 'matriculadas';

function TurmasAluno() {
    const { id: aluno_id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<TabType>('matriculadas');
    const [aluno, setAluno] = useState<Aluno | null>(null);
    const [turmasDisponiveis, setTurmasDisponiveis] = useState<Turma[]>([]);
    const [turmasMatriculadas, setTurmasMatriculadas] = useState<Matricula[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<number | null>(null);

    const fetchData = async () => {
        if (!aluno_id) return;
        
        try {
            setLoading(true);
            const [alunoData, disponiveis, matriculadas] = await Promise.all([
                getAlunoById(parseInt(aluno_id)),
                getTurmasDisponiveis(parseInt(aluno_id)),
                getTurmasDoAluno(parseInt(aluno_id))
            ]);
            
            setAluno(alunoData);
            setTurmasDisponiveis(disponiveis);
            setTurmasMatriculadas(matriculadas);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [aluno_id]);

    const handleMatricular = async (turma_id: number) => {
        if (!aluno_id) return;
        
        try {
            setActionLoading(turma_id);
            await matricularAlunoNaTurma(parseInt(aluno_id), turma_id);
            alert('Aluno matriculado com sucesso!');
            await fetchData();
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Erro ao matricular aluno');
        } finally {
            setActionLoading(null);
        }
    };

    const handleDeleteMatricula = async (matricula_id: number) => {
        if (!window.confirm('Tem certeza que deseja cancelar esta matrícula?')) return;
        
        try {
            setActionLoading(matricula_id);
            await deletarMatricula(matricula_id);
            alert('Matrícula cancelada com sucesso!');
            await fetchData();
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Erro ao cancelar matrícula');
        } finally {
            setActionLoading(null);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    if (loading) {
        return (
            <>
                <Header />
                <Container>
                    <LoadingState>Carregando dados...</LoadingState>
                </Container>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Header />
                <Container>
                    <ErrorState>{error}</ErrorState>
                </Container>
            </>
        );
    }

    return (
        <>
            <Header />
            <Container>

                <DisplayFlex>
                    <Title>Turmas do Aluno</Title>
                    <TopLine></TopLine>
                </DisplayFlex>
                <BackButton onClick={() => navigate('/listAlunos')}>
                    <FiArrowLeft />
                    Voltar para Lista de Alunos
                </BackButton>
                <MidLine></MidLine>

                {aluno && (
                    <AlunoInfo>
                        <h3>
                            <FiUser />
                            {aluno.nome}
                        </h3>
                    </AlunoInfo>
                )}

                <TabContainer>
                    <Tab 
                        active={activeTab === 'matriculadas'}
                        onClick={() => setActiveTab('matriculadas')}
                        style={{ borderRadius: '10px 0 0 10px' }}
                    >
                        Turmas Matriculadas ({turmasMatriculadas.length})
                    </Tab>
                    <Tab 
                        active={activeTab === 'disponiveis'}
                        onClick={() => setActiveTab('disponiveis')}
                        style={{ borderRadius: '0 10px 10px 0' }}
                    >
                        Turmas Disponíveis ({turmasDisponiveis.length})
                    </Tab>
                </TabContainer>

                {activeTab === 'matriculadas' && (
                    <>
                        {turmasMatriculadas.length === 0 ? (
                            <EmptyState>
                                Aluno não está matriculado em nenhuma turma
                            </EmptyState>
                        ) : (
                            <TurmasGrid>
                                {turmasMatriculadas.map((matricula) => (
                                    <TurmaCard key={matricula.matricula_id}>
                                        <TurmaHeader>
                                            <h4>{matricula.turma?.nome || 'Nome não disponível'}</h4>
                                        </TurmaHeader>

                                        <MatriculaInfo>
                                            <p><strong>Matrícula:</strong> {matricula.numero_matricula}</p>
                                            <p><strong>Valor:</strong> {formatCurrency(matricula.valor_matricula)}</p>
                                            <p><strong>Status:</strong> {matricula.status}</p>
                                        </MatriculaInfo>
                                        
                                        <TurmaInfo>
                                            <span>
                                                <FiMapPin />
                                                {matricula.turma?.modalidade?.nome || 'N/A'} - {matricula.turma?.sala?.nome || 'N/A'}
                                            </span>
                                            <span>
                                                <FiCalendar />
                                                Início: {matricula.turma?.data_inicio ? formatDate(matricula.turma.data_inicio) : 'N/A'}
                                            </span>
                                        </TurmaInfo>

                                        <ActionButton
                                            variant="danger"
                                            onClick={() => handleDeleteMatricula(matricula.matricula_id)}
                                            disabled={actionLoading === matricula.matricula_id}
                                        >
                                            <MdDelete />
                                            {actionLoading === matricula.matricula_id 
                                                ? 'Cancelando...' 
                                                : 'Cancelar Matrícula'
                                            }
                                        </ActionButton>
                                    </TurmaCard>
                                ))}
                            </TurmasGrid>
                        )}
                    </>
                )}

                {activeTab === 'disponiveis' && (
                    <>
                        {turmasDisponiveis.length === 0 ? (
                            <EmptyState>
                                Não há turmas disponíveis para matrícula
                            </EmptyState>
                        ) : (
                            <TurmasGrid>
                                {turmasDisponiveis.map((turma) => (
                                    <TurmaCard key={turma.turma_id}>
                                        <TurmaHeader>
                                            <h4>{turma.nome}</h4>
                                            <StatusBadge lotada={turma.turma_lotada}>
                                                {turma.turma_lotada ? 'Lotada' : 'Disponível'}
                                            </StatusBadge>
                                        </TurmaHeader>
                                        
                                        <TurmaInfo>
                                            <span>
                                                <FiUsers />
                                                {turma.matriculas_ativas}/{turma.capacidade} alunos
                                            </span>
                                            <span>
                                                <FiMapPin />
                                                {turma.modalidade?.nome || 'N/A'} - {turma.sala?.nome || 'N/A'}
                                            </span>
                                            <span>
                                                <FiDollarSign />
                                                {formatCurrency(turma.mensalidade)}
                                            </span>
                                            <span>
                                                <FiCalendar />
                                                Início: {formatDate(turma.data_inicio)}
                                            </span>
                                        </TurmaInfo>

                                        <ActionButton
                                            onClick={() => handleMatricular(turma.turma_id)}
                                            disabled={turma.turma_lotada || actionLoading === turma.turma_id}
                                        >
                                            <IoAdd />
                                            {actionLoading === turma.turma_id 
                                                ? 'Matriculando...' 
                                                : turma.turma_lotada 
                                                    ? 'Turma Lotada' 
                                                    : 'Matricular'
                                            }
                                        </ActionButton>
                                    </TurmaCard>
                                ))}
                            </TurmasGrid>
                        )}
                    </>
                )}
            </Container>
        </>
    );
}

export default TurmasAluno;