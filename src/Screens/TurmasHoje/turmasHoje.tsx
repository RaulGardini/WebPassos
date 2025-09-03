import { useState, useEffect } from "react";
import Header from "../../Header/header";
import { FiClock, FiUser, FiUsers, FiHome, FiCalendar } from "react-icons/fi";
import { MdPeopleAlt } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { getAulasHoje } from "../../services/turmasHojeService";
import { getSalas } from "../../services/salaService";
import { getModalidades } from "../../services/modalidadeService";
import { getColaboradores } from "../../services/colaboradorService";
import type { Sala } from '../../Models/sala';
import type { Modalidade } from '../../Models/modalidade';
import type { Colaborador } from '../../Models/colaborador';
import {
    Container,
    Title,
    DisplayFlex,
    TopLine,
    InfoHeader,
    InfoRow,
    InfoItem,
    AulasGrid,
    AulaCard,
    AulaHeader,
    AulaTitulo,
    AulaHorario,
    AulaInfo,
    AulaInfoItem,
    ActionButton,
    LoadingState,
    ErrorState,
    EmptyState,
} from "./style";

interface AulaHoje {
    turma_id: number;
    nome_turma: string;
    sala_id: number;
    modalidade_id: number;
    professor1_id?: number;
    professor2_id?: number;
    capacidade: number;
    horarios: Array<{
        horario_id: number;
        dia_semana: string;
        horario: string;
    }>;
}

interface AulasHojeResponse {
    data: string;
    total_aulas: number;
    aulas: AulaHoje[];
}

function TurmasHoje() {
    const [aulasData, setAulasData] = useState<AulasHojeResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [salas, setSalas] = useState<Sala[]>([]);
    const [modalidades, setModalidades] = useState<Modalidade[]>([]);
    const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
    const navigate = useNavigate();

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

    // Função para buscar aulas de hoje
    const fetchAulasHoje = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAulasHoje();
            setAulasData(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar aulas');
        } finally {
            setLoading(false);
        }
    };

    // Carregar aulas ao montar o componente
    useEffect(() => {
        fetchAulasHoje();
    }, []);

    // Funções auxiliares
    const getNomeSala = (sala_id: number) => {
        const sala = salas.find(s => s.sala_id === sala_id);
        return sala?.nome_sala || 'N/A';
    };

    const getNomeModalidade = (modalidade_id: number) => {
        const modalidade = modalidades.find(m => m.modalidade_id === modalidade_id);
        return modalidade?.nome_modalidade || 'N/A';
    };

    const getNomeColaborador = (colaborador_id?: number) => {
        if (!colaborador_id) return 'N/A';
        const colaborador = colaboradores.find(c => c.colaborador_id === colaborador_id);
        return colaborador?.nome || 'N/A';
    };

    const formatHorario = (horarios: AulaHoje['horarios']) => {
        if (!horarios || horarios.length === 0) return 'Sem horário';
        // Pega apenas o primeiro horário para exibir no card
        return horarios[0].horario;
    };

    const getDiaSemanaAtual = () => {
        const dias = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
        return dias[new Date().getDay()];
    };

    return (
        <>
            <Header />
            <Container>
                <DisplayFlex>
                    <Title>Aulas de Hoje</Title>
                    <TopLine />
                </DisplayFlex>

                <InfoHeader>
                    <InfoRow>
                        <InfoItem>
                            <FiCalendar />
                            <span>Data: <strong>{aulasData?.data || new Date().toLocaleDateString('pt-BR')}</strong></span>
                        </InfoItem>
                        <InfoItem>
                            <FiClock />
                            <span>Dia: <strong>{getDiaSemanaAtual()}</strong></span>
                        </InfoItem>
                        <InfoItem>
                            <FiUsers />
                            <span>Total de aulas: <strong>{aulasData?.total_aulas || 0}</strong></span>
                        </InfoItem>
                    </InfoRow>
                </InfoHeader>

                {/* <RefreshButton onClick={fetchAulasHoje} disabled={loading}>
          <FiRefreshCw />
          {loading ? 'Atualizando...' : 'Atualizar'}
        </RefreshButton> */}

                {loading && (
                    <LoadingState>
                        Carregando aulas de hoje...
                    </LoadingState>
                )}

                {error && (
                    <ErrorState>
                        {error}
                    </ErrorState>
                )}

                {!loading && !error && aulasData?.total_aulas === 0 && (
                    <EmptyState>
                        <h3>Nenhuma aula programada para hoje</h3>
                        <p>Não há aulas agendadas para hoje. Aproveite para descansar!</p>
                    </EmptyState>
                )}

                {!loading && !error && aulasData && aulasData.total_aulas > 0 && (
                    <AulasGrid>
                        {aulasData.aulas.map((aula) => (
                            <AulaCard key={aula.turma_id}>
                                <AulaHeader>
                                    <AulaTitulo>{aula.nome_turma}</AulaTitulo>
                                    <DisplayFlex style={{flexDirection: 'column'}}>
                                        <AulaHorario>
                                            <FiClock />
                                            {formatHorario(aula.horarios)}
                                        </AulaHorario>

                                        {aula.horarios && aula.horarios.length > 1 && (
                                            <AulaHorario style={{marginTop: '0.1rem'}}>
                                                <FiClock />
                                                {aula.horarios.slice(1).map(h => h.horario).join(', ')}
                                            </AulaHorario>
                                        )}
                                    </DisplayFlex>

                                </AulaHeader>

                                <AulaInfo>
                                    <AulaInfoItem>
                                        <FiHome />
                                        <span>{getNomeSala(aula.sala_id)}</span>
                                    </AulaInfoItem>
                                    <AulaInfoItem>
                                        <FiUsers />
                                        <span>{getNomeModalidade(aula.modalidade_id)}</span>
                                    </AulaInfoItem>
                                    <AulaInfoItem>
                                        <FiUser />
                                        <span>{getNomeColaborador(aula.professor1_id)}</span>
                                    </AulaInfoItem>
                                    <AulaInfoItem>
                                        <MdPeopleAlt />
                                        <span>{aula.capacidade} vagas</span>
                                    </AulaInfoItem>
                                </AulaInfo>
                                <ActionButton
                                    onClick={() => navigate(`/turmas/${aula.turma_id}/matriculas`)}
                                >
                                    <MdPeopleAlt />
                                    Ver Alunos
                                </ActionButton>
                            </AulaCard>
                        ))}
                    </AulasGrid>
                )}
            </Container>
        </>
    );
}

export default TurmasHoje;