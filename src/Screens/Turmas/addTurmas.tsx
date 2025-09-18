import { useState, useEffect } from "react";
import Header from "../../Header/header";
import { useNavigate } from "react-router-dom";
import { createTurma } from "../../services/turmaService";
import { getSalas } from "../../services/salaService";
import { getModalidades } from "../../services/modalidadeService";
import { getColaboradores } from "../../services/colaboradorService";
import type { CreateTurmaData } from '../../Models/turma';
import type { Sala } from '../../Models/sala';
import type { Modalidade } from '../../Models/modalidade';
import type { Colaborador } from '../../Models/colaborador';
import {
    Title,
    DisplayFlex,
    Form,
    Input,
    Select,
    Button,
    Message,
    TopLine,
    BackButton,
} from "./style";
import { Container } from '../../ui/Container/style';

function AddTurmas() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<CreateTurmaData>({
        nome: "",
        sala_id: 0,
        modalidade_id: 0,
        professor1_id: undefined,
        professor2_id: undefined,
        status: "ativa",
        mensalidade: 0,
        capacidade: 0,
    });

    const [salas, setSalas] = useState<Sala[]>([]);
    const [modalidades, setModalidades] = useState<Modalidade[]>([]);
    const [professores, setProfessores] = useState<Colaborador[]>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<"success" | "error">("success");

    useEffect(() => {
        const loadSelectOptions = async () => {
            try {
                const [salasData, modalidadesData, professoresData] = await Promise.all([
                    getSalas(),
                    getModalidades(),
                    getColaboradores()
                ]);

                setSalas(salasData);
                setModalidades(modalidadesData);
                setProfessores(professoresData);
            } catch (error) {
                console.error("Erro ao carregar opções:", error);
                setMessage("Erro ao carregar dados necessários");
                setMessageType("error");
            }
        };

        loadSelectOptions();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: name === 'sala_id' || name === 'modalidade_id' || name === 'professor1_id' ||
                name === 'professor2_id' || name === 'professor3_id'
                ? (value ? Number(value) : undefined)
                : name === 'mensalidade'
                    ? Number(value)
                    : value
        }));

        if (message) {
            setMessage("");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.nome.trim()) {
            setMessage("Nome da turma é obrigatório");
            setMessageType("error");
            return;
        }

        if (!formData.sala_id) {
            setMessage("Sala é obrigatória");
            setMessageType("error");
            return;
        }

        if (!formData.modalidade_id) {
            setMessage("Modalidade é obrigatória");
            setMessageType("error");
            return;
        }

        if (formData.mensalidade <= 0) {
            setMessage("Mensalidade deve ser maior que zero");
            setMessageType("error");
            return;
        }

        if (formData.capacidade <= 0) {
            setMessage("Capacidade deve ser maior que zero");
            setMessageType("error");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const dataToSend = {
                ...formData,
                professor1_id: formData.professor1_id || undefined,
                professor2_id: formData.professor2_id || undefined
            };

            // Remover campos undefined
            Object.keys(dataToSend).forEach(key => {
                const value = dataToSend[key as keyof typeof dataToSend];
                if (value === undefined) {
                    delete dataToSend[key as keyof typeof dataToSend];
                }
            });

            const novaTurma = await createTurma(dataToSend);

            // Buscar ID em possíveis campos
            const turmaId = novaTurma.turma_id

            if (!turmaId) {
                throw new Error("ID da turma não encontrado na resposta da API");
            }

            setMessage("Turma criada com sucesso!");
            setMessageType("success");

            // Navegar para a tela de horários
            setTimeout(() => {
                navigate(`/addhorarios/${turmaId}`);
            }, 1000);

        } catch (error: any) {
            setMessage(error.message || "Erro ao criar turma");
            setMessageType("error");
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        const hasData = Object.values(formData).some(value =>
            value !== "" && value !== 0 && value !== undefined && value !== "ativa"
        );

        if (hasData) {
            if (window.confirm("Deseja realmente voltar? Os dados não salvos serão perdidos.")) {
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
                    <Title>Nova Turma</Title>
                    <TopLine style={{ width: '83%' }}></TopLine>
                </DisplayFlex>

                <Form onSubmit={handleSubmit}>
                    <DisplayFlex>
                        <DisplayFlex style={{ flexDirection: 'column' }}>
                            <p style={{ marginBottom: '-0.5rem', marginLeft: '1.2rem', color: '#666' }}>Nome da turma:</p>
                            <Input
                                type="text"
                                name="nome"
                                placeholder="Nome da turma"
                                value={formData.nome}
                                onChange={handleInputChange}
                                required
                            />
                        </DisplayFlex>
                        <DisplayFlex style={{ flexDirection: 'column' }}>
                            <p style={{ marginBottom: '-0.5rem', marginLeft: '1.2rem', color: '#666' }}>Sala:</p>
                            <Select
                                name="sala_id"
                                value={formData.sala_id || ""}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Selecione uma sala</option>
                                {salas.map((sala) => (
                                    <option key={sala.sala_id} value={sala.sala_id.toString()}>
                                        {sala.nome_sala} - Capacidade: {sala.capacidade}
                                    </option>
                                ))}
                            </Select>
                        </DisplayFlex>
                        <DisplayFlex style={{ flexDirection: 'column' }}>
                            <p style={{ marginBottom: '-0.5rem', marginLeft: '1.2rem', color: '#666' }}>Modalidade:</p>
                            <Select
                                name="modalidade_id"
                                value={formData.modalidade_id || ""}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Selecione uma modalidade</option>
                                {modalidades.map((modalidade) => (
                                    <option key={modalidade.modalidade_id} value={modalidade.modalidade_id.toString()}>
                                        {modalidade.nome_modalidade}
                                    </option>
                                ))}
                            </Select>
                        </DisplayFlex>
                        <DisplayFlex style={{ flexDirection: 'column' }}>
                            <p style={{ marginBottom: '-0.5rem', marginLeft: '1.2rem', color: '#666' }}>Professor 1:</p>
                            <Select
                                name="professor1_id"
                                value={formData.professor1_id || ""}
                                onChange={handleInputChange}
                            >
                                <option value="">Selecione o 1º professor (opcional)</option>
                                {professores.map((professor) => (
                                    <option key={professor.colaborador_id} value={professor.colaborador_id.toString()}>
                                        {professor.nome}
                                    </option>
                                ))}
                            </Select>
                        </DisplayFlex>
                        <DisplayFlex style={{ flexDirection: 'column' }}>
                            <p style={{ marginBottom: '-0.5rem', marginLeft: '1.2rem', color: '#666' }}>Professor 2:</p>
                            <Select
                                name="professor2_id"
                                value={formData.professor2_id || ""}
                                onChange={handleInputChange}
                            >
                                <option value="">Selecione o 2º professor (opcional)</option>
                                {professores.map((professor) => (
                                    <option key={professor.colaborador_id} value={professor.colaborador_id.toString()}>
                                        {professor.nome}
                                    </option>
                                ))}
                            </Select>
                        </DisplayFlex>
                        <DisplayFlex style={{ flexDirection: 'column' }}>
                            <p style={{ marginBottom: '-0.5rem', marginLeft: '1.2rem', color: '#666' }}>Status:</p>
                            <Select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="ativa">Ativa</option>
                                <option value="inativa">Inativa</option>
                            </Select>
                        </DisplayFlex>
                    </DisplayFlex>
                    <DisplayFlex>
                        <DisplayFlex style={{ flexDirection: 'column' }}>
                            <p style={{ marginBottom: '-0.5rem', marginLeft: '1.2rem', color: '#666' }}>Mensalidade:</p>
                            <Input
                                type="number"
                                name="mensalidade"
                                placeholder="Mensalidade (R$)"
                                value={formData.mensalidade || ""}
                                onChange={handleInputChange}
                                min="0"
                                step="0.01"
                                required
                            />
                        </DisplayFlex>
                        <DisplayFlex style={{ flexDirection: 'column' }}>
                            <p style={{ marginBottom: '-0.5rem', marginLeft: '1.2rem', color: '#666' }}>Capacidade:</p>
                            <Input
                                type="number"
                                name="capacidade"
                                placeholder="Capacidade"
                                value={formData.capacidade || ""}
                                onChange={handleInputChange}
                                required
                            />
                        </DisplayFlex>
                    </DisplayFlex>

                    <DisplayFlex>
                        <BackButton type="button" onClick={handleBack} disabled={loading}>
                            Voltar
                        </BackButton>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Criando..." : "Avançar"}
                        </Button>
                    </DisplayFlex>
                </Form>

                {message && (
                    <Message success={messageType === "success"}>
                        {message}
                    </Message>
                )}
            </Container>
        </>
    );
}

export default AddTurmas;