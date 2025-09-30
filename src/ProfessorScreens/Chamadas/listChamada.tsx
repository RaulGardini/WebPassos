import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiCalendar } from "react-icons/fi";
import { IoArrowBack } from "react-icons/io5";
import { MdBackHand } from "react-icons/md";
import { buscarChamadasPorMes } from '../../services/chamadaService';
import { criarPresencas } from '../../services/presencaService';
import Header from "../Header/header";
import {
    Container,
    Title,
    TopLine,
    MonthsContainer,
    MonthCard,
    MonthTitle,
    TableContainer,
    ErrorState,
    EmptyState,
    ChamadaCard,
    ChamadaInfo,
    ChamadaLabel,
    ChamadaValue,
    ActionButton,
    BackButton
} from "./style";
import { LoadingState } from '../../ui/Loading/style'

interface Chamada {
    chamada_id: number;
    turma_id: number;
    turma_nome: string;
    colaborador_id: number;
    data_aula: string;
}

const MESES = [
    { numero: 1, nome: 'Janeiro' }, { numero: 2, nome: 'Fevereiro' }, { numero: 3, nome: 'Março' },
    { numero: 4, nome: 'Abril' }, { numero: 5, nome: 'Maio' }, { numero: 6, nome: 'Junho' },
    { numero: 7, nome: 'Julho' }, { numero: 8, nome: 'Agosto' }, { numero: 9, nome: 'Setembro' },
    { numero: 10, nome: 'Outubro' }, { numero: 11, nome: 'Novembro' }, { numero: 12, nome: 'Dezembro' }
];

function ListChamada() {
    const navigate = useNavigate();
    const [chamadas, setChamadas] = useState<Chamada[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
    const [criandoPresenca, setCriandoPresenca] = useState<number | null>(null);

    const fetchChamadasPorMes = async (mes: number) => {
        try {
            setLoading(true);
            setError(null);

            const colaboradorId = 14; // Pegar do usuário logado
            const data = await buscarChamadasPorMes(colaboradorId, mes);
            setChamadas(data.chamadas || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar chamadas');
            setChamadas([]);
        } finally {
            setLoading(false);
        }
    };

    const handleMonthSelect = (mes: number) => {
        setSelectedMonth(mes);
        fetchChamadasPorMes(mes);
    };

    const handleBackToMonths = () => {
        setSelectedMonth(null);
        setChamadas([]);
        setError(null);
    };

    const formatDate = (dateString: string) => {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    };

    const handleVerPresenca = async (chamadaId: number) => {
        if (criandoPresenca === chamadaId) return;

        try {
            setCriandoPresenca(chamadaId);

            // Tentar criar as presenças (se já existirem, vai para o catch)
            try {
                const resultadoPresencas = await criarPresencas(chamadaId);
                console.log('Presenças criadas:', resultadoPresencas);
            } catch (presencaError: any) {
                // Se já existem presenças, apenas continuar para navegação
                console.log('Presenças já existem ou erro:', presencaError);
            }

            // Navegar para tela de presença
            navigate(`/presencas/${chamadaId}`);

        } catch (error: any) {
            console.error('Erro ao processar presença:', error);
            alert('Erro ao acessar presenças. Tente novamente.');
        } finally {
            setCriandoPresenca(null);
        }
    };

    const currentYear = new Date().getFullYear();
    const primeiroSemestre = MESES.slice(0, 6);
    const segundoSemestre = MESES.slice(6);

    return (
        <>
            <Header />
            <Container>
                {selectedMonth && (
                    <BackButton onClick={handleBackToMonths}>
                        <IoArrowBack />
                        Voltar aos Meses
                    </BackButton>
                )}
                <Title>
                    {selectedMonth
                        ? `${MESES.find(m => m.numero === selectedMonth)?.nome} ${currentYear}`
                        : 'Chamadas do Mês'
                    }
                </Title>
                <TopLine />

                {!selectedMonth && (
                    <MonthsContainer>
                        <MonthTitle>Primeiro Semestre</MonthTitle>
                        {primeiroSemestre.map((mes) => (
                            <MonthCard key={mes.numero} onClick={() => handleMonthSelect(mes.numero)}>
                                <FiCalendar size={24} />
                                <span>{mes.nome}</span>
                            </MonthCard>
                        ))}

                        <MonthTitle>Segundo Semestre</MonthTitle>
                        {segundoSemestre.map((mes) => (
                            <MonthCard key={mes.numero} onClick={() => handleMonthSelect(mes.numero)}>
                                <FiCalendar size={24} />
                                <span>{mes.nome}</span>
                            </MonthCard>
                        ))}
                    </MonthsContainer>
                )}

                {selectedMonth && (
                    <TableContainer>
                        {loading && (
                            <LoadingState />
                        )}

                        {error && (
                            <ErrorState>
                                {error}
                            </ErrorState>
                        )}

                        {!loading && !error && chamadas.length === 0 && (
                            <EmptyState>
                                Nenhuma chamada encontrada para este mês
                            </EmptyState>
                        )}

                        {!loading && !error && chamadas.length > 0 && (
                            <>
                                {chamadas.map((chamada) => (
                                    <ChamadaCard key={chamada.chamada_id}>
                                        <ChamadaInfo>
                                            <div>
                                                <ChamadaLabel>Turma</ChamadaLabel>
                                                <ChamadaValue>{chamada.turma_nome}</ChamadaValue>
                                            </div>
                                            <div>
                                                <ChamadaLabel>Data da Aula</ChamadaLabel>
                                                <ChamadaValue>{formatDate(chamada.data_aula)}</ChamadaValue>
                                            </div>
                                        </ChamadaInfo>
                                        <ActionButton 
                                            onClick={() => handleVerPresenca(chamada.chamada_id)}
                                            title="Ver Presença"
                                            disabled={criandoPresenca === chamada.chamada_id}
                                        >
                                            <MdBackHand size={20} />
                                            {criandoPresenca === chamada.chamada_id 
                                                ? 'Carregando...' 
                                                : 'Ver Presença'
                                            }
                                        </ActionButton>
                                    </ChamadaCard>
                                ))}
                            </>
                        )}
                    </TableContainer>
                )}
            </Container>
        </>
    );
}

export default ListChamada;