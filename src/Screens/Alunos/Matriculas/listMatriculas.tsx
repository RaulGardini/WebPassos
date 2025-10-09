import { useState, useEffect } from "react";
import Header from "../../../Header/header";
import { useNavigate, useParams } from "react-router-dom";
import { MdSave } from "react-icons/md";
import { FiArrowLeft } from "react-icons/fi";
import { getMatriculas, atualizarDescontos } from "../../../services/matriculaService";
import type { Matricula } from "../../../Models/matricula";
import {
    Title,
    DisplayFlex,
    TopLine,
    BackButton,
    TableContainer,
    Table,
    TableHeader,
    TableHeaderCell,
    TableBody,
    TableRow,
    TableCell,
    ActionButtons,
    EmptyMessage,
    InputWrapper,
    InputLabel,
    EditableInput,
    SaveButton,
    SuccessMessage,
    ErrorMessage,
    ValorFinalCell
} from "../style";
import { LoadingState } from "../../../ui/Loading/style";
import { Container } from '../../../ui/Container/style';

interface MatriculaEditState {
    [key: number]: {
        desconto_perc: number;
        desconto_num: number;
    };
}

function ListaMatriculas() {
    const [matriculas, setMatriculas] = useState<Matricula[]>([]);
    const [loading, setLoading] = useState(true);
    const [editStates, setEditStates] = useState<MatriculaEditState>({});
    const [saving, setSaving] = useState<{ [key: number]: boolean }>({});
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const navigate = useNavigate();
    const { aluno_id } = useParams<{ aluno_id: string }>();

    useEffect(() => {
        fetchMatriculas();
    }, [aluno_id]);

    const fetchMatriculas = async () => {
        try {
            setLoading(true);
            setErrorMessage("");

            const data = await getMatriculas(Number(aluno_id));
            setMatriculas(data);

            const initialStates: MatriculaEditState = {};
            data.forEach((m: Matricula) => {
                initialStates[m.matricula_id] = {
                    desconto_perc: Number(m.desconto_perc) || 0,
                    desconto_num: Number(m.desconto_num) || 0
                };
            });
            setEditStates(initialStates);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('pt-BR');
    };

    const handleInputChange = (matriculaId: number, field: 'desconto_perc' | 'desconto_num', value: string) => {
        const numValue = value === '' ? 0 : Number(value);

        setEditStates(prev => ({
            ...prev,
            [matriculaId]: {
                ...prev[matriculaId],
                [field]: numValue,
                // Zera o outro campo quando este for preenchido
                ...(field === 'desconto_perc' && numValue > 0 ? { desconto_num: 0 } : {}),
                ...(field === 'desconto_num' && numValue > 0 ? { desconto_perc: 0 } : {})
            }
        }));
    };

    const handleSaveDesconto = async (matriculaId: number) => {
        try {
            setSaving(prev => ({ ...prev, [matriculaId]: true }));
            setErrorMessage("");
            setSuccessMessage("");

            const descontos = editStates[matriculaId];

            console.log('💾 Salvando descontos:', {
                matriculaId,
                ...descontos
            });

            const response = await atualizarDescontos(matriculaId, descontos);
            console.log('✅ Resposta do servidor:', response);

            await new Promise(resolve => setTimeout(resolve, 300));
            await fetchMatriculas();

            setTimeout(() => setSuccessMessage(""), 3000);
        } finally {
            setSaving(prev => ({ ...prev, [matriculaId]: false }));
        }
    };

    const calcularValorFinal = (matricula: Matricula, matriculaId: number) => {
        const state = editStates[matriculaId];
        if (!state) return Number(matricula.valor_final);

        const valorBase = Number(matricula.valor_matricula);
        let valorFinal = valorBase;

        if (state.desconto_perc > 0) {
            valorFinal = valorBase - (valorBase * (state.desconto_perc / 100));
        } else if (state.desconto_num > 0) {
            valorFinal = valorBase - state.desconto_num;
        }

        return Math.max(0, valorFinal);
    };

    const hasChanges = (matricula: Matricula) => {
        const state = editStates[matricula.matricula_id];
        if (!state) return false;

        return (
            Number(state.desconto_perc) !== Number(matricula.desconto_perc || 0) ||
            Number(state.desconto_num) !== Number(matricula.desconto_num || 0)
        );
    };

    return (
        <>
            <Header />
            <Container>
                <DisplayFlex>
                    <Title>Matrículas do Aluno</Title>
                    <TopLine></TopLine>
                </DisplayFlex>
                <DisplayFlex style={{ justifyContent: 'space-between' }}>
                    <BackButton onClick={() => navigate(-1)}>
                        <FiArrowLeft /> Voltar
                    </BackButton>
                    <button>mensalidades</button>
                </DisplayFlex>

                {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
                {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

                {loading ? (
                    <LoadingState></LoadingState>
                ) : matriculas.length === 0 ? (
                    <EmptyMessage>Nenhuma matrícula encontrada.</EmptyMessage>
                ) : (
                    <TableContainer>
                        <Table>
                            <TableHeader>
                                <tr>
                                    <TableHeaderCell>Número</TableHeaderCell>
                                    <TableHeaderCell>Turma</TableHeaderCell>
                                    <TableHeaderCell>Valor</TableHeaderCell>
                                    <TableHeaderCell>Data Matrícula</TableHeaderCell>
                                    <TableHeaderCell>Desconto</TableHeaderCell>
                                    <TableHeaderCell>Valor Final</TableHeaderCell>
                                    <TableHeaderCell style={{ textAlign: 'center' }}>Ações</TableHeaderCell>
                                </tr>
                            </TableHeader>
                            <TableBody>
                                {matriculas.map((matricula, index) => {
                                    const state = editStates[matricula.matricula_id] || { desconto_perc: 0, desconto_num: 0 };
                                    const valorFinalExibir = calcularValorFinal(matricula, matricula.matricula_id);
                                    const temMudancas = hasChanges(matricula);

                                    return (
                                        <TableRow key={matricula.matricula_id} index={index}>
                                            <TableCell>{matricula.numero_matricula}</TableCell>
                                            <TableCell>{matricula.nome_turma}</TableCell>
                                            <TableCell fontWeight="500">
                                                {formatCurrency(Number(matricula.valor_matricula))}
                                            </TableCell>
                                            <TableCell>{formatDate(matricula.data_matricula)}</TableCell>

                                            {/* DESCONTO PERCENTUAL */}
                                            <TableCell>
                                                <DisplayFlex>
                                                    <InputWrapper>
                                                        <EditableInput
                                                            type="number"
                                                            value={state.desconto_perc || ''}
                                                            onChange={(e) => handleInputChange(
                                                                matricula.matricula_id,
                                                                'desconto_perc',
                                                                e.target.value
                                                            )}
                                                            min="0"
                                                            max="100"
                                                            step="0.01"
                                                            placeholder="0%"
                                                            hasValue={state.desconto_perc > 0}
                                                        />
                                                        <InputLabel>
                                                            % |
                                                        </InputLabel>
                                                    </InputWrapper>
                                                    <InputWrapper>
                                                        <InputLabel>
                                                            | R$
                                                        </InputLabel>
                                                        <EditableInput
                                                            type="number"
                                                            value={state.desconto_num || ''}
                                                            onChange={(e) => handleInputChange(
                                                                matricula.matricula_id,
                                                                'desconto_num',
                                                                e.target.value
                                                            )}
                                                            min="0"
                                                            step="0.01"
                                                            placeholder="R$0.00"
                                                            hasValue={state.desconto_num > 0}
                                                        />
                                                    </InputWrapper>
                                                </DisplayFlex>
                                            </TableCell>

                                            <ValorFinalCell>
                                                {formatCurrency(valorFinalExibir)}
                                            </ValorFinalCell>

                                            <TableCell textAlign="center">
                                                <ActionButtons>
                                                    <SaveButton
                                                        onClick={() => handleSaveDesconto(matricula.matricula_id)}
                                                        disabled={saving[matricula.matricula_id] || !temMudancas}
                                                        title={temMudancas ? "Salvar alterações" : "Nenhuma alteração para salvar"}
                                                    >
                                                        <MdSave />
                                                        {saving[matricula.matricula_id] ? 'Salvando...' : 'Salvar'}
                                                    </SaveButton>
                                                </ActionButtons>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Container>
        </>
    );
}

export default ListaMatriculas;