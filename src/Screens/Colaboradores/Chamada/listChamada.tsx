import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../../Header/header";
import { FiCalendar, FiArrowLeft } from "react-icons/fi";
import { IoArrowBack } from "react-icons/io5";
import { MdEditSquare, MdDelete, MdBackHand } from "react-icons/md";
import {
    Title,
    DisplayFlex,
    TopLine,
    MonthsContainer,
    MonthCard,
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
    BackButton,
    MonthTitle,
    ActionButtons,
    EditButton
} from "./style";
import { Container } from '../../../ui/Container/style';

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

function ListChamadas() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [chamadas, setChamadas] = useState<Chamada[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

    const fetchChamadasPorMes = async (mes: number) => {
        if (!id) return;

        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`http://localhost:3000/chamadas/colaborador/${id}/mes?mes=${mes}`);

            if (!response.ok) {
                throw new Error('Erro ao buscar chamadas');
            }

            const data = await response.json();
            setChamadas(data.chamadas || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
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

    const currentYear = new Date().getFullYear();
    const primeiroSemestre = MESES.slice(0, 6);
    const segundoSemestre = MESES.slice(6);

    return (
        <>
            <Header />
            <Container>
                <DisplayFlex>
                    <Title>
                        {selectedMonth
                            ? `Chamadas - ${MESES.find(m => m.numero === selectedMonth)?.nome} ${currentYear}`
                            : 'Chamadas do Professor'
                        }
                    </Title>
                    <TopLine />
                </DisplayFlex>

                <BackButton onClick={() => navigate('/listColaboradores')}>
                    <FiArrowLeft />
                    Voltar para Colaboradores
                </BackButton>

                {selectedMonth && (
                    <BackButton onClick={handleBackToMonths}>
                        <IoArrowBack />
                        Voltar aos Meses
                    </BackButton>
                )}

                {!selectedMonth && (
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <MonthsContainer>
                            <MonthTitle>Primeiro Semestre</MonthTitle>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                                {primeiroSemestre.map((mes) => (
                                    <MonthCard key={mes.numero} onClick={() => handleMonthSelect(mes.numero)}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                            <FiCalendar size={20} />
                                            <strong>{mes.nome}</strong>
                                        </div>
                                    </MonthCard>
                                ))}
                            </div>

                            <MonthTitle>Segundo Semestre</MonthTitle>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                {segundoSemestre.map((mes) => (
                                    <MonthCard key={mes.numero} onClick={() => handleMonthSelect(mes.numero)}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                            <FiCalendar size={20} />
                                            <strong>{mes.nome}</strong>
                                        </div>
                                    </MonthCard>
                                ))}
                            </div>
                        </MonthsContainer>
                    </div>
                )}

                {selectedMonth && (
                    <TableContainer>
                        {loading && (
                            <LoadingState>
                                Carregando chamadas...
                            </LoadingState>
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
                            <Table>
                                <TableHeader>
                                    <tr>
                                        <TableHeaderCell>Turma</TableHeaderCell>
                                        <TableHeaderCell>Data da Aula</TableHeaderCell>
                                        <TableHeaderCell className="center">Ações</TableHeaderCell>
                                    </tr>
                                </TableHeader>
                                <TableBody>
                                    {chamadas.map((chamada, index) => (
                                        <TableRow key={chamada.chamada_id} index={index}>
                                            <TableCell>{chamada.turma_nome}</TableCell>
                                            <TableCell>{formatDate(chamada.data_aula)}</TableCell>
                                            <ActionButtons>
                                                <EditButton
                                                    title="Ver Presença"
                                                >
                                                    <MdBackHand />
                                                </EditButton>
                                            </ActionButtons>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </TableContainer>
                )}
            </Container >
        </>
    );
}

export default ListChamadas;