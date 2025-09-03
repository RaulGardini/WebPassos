import { useState, useEffect } from "react";
import Header from "../../Header/header";
import { useNavigate, useParams } from "react-router-dom";
import { getTurmaById } from "../../services/turmaService";
import { getHorariosDisponiveisParaTurma } from "../../services/horarioService";
import {  
    addMultipleHorariosToTurma,
    removeAllHorariosFromTurma
} from "../../services/turmaHorarioService";
import type { Horario } from '../../Models/horario';
import type { Turma } from '../../Models/turma';
import {
    Container,
    Title,
    DisplayFlex,
    Button,
    Message,
    TopLine,
    MidLine,
    BackButton,
    DaysContainer,
    DayCard,
    HorariosContainer,
    HorariosList,
    HorarioItem
} from "./style";

function UpdateTurmasHorarios() {
    const navigate = useNavigate();
    const params = useParams();
    const turmaId = params.turmaId ? parseInt(params.turmaId) : null;
    
    const [turma, setTurma] = useState<Turma | null>(null);
    const [horariosDisponiveis, setHorariosDisponiveis] = useState<Horario[]>([]);
    const [selectedDay, setSelectedDay] = useState<string | null>(null);
    const [horariosSelecionados, setHorariosSelecionados] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<"success" | "error">("success");

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

    // Verificar se turmaId existe
    if (!turmaId) {
        return (
            <>
                <Header />
                <Container>
                    <div style={{
                        background: '#f8d7da',
                        color: '#721c24',
                        padding: '20px',
                        borderRadius: '8px',
                        margin: '20px 0',
                        textAlign: 'center',
                        border: '1px solid #f5c6cb'
                    }}>
                        <h3>Erro: ID da turma não encontrado</h3>
                        <Button onClick={() => navigate('/turmas')}>
                            Voltar para Turmas
                        </Button>
                    </div>
                </Container>
            </>
        );
    }

    useEffect(() => {
        loadData();
    }, [turmaId]);

    const loadData = async () => {
        try {
            setLoadingData(true);
            const [turmaData, horariosDisponiveisData] = await Promise.all([
                getTurmaById(turmaId),
                getHorariosDisponiveisParaTurma(turmaId)
            ]);

            setTurma(turmaData);
            setHorariosDisponiveis(horariosDisponiveisData);

            // Pré-selecionar os horários atuais da turma
            if (turmaData?.horarios) {
                const horariosAtuais = turmaData.horarios.map(h => h.horario_id);
                setHorariosSelecionados(horariosAtuais);
            }

        } catch (error) {
            console.error("Erro ao carregar dados:", error);
            setMessage("Erro ao carregar dados da turma e horários");
            setMessageType("error");
        } finally {
            setLoadingData(false);
        }
    };

    const handleDayClick = (dayKey: string) => {
        setSelectedDay(selectedDay === dayKey ? null : dayKey);
    };

    const getHorariosByDay = (dayKey: string) => {
        return horariosDisponiveis.filter(horario => horario.dia_semana === dayKey);
    };

    const toggleHorario = (horarioId: number) => {
        if (horariosSelecionados.includes(horarioId)) {
            setHorariosSelecionados(prev => prev.filter(id => id !== horarioId));
        } else {
            setHorariosSelecionados(prev => [...prev, horarioId]);
        }
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            setMessage("Salvando horários...");
            setMessageType("success");

            // PRIMEIRO: Remover TODOS os horários atuais da turma
            console.log("Removendo todos os horários atuais...");
            await removeAllHorariosFromTurma(turmaId);

            // SEGUNDO: Adicionar os novos horários selecionados
            if (horariosSelecionados.length > 0) {
                console.log("Adicionando novos horários:", horariosSelecionados);
                await addMultipleHorariosToTurma(turmaId, horariosSelecionados);
            }

            setMessage(`Horários salvos com sucesso! Total: ${horariosSelecionados.length}`);
            
            // Recarregar dados
            await loadData();

        } catch (error: any) {
            console.error("Erro ao salvar:", error);
            setMessage(error.message || "Erro ao salvar horários");
            setMessageType("error");
        } finally {
            setLoading(false);
        }
    };

    const getSelectedHorariosByDay = () => {
        const selectedHorarios = horariosDisponiveis.filter(h => horariosSelecionados.includes(h.horario_id));
        const grouped: { [key: string]: Horario[] } = {};
        
        selectedHorarios.forEach(horario => {
            if (!grouped[horario.dia_semana]) {
                grouped[horario.dia_semana] = [];
            }
            grouped[horario.dia_semana].push(horario);
        });

        return grouped;
    };

    if (loadingData) {
        return (
            <>
                <Header />
                <Container>
                    <Message success={true}>Carregando dados...</Message>
                </Container>
            </>
        );
    }

    const selectedHorariosByDay = getSelectedHorariosByDay();

    return (
        <>
            <Header />
            <Container>
                <DisplayFlex>
                    <Title>Horários da Turma - {turma?.nome}</Title>
                    <TopLine style={{width: '83%'}}></TopLine>
                </DisplayFlex>
                
                <div style={{
                    background: '#f8f9fa',
                    border: '1px solid #dee2e6',
                    borderRadius: '8px',
                    padding: '15px',
                    margin: '20px 0'
                }}>
                    <p><strong>Turma:</strong> {turma?.nome}</p>
                    <p><strong>Horários Selecionados:</strong> {horariosSelecionados.length}</p>
                    <p style={{color: '#666', fontSize: '14px', margin: '10px 0 0 0'}}>
                        Selecione os horários que esta turma terá. Os horários anteriores serão completamente substituídos.
                    </p>
                </div>

                {/* Mostrar horários selecionados agrupados por dia */}
                {Object.keys(selectedHorariosByDay).length > 0 && (
                    <div style={{
                        background: '#e8f5e9',
                        border: '1px solid #28a745',
                        borderRadius: '8px',
                        padding: '15px',
                        margin: '20px 0'
                    }}>
                        <h4 style={{margin: '0 0 10px 0', color: '#28a745'}}>Horários Selecionados:</h4>
                        {Object.entries(selectedHorariosByDay).map(([dia, horarios]) => {
                            const diaInfo = diasSemana.find(d => d.key === dia);
                            return (
                                <div key={dia} style={{marginBottom: '8px'}}>
                                    <strong>{diaInfo?.short}:</strong> {horarios.map(h => h.horario).join(', ')}
                                </div>
                            );
                        })}
                    </div>
                )}

                <h3 style={{
                    color: '#333',
                    margin: '30px 0 20px 0',
                    fontSize: '18px',
                    borderBottom: '2px solid #007bff',
                    paddingBottom: '5px'
                }}>
                    Selecionar Horários por Dia
                </h3>

                <p style={{ textAlign: 'center', marginBottom: '20px', color: '#666' }}>
                    Clique em um dia da semana para ver os horários disponíveis
                </p>

                <DaysContainer>
                    {diasSemana.map((dia) => (
                        <DayCard
                            key={dia.key}
                            isSelected={selectedDay === dia.key}
                            onClick={() => handleDayClick(dia.key)}
                        >
                            <h3 style={{margin: '0 0 5px 0', fontSize: '16px', fontWeight: '600'}}>
                                {dia.short}
                            </h3>
                        </DayCard>
                    ))}
                </DaysContainer>

                {selectedDay && (
                    <HorariosContainer>
                        <h4 style={{ marginTop: 0, marginBottom: '15px' }}>
                            Horários de {diasSemana.find(d => d.key === selectedDay)?.name}
                        </h4>
                        
                        <HorariosList>
                            {getHorariosByDay(selectedDay).map((horario) => {
                                const isSelected = horariosSelecionados.includes(horario.horario_id);
                                
                                return (
                                    <HorarioItem
                                        key={horario.horario_id}
                                        isSelected={isSelected}
                                        onClick={() => toggleHorario(horario.horario_id)}
                                    >
                                        <div>
                                            <strong>{horario.horario}</strong>
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

                <MidLine></MidLine>

                <div style={{
                    display: 'flex',
                    gap: '10px',
                    justifyContent: 'center',
                    margin: '20px 0'
                }}>
                    <BackButton onClick={() => navigate(-1)}>
                        Voltar
                    </BackButton>
                    
                    <Button 
                        onClick={handleSave}
                        disabled={loading}
                        style={{
                            backgroundColor: '#28a745',
                            opacity: loading ? 0.6 : 1
                        }}
                    >
                        {loading ? 'Salvando...' : `Salvar Horários (${horariosSelecionados.length})`}
                    </Button>
                </div>

                {message && (
                    <Message success={messageType === "success"}>
                        {message}
                    </Message>
                )}

                <div style={{
                    background: '#e9ecef',
                    padding: '15px',
                    borderRadius: '8px',
                    marginTop: '20px',
                    fontSize: '14px',
                    color: '#495057',
                    textAlign: 'center'
                }}>
                    <strong>Como usar:</strong> Clique nos dias da semana para ver os horários disponíveis, 
                    depois clique nos horários para selecioná-los (verde). Os horários selecionados 
                    substituirão completamente os horários atuais da turma.
                </div>
            </Container>
        </>
    );
}

export default UpdateTurmasHorarios;