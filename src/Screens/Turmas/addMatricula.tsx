import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../Header/header";
import { FiSearch, FiX, FiUser, FiArrowLeft } from "react-icons/fi";
import { MdPersonRemove } from "react-icons/md";
import {
    getAlunosDisponiveis,
    getAlunosMatriculados,
    matricularAluno,
    deletarMatricula,
    getTurmaInfo,
} from "../../services/matriculaService";
import type { Aluno } from "../../Models/aluno";
import type { Matricula, TurmaInfo, MatriculaFilters } from "../../Models/matricula";
import {
    Title,
    DisplayFlex,
    TopLine,
    FilterGroup,
    FilterLabel,
    FilterInput,
    FilterActions,
    FilterButton,
    ClearButton,
    LoadingState,
    ErrorState,
    EmptyState,
    BackButton,
    TurmaInfoCard,
    TurmaInfoGrid,
    TurmaInfoItem,
    ListsContainer,
    ListSection,
    ListHeader,
    ListBody,
    AlunoItem,
    AlunoInfo,
    ActionButton,
    SearchContainer,
    TableHeader,
    TableHeaderCell
} from "../Turmas/style";
import { Container } from '../../ui/Container/style';

function ManageMatriculas() {
    const { turmaId } = useParams<{ turmaId: string }>();
    const navigate = useNavigate();

    const [turmaInfo, setTurmaInfo] = useState<TurmaInfo | null>(null);
    const [alunosDisponiveis, setAlunosDisponiveis] = useState<Aluno[]>([]);
    const [alunosMatriculados, setAlunosMatriculados] = useState<Matricula[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [filtrosDisponiveis, setFiltrosDisponiveis] = useState<MatriculaFilters>({ nome: '' });
    const [filtrosMatriculados, setFiltrosMatriculados] = useState<MatriculaFilters>({ nome: '' });

    const [loadingAction, setLoadingAction] = useState<number | null>(null);

    // Carregar dados iniciais
    useEffect(() => {
        if (turmaId) {
            loadData();
        }
    }, [turmaId]);

    const loadData = async () => {
        if (!turmaId) return;

        try {
            setLoading(true);
            setError(null);

            const [info, disponiveis, matriculados] = await Promise.all([
                getTurmaInfo(parseInt(turmaId)),
                getAlunosDisponiveis(parseInt(turmaId)),
                getAlunosMatriculados(parseInt(turmaId))
            ]);

            setTurmaInfo(info);
            setAlunosDisponiveis(disponiveis);
            setAlunosMatriculados(matriculados);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
        } finally {
            setLoading(false);
        }
    };

    const searchAlunosDisponiveis = async () => {
        if (!turmaId) return;

        try {
            const alunos = await getAlunosDisponiveis(parseInt(turmaId), filtrosDisponiveis);
            setAlunosDisponiveis(alunos);
        } catch (err) {
            console.error('Erro ao buscar alunos disponíveis:', err);
        }
    };

    const searchAlunosMatriculados = async () => {
        if (!turmaId) return;

        try {
            const matriculas = await getAlunosMatriculados(parseInt(turmaId), filtrosMatriculados);
            setAlunosMatriculados(matriculas);
        } catch (err) {
            console.error('Erro ao buscar alunos matriculados:', err);
        }
    };

    const handleMatricular = async (aluno_id: number) => {
        if (!turmaId) return;

        try {
            setLoadingAction(aluno_id);
            await matricularAluno(parseInt(turmaId), aluno_id);

            // Recarregar dados
            await loadData();
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erro ao matricular aluno';
            alert(message);
        } finally {
            setLoadingAction(null);
        }
    };

    const handleDeletarMatricula = async (matricula_id: number) => {
        try {
            setLoadingAction(matricula_id);
            await deletarMatricula(matricula_id);

            // Recarregar dados
            await loadData();
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erro ao deletar matrícula';
            alert(message);
        } finally {
            setLoadingAction(null);
        }
    };

    const clearFiltrosDisponiveis = () => {
        setFiltrosDisponiveis({ nome: '' });
        if (turmaId) {
            getAlunosDisponiveis(parseInt(turmaId)).then(setAlunosDisponiveis);
        }
    };

    const clearFiltrosMatriculados = () => {
        setFiltrosMatriculados({ nome: '' });
        if (turmaId) {
            getAlunosMatriculados(parseInt(turmaId)).then(setAlunosMatriculados);
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

    if (loading) {
        return (
            <>
                <Header />
                <Container>
                    <LoadingState>Carregando dados da turma...</LoadingState>
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
                    <Title>Gerenciar Matrículas</Title>
                    <TopLine style={{ width: '71%' }} />
                </DisplayFlex>
                <BackButton style={{ margin: '0' }} onClick={() => navigate('/listTurmas')}>
                    <FiArrowLeft />
                    Voltar para Turmas
                </BackButton>

                {/* Informações da Turma */}
                {turmaInfo && (
                    <TurmaInfoCard>
                        <TurmaInfoGrid>
                            <TurmaInfoItem>
                                <strong>Turma:</strong>
                                <span>{turmaInfo.nome}</span>
                            </TurmaInfoItem>
                            <TurmaInfoItem>
                                <strong>Capacidade:</strong>
                                <span>{turmaInfo.capacidade} alunos</span>
                            </TurmaInfoItem>
                            <TurmaInfoItem>
                                <strong>Matriculados:</strong>
                                <span>{turmaInfo.matriculas_ativas} alunos</span>
                            </TurmaInfoItem>
                            <TurmaInfoItem>
                                <strong>Vagas Disponíveis:</strong>
                                <span style={{ color: turmaInfo.vagas_disponiveis === 0 ? '#dc3545' : '#28a745' }}>
                                    {turmaInfo.vagas_disponiveis} vagas
                                </span>
                            </TurmaInfoItem>
                            <TurmaInfoItem>
                                <strong>Mensalidade:</strong>
                                <span>R$ {parseFloat(turmaInfo.mensalidade).toFixed(2).replace('.', ',')}</span>
                            </TurmaInfoItem>
                        </TurmaInfoGrid>
                    </TurmaInfoCard>
                )}

                {/* Listas de Alunos */}
                <ListsContainer>
                    {/* Alunos Disponíveis */}
                    <ListSection>
                        <ListHeader>
                            <h3>Alunos Disponíveis para Matrícula</h3>
                        </ListHeader>

                        <SearchContainer>
                            <FilterGroup>
                                <FilterLabel>
                                    <FiUser />
                                    Buscar por nome
                                </FilterLabel>
                                <FilterInput
                                    style={{ width: '35rem' }}
                                    type="text"
                                    placeholder="Digite o nome do aluno..."
                                    value={filtrosDisponiveis.nome}
                                    onChange={(e) => setFiltrosDisponiveis({ nome: e.target.value })}
                                />
                            </FilterGroup>
                            <FilterActions style={{ marginTop: '0.75rem', marginLeft: '1rem' }}>
                                <FilterButton onClick={searchAlunosDisponiveis}>
                                    <FiSearch />
                                    Buscar
                                </FilterButton>
                                <ClearButton onClick={clearFiltrosDisponiveis}>
                                    <FiX />
                                    Limpar
                                </ClearButton>
                            </FilterActions>
                        </SearchContainer>
                        <TableHeader>
                            <tr>
                                <TableHeaderCell>ID</TableHeaderCell>
                                <TableHeaderCell style={{ width: '60%' }}>Nome</TableHeaderCell>
                                <TableHeaderCell style={{ width: '27%' }}>Idade</TableHeaderCell>
                                <TableHeaderCell style={{ width: '13%' }}>Ações</TableHeaderCell>
                            </tr>
                        </TableHeader>
                        <ListBody>
                            {alunosDisponiveis.length === 0 ? (
                                <EmptyState style={{ padding: '2rem', textAlign: 'center' }}>
                                    Nenhum aluno disponível
                                </EmptyState>
                            ) : (
                                alunosDisponiveis.map((aluno) => (
                                    <AlunoItem key={aluno.aluno_id}>
                                        <AlunoInfo>
                                            <h4 style={{ marginRight: '2rem' }}>{aluno.aluno_id}</h4>
                                            <h4 style={{ width: '51vh' }}>{aluno.nome}</h4>
                                            {calcularIdade(aluno.data_nascimento || '')}
                                        </AlunoInfo>
                                        <ActionButton
                                            variant="add"
                                            onClick={() => handleMatricular(aluno.aluno_id)}
                                            disabled={loadingAction === aluno.aluno_id || turmaInfo?.vagas_disponiveis === 0}
                                        >
                                            {loadingAction === aluno.aluno_id ? 'Matriculando...' : 'Matricular'}
                                        </ActionButton>
                                    </AlunoItem>
                                ))
                            )}
                        </ListBody>
                    </ListSection>

                    {/* Alunos Matriculados */}
                    <ListSection>
                        <ListHeader>
                            <h3>Alunos Matriculados</h3>
                        </ListHeader>

                        <SearchContainer>
                            <FilterGroup>
                                <FilterLabel>
                                    <FiUser />
                                    Buscar por nome
                                </FilterLabel>
                                <FilterInput
                                    style={{ width: '35rem' }}
                                    type="text"
                                    placeholder="Digite o nome do aluno..."
                                    value={filtrosMatriculados.nome}
                                    onChange={(e) => setFiltrosMatriculados({ nome: e.target.value })}
                                />
                            </FilterGroup>
                            <FilterActions style={{ marginTop: '0.75rem', marginLeft: '1rem' }}>
                                <FilterButton onClick={searchAlunosMatriculados}>
                                    <FiSearch />
                                    Buscar
                                </FilterButton>
                                <ClearButton onClick={clearFiltrosMatriculados}>
                                    <FiX />
                                    Limpar
                                </ClearButton>
                            </FilterActions>
                        </SearchContainer>
                        <TableHeader>
                            <tr>
                                <TableHeaderCell>ID</TableHeaderCell>
                                <TableHeaderCell style={{ width: '30%' }}>Nome</TableHeaderCell>
                                <TableHeaderCell style={{ width: '30%' }}>Matricula</TableHeaderCell>
                                <TableHeaderCell style={{ width: '30%' }}>Data matricula</TableHeaderCell>
                                <TableHeaderCell style={{ width: '30%' }}>idade</TableHeaderCell>
                                <TableHeaderCell style={{ width: '30%' }}>Ações</TableHeaderCell>
                            </tr>
                        </TableHeader>
                        <ListBody>
                            {alunosMatriculados.length === 0 ? (
                                <EmptyState style={{ padding: '2rem', textAlign: 'center' }}>
                                    Nenhum aluno matriculado
                                </EmptyState>
                            ) : (
                                alunosMatriculados.map((matricula) => (
                                    <AlunoItem key={matricula.matricula_id}>
                                        <AlunoInfo>
                                            <h4 style={{ marginRight: '2rem' }}>{matricula.aluno.aluno_id}</h4>
                                            <h4 style={{ width: '25vh' }}>{matricula.aluno.nome}</h4>
                                            <p style={{ width: '25vh' }}>{matricula.numero_matricula}</p>
                                            <p style={{ width: '21vh' }}>{new Date(matricula.data_matricula).toLocaleDateString('pt-BR')}</p>
                                            {calcularIdade(matricula.aluno.data_nascimento || '')}
                                        </AlunoInfo>
                                        <ActionButton
                                            variant="remove"
                                            onClick={() => handleDeletarMatricula(matricula.matricula_id)}
                                            disabled={loadingAction === matricula.matricula_id}
                                        >
                                            <MdPersonRemove />
                                            {loadingAction === matricula.matricula_id ? 'Deletando...' : ''}
                                        </ActionButton>
                                    </AlunoItem>
                                ))
                            )}
                        </ListBody>
                    </ListSection>
                </ListsContainer>
            </Container>
        </>
    );
}

export default ManageMatriculas;