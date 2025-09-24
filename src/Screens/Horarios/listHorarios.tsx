import { useEffect, useState } from "react";
import Header from '../../Header/header';
import { IoAdd } from "react-icons/io5";
import { getHorarios, createHorario, deleteHorario } from "../../services/horarioService";
import type { Horario } from "../../Models/horario";
import {
    DisplayFlex,
    Title,
    TopLine,
    DiaContainer,
    VerticalLine,
    DiaTitle,
    HorarioBox
} from "./style";
import { AddButton } from '../../ui/AddButton/style';
import { Container } from '../../ui/Container/style';

// Função para converter "HH:MM - HH:MM" em minutos
const parseHora = (horario: string) => {
    const [hora, minuto] = horario.split(" - ")[0].split(":").map(Number);
    return hora * 60 + minuto;
};

function ListHorarios() {
    const [horarios, setHorarios] = useState<Horario[]>([]);

    useEffect(() => {
        const fetchHorarios = async () => {
            try {
                const data = await getHorarios();
                setHorarios(data);
            } catch (err) {
                console.error("Erro ao buscar horários:", err);
            }
        };
        fetchHorarios();
    }, []);

    // Cores dos cards
    const cores = [
        "rgba(230, 169, 61, 0.75)",
        "#FFCB42BF",
        "#82CDFFBF",
        "#2F669080",
        "#26465380",
        "#B6451B80",
        "#8B1E3F80",
        "#1C1C3C80"
    ];

    // Adicionar horário
    const handleAddHorario = async (dia: string) => {
        const novoHorario = prompt(`Digite o horário no formato HH:MM - HH:MM para ${dia}:`);
        if (!novoHorario) return;

        // validação simples de formato
        const regex = /^([0-1]\d|2[0-3]):([0-5]\d)\s-\s([0-1]\d|2[0-3]):([0-5]\d)$/;
        if (!regex.test(novoHorario)) {
            alert("Formato inválido! Use HH:MM - HH:MM, exemplo: 08:00 - 09:00");
            return;
        }

        try {
            const novo = await createHorario({
                dia_semana: dia,
                horario: novoHorario,
            });

            setHorarios(prev => [...prev, novo]);
        } catch (err) {
            console.error("Erro ao adicionar horário:", err);
        }
    };

    // Remover horário
    const handleDeleteHorario = async (id: number) => {
        const confirmar = window.confirm("Tem certeza que deseja remover este horário?");
        if (!confirmar) return;

        try {
            await deleteHorario(id);
            setHorarios(prev => prev.filter(h => h.horario_id !== id));
        } catch (err) {
            console.error("Erro ao deletar horário:", err);
        }
    };

    // Agrupar e ordenar horários por dia
    const horariosPorDia: Record<string, Horario[]> = {};
    horarios.forEach(h => {
        const dia = h.dia_semana.trim();
        if (!horariosPorDia[dia]) horariosPorDia[dia] = [];
        horariosPorDia[dia].push(h);
    });

    Object.keys(horariosPorDia).forEach(dia => {
        horariosPorDia[dia].sort((a, b) => parseHora(a.horario) - parseHora(b.horario));
    });

    const diasOrdenados = [
        "Segunda-feira",
        "Terça-feira",
        "Quarta-feira",
        "Quinta-feira",
        "Sexta-feira",
        "Sábado",
        "Domingo"
    ];

    return (
        <>
            <Header />
            <Container>
                <DisplayFlex>
                    <Title>Horarios</Title>
                    <TopLine />
                </DisplayFlex>
                <DisplayFlex style={{ justifyContent: 'center' }}>
                    {diasOrdenados.map((dia, indexDia) => {
                        const horariosDoDia = horariosPorDia[dia] || [];

                        return (
                            <>
                                <DiaContainer key={dia}>
                                    <DiaTitle>{dia}</DiaTitle>
                                    <AddButton onClick={() => handleAddHorario(dia)}>
                                        <IoAdd /> Novo
                                    </AddButton>

                                    {horariosDoDia.length > 0 ? (
                                        horariosDoDia.map((h, index) => (
                                            <HorarioBox
                                                key={h.horario_id}
                                                onClick={() => handleDeleteHorario(h.horario_id)}
                                                style={{
                                                    backgroundColor: cores[index % cores.length],
                                                    color: "#fff",
                                                    fontSize: "1.25rem",
                                                    fontWeight: 500,
                                                    fontFamily: 'Arial, sans-serif',
                                                    cursor: "pointer",
                                                }}
                                            >
                                                {h.horario}
                                            </HorarioBox>
                                        ))
                                    ) : (
                                        <p style={{ color: "#888", fontSize: "0.9rem" }}>
                                            Nenhum horário
                                        </p>
                                    )}
                                </DiaContainer>
                                {indexDia < diasOrdenados.length - 1 && <VerticalLine />}
                            </>
                        );
                    })}
                </DisplayFlex>
            </Container>
        </>
    );
}

export default ListHorarios;
