import { useState, useEffect } from "react";
import Header from "../../Header/header";
import { useNavigate, useParams } from "react-router-dom";
import { getHorariosDisponiveisParaTurma  } from "../../services/horarioService";
import { addMultipleHorariosToTurma } from "../../services/turmaHorarioService";
import type { Horario } from '../../Models/horario';
import {
    Title,
    DisplayFlex,
    Button,
    Message,
    TopLine,
    MidLine,
    BackButton
} from "./style";
import { Container } from '../../ui/Container/style';

// Styled components específicos para esta tela
import styled from "styled-components";

const DaysContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 15px;
    margin: 20px 0;
    width: 100%;
`;

const DayCard = styled.div<{ isSelected: boolean }>`
    background: ${props => props.isSelected ? '#ee0e0eff' : '#f8f9fa'};
    color: ${props => props.isSelected ? 'white' : '#333'};
    border: 2px solid ${props => props.isSelected ? '#333' : '#dee2e6'};
    border-radius: 8px;
    padding: 15px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    user-select: none;

    &:hover {
        border-color: #1a0505ff;
        background: ${props => props.isSelected ? '#424242ff' : '#cececeff'};
    }
`;

const DayName = styled.h3`
    margin: 0 0 5px 0;
    font-size: 16px;
    font-weight: 600;
`;

const DayNumber = styled.p`
    margin: 0;
    font-size: 14px;
    opacity: 0.8;
`;

const HorariosContainer = styled.div`
    margin-top: 20px;
    max-height: 300px;
    overflow-y: auto;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    padding: 15px;
    background: #fff;
`;

const HorariosList = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 10px;
`;

const HorarioItem = styled.div<{ isSelected: boolean }>`
    background: ${props => props.isSelected ? '#28a745' : '#f8f9fa'};
    color: ${props => props.isSelected ? 'white' : '#333'};
    border: 2px solid ${props => props.isSelected ? '#28a745' : '#dee2e6'};
    border-radius: 6px;
    padding: 12px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    user-select: none;

    &:hover {
        border-color: #1a0505ff;
        background: ${props => props.isSelected ? '#424242ff' : '#cececeff'};
    }
`;

const SelectedHorariosContainer = styled.div`
    margin-top: 20px;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #dee2e6;
`;

const SelectedHorarioTag = styled.span`
    display: inline-block;
    background: #007bff;
    color: white;
    padding: 5px 10px;
    margin: 5px;
    border-radius: 15px;
    font-size: 12px;
    cursor: pointer;
    
    &:hover {
        background: #0056b3;
    }
`;

const ErrorMessage = styled.div`
    background: #f8d7da;
    color: #721c24;
    padding: 20px;
    border-radius: 8px;
    margin: 20px 0;
    text-align: center;
    border: 1px solid #f5c6cb;
`;

function AddTurmasHorarios() {
    const navigate = useNavigate();
    const params = useParams();
    const turmaId = params.turmaId;
    
    const [horarios, setHorarios] = useState<Horario[]>([]);
    const [selectedDay, setSelectedDay] = useState<string | null>(null);
    const [selectedHorarios, setSelectedHorarios] = useState<Horario[]>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<"success" | "error">("success");

    // Verificar se turmaId existe
    if (!turmaId) {
        return (
            <>
                <Header />
                <Container>
                    <ErrorMessage>
                        <h3>Erro: ID da turma não encontrado</h3>
                        <p>Não foi possível identificar a turma. Retorne à tela anterior e tente novamente.</p>
                        <Button onClick={() => navigate('/addTurmas')}>
                            Voltar para Nova Turma
                        </Button>
                    </ErrorMessage>
                </Container>
            </>
        );
    }

    // Dias da semana
    const diasSemana = [
        { key: 'Segunda-feira', name: 'Segunda-feira', short: 'SEG' },
        { key: 'Terça-feira', name: 'Terça-feira', short: 'TER' },
        { key: 'Quarta-feira', name: 'Quarta-feira', short: 'QUA' },
        { key: 'Quinta-feira', name: 'Quinta-feira', short: 'QUI' },
        { key: 'Sexta-feira', name: 'Sexta-feira', short: 'SEX' },
        { key: 'Sábado', name: 'Sábado', short: 'SAB' },
        { key: 'Domingo', name: 'Domingo', short: 'DOM' }
    ];

    useEffect(() => {
        loadHorarios();
    }, []);

    const loadHorarios = async () => {
        try {
            setLoading(true);
            // MODIFICAÇÃO: usar a nova função que só retorna horários disponíveis
            const horariosData = await getHorariosDisponiveisParaTurma(parseInt(turmaId));
            setHorarios(horariosData);
        } catch (error) {
            console.error("Erro ao carregar horários:", error);
            setMessage("Erro ao carregar horários disponíveis para esta turma");
            setMessageType("error");
        } finally {
            setLoading(false);
        }
    };

    const handleDayClick = (dayKey: string) => {
        setSelectedDay(selectedDay === dayKey ? null : dayKey);
    };

    const getHorariosByDay = (dayKey: string) => {
        return horarios.filter(horario => 
            horario.dia_semana === dayKey
        );
    };

    const handleHorarioClick = (horario: Horario) => {
        const isSelected = selectedHorarios.some(h => h.horario_id === horario.horario_id);
        
        if (isSelected) {
            setSelectedHorarios(prev => 
                prev.filter(h => h.horario_id !== horario.horario_id)
            );
        } else {
            setSelectedHorarios(prev => [...prev, horario]);
        }
    };

    const removeSelectedHorario = (horarioId: number) => {
        setSelectedHorarios(prev => 
            prev.filter(h => h.horario_id !== horarioId)
        );
    };

    const handleContinue = async () => {
        if (selectedHorarios.length === 0) {
            setMessage("Selecione pelo menos um horário para continuar");
            setMessageType("error");
            return;
        }

        try {
            setLoading(true);
            setMessage("Salvando horários da turma...");
            setMessageType("success");

            const horariosIds = selectedHorarios.map(h => h.horario_id);
            const result = await addMultipleHorariosToTurma(parseInt(turmaId), horariosIds);

            setMessage(result.message || "Horários salvos com sucesso! Redirecionando...");
            
            setTimeout(() => {
                navigate(`/listTurmas`);
            }, 1500);

        } catch (error: any) {
            console.error("Erro ao salvar horários:", error);
            
            const errorMessage = error.response?.data?.error || error.message || "Erro ao salvar horários da turma. Tente novamente.";
            setMessage(errorMessage);
            setMessageType("error");
            setLoading(false);
        }
    };

    const handleBack = () => {
        if (selectedHorarios.length > 0) {
            if (window.confirm("Deseja realmente voltar? Os horários selecionados serão perdidos.")) {
                navigate(-1);
            }
        } else {
            navigate(-1);
        }
    };

    return (
        <>
            <Header />
            <Container>
                <DisplayFlex>
                    <Title>Horários da Turma</Title>
                    <TopLine style={{width: '74%'}}></TopLine>
                </DisplayFlex>
                
                {loading && !horarios.length ? (
                    <Message success={true}>Carregando horários...</Message>
                ) : (
                    <>
                        <p style={{ textAlign: 'center', marginBottom: '20px', color: '#666' }}>
                            Selecione um dia da semana para ver os horários disponíveis
                        </p>

                        <DaysContainer>
                            {diasSemana.map((dia) => (
                                <DayCard
                                    key={dia.key}
                                    isSelected={selectedDay === dia.key}
                                    onClick={() => handleDayClick(dia.key)}
                                >
                                    <DayName>{dia.short}</DayName>
                                    <DayNumber>{dia.name}</DayNumber>
                                </DayCard>
                            ))}
                        </DaysContainer>

                        {selectedDay && (
                            <HorariosContainer>
                                <h4 style={{ marginTop: 0, marginBottom: '15px' }}>
                                    Horários disponíveis - {diasSemana.find(d => d.key === selectedDay)?.name}
                                </h4>
                                
                                <HorariosList>
                                    {getHorariosByDay(selectedDay).map((horario) => {
                                        const isSelected = selectedHorarios.some(h => h.horario_id === horario.horario_id);
                                        return (
                                            <HorarioItem
                                                key={horario.horario_id}
                                                isSelected={isSelected}
                                                onClick={() => handleHorarioClick(horario)}
                                            >
                                                <div>
                                                    <strong>
                                                        {horario.horario}
                                                    </strong>
                                                </div>
                                                <div style={{ fontSize: '12px', marginTop: '5px' }}>
                                                    {isSelected ? 'Selecionado' : 'Clique para selecionar'}
                                                </div>
                                            </HorarioItem>
                                        );
                                    })}
                                </HorariosList>

                                {getHorariosByDay(selectedDay).length === 0 && (
                                    <p style={{ textAlign: 'center', color: '#666', margin: '20px 0' }}>
                                        Nenhum horário disponível para este dia
                                    </p>
                                )}
                            </HorariosContainer>
                        )}

                        {selectedHorarios.length > 0 && (
                            <SelectedHorariosContainer>
                                <h4 style={{ marginTop: 0, marginBottom: '10px' }}>
                                    Horários Selecionados ({selectedHorarios.length})
                                </h4>
                                <div>
                                    {selectedHorarios.map((horario) => {
                                        const diaInfo = diasSemana.find(d => d.key === horario.dia_semana);
                                        return (
                                            <SelectedHorarioTag
                                                key={horario.horario_id}
                                                onClick={() => removeSelectedHorario(horario.horario_id)}
                                                title="Clique para remover"
                                            >
                                                {diaInfo?.short} - {horario.horario} ✕
                                            </SelectedHorarioTag>
                                        );
                                    })}
                                </div>
                                <p style={{ fontSize: '12px', color: '#666', margin: '10px 0 0 0' }}>
                                    Clique em um horário selecionado para removê-lo
                                </p>
                            </SelectedHorariosContainer>
                        )}

                        <MidLine></MidLine>

                        <DisplayFlex>
                            <BackButton type="button" onClick={handleBack}>
                                Voltar
                            </BackButton>
                            <Button 
                                type="button" 
                                onClick={handleContinue}
                                disabled={selectedHorarios.length === 0 || loading}
                            >
                                {loading ? 'Salvando...' : `Adicionar Horários (${selectedHorarios.length})`}
                            </Button>
                        </DisplayFlex>

                        {message && (
                            <Message success={messageType === "success"}>
                                {message}
                            </Message>
                        )}
                    </>
                )}
            </Container>
        </>
    );
}

export default AddTurmasHorarios;