import { useState, useEffect } from "react";
import Header from "../../Header/header";
import { useNavigate, useParams } from "react-router-dom";
import { getTurmaById, updateTurma } from "../../services/turmaService";
import { getSalas } from "../../services/salaService";
import { getModalidades } from "../../services/modalidadeService";
import { getColaboradores } from "../../services/colaboradorService";
import type { UpdateTurmaData } from '../../Models/turma';
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
import { LoadingState } from "../../ui/Loading/style";
import { Container } from '../../ui/Container/style';

function UpdateTurma() {
    const navigate = useNavigate();
    const params = useParams();
    const turmaId = params.turmaId ? parseInt(params.turmaId) : null;

    const [formData, setFormData] = useState<UpdateTurmaData>({
        nome: "",
        sala_id: 0,
        modalidade_id: 0,
        professor1_id: undefined,
        professor2_id: undefined,
        status: "ativa",
        mensalidade: 0,
        capacidade: 0,
    });

    const [originalData, setOriginalData] = useState<UpdateTurmaData>({});
    const [salas, setSalas] = useState<Sala[]>([]);
    const [modalidades, setModalidades] = useState<Modalidade[]>([]);
    const [professores, setProfessores] = useState<Colaborador[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<"success" | "error">("success");

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
                        <p>Não foi possível identificar a turma. Retorne à listagem e tente novamente.</p>
                        <Button onClick={() => navigate('/turmas')}>
                            Voltar para Turmas
                        </Button>
                    </div>
                </Container>
            </>
        );
    }

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoadingData(true);
                const [turmaData, salasData, modalidadesData, professoresData] = await Promise.all([
                    getTurmaById(turmaId),
                    getSalas(),
                    getModalidades(),
                    getColaboradores()
                ]);

                // Configurar dados da turma
                const turmaFormData: UpdateTurmaData = {
                    nome: turmaData.nome,
                    sala_id: turmaData.sala_id,
                    modalidade_id: turmaData.modalidade_id,
                    professor1_id: turmaData.professor1_id || undefined,
                    professor2_id: turmaData.professor2_id || undefined,
                    status: turmaData.status,
                    mensalidade: parseFloat(turmaData.mensalidade),
                    capacidade: turmaData.capacidade,
                };

                setFormData(turmaFormData);
                setOriginalData({ ...turmaFormData });

                setSalas(salasData);
                setModalidades(modalidadesData);
                setProfessores(professoresData);
            } catch (error: any) {
                console.error("Erro ao carregar dados:", error);
                setMessage("Erro ao carregar dados da turma");
                setMessageType("error");
            } finally {
                setLoadingData(false);
            }
        };

        loadData();
    }, [turmaId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: name === 'sala_id' || name === 'modalidade_id' || name === 'professor1_id' ||
                name === 'professor2_id'
                ? (value ? Number(value) : undefined)
                : name === 'mensalidade'
                    ? Number(value)
                    : value
        }));

        if (message) {
            setMessage("");
        }
    };

    const hasChanges = () => {
        return JSON.stringify(formData) !== JSON.stringify(originalData);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.nome?.trim()) {
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

        if (formData.mensalidade && formData.mensalidade <= 0) {
            setMessage("Mensalidade deve ser maior que zero");
            setMessageType("error");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            // Envia todos os dados do formulário
            await updateTurma(turmaId, formData);

            setMessage("Turma atualizada com sucesso!");
            setMessageType("success");

            setTimeout(() => {
                navigate('/listTurmas');
            }, 1500);

        } catch (error: any) {
            setMessage(error.message || "Erro ao atualizar turma");
            setMessageType("error");
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        if (hasChanges()) {
            if (window.confirm("Deseja realmente voltar? As alterações não salvas serão perdidas.")) {
                navigate(-1);
            }
        } else {
            navigate(-1);
        }
    };

    const handleManageHorarios = () => {
        if (hasChanges()) {
            if (window.confirm("Existem alterações não salvas. Deseja salvá-las antes de gerenciar os horários?")) {
                // Salvar primeiro, depois navegar
                handleSubmit(new Event('submit') as any);
                return;
            }
        }
        navigate(`/updateturmashorarios/${turmaId}`);
    };

    if (loadingData) {
        return (
            <>
                <Header />
                <Container>
                    <Message success={true}><LoadingState /></Message>
                </Container>
            </>
        );
    }

    return (
        <>
            <Header />
            <Container>
                <DisplayFlex>
                    <Title>Editar Turma: {formData.nome}</Title>
                    <TopLine style={{ width: '70%' }}></TopLine>
                </DisplayFlex>

                <Form onSubmit={handleSubmit}>
                    <DisplayFlex>
                        <DisplayFlex style={{ flexDirection: 'column' }}>
                            <p style={{ marginBottom: '-0.5rem', marginLeft: '1.2rem', color: '#666' }}>Nome da turma:</p>
                            <Input
                                type="text"
                                name="nome"
                                placeholder="Nome da turma"
                                value={formData.nome || ""}
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
                                value={formData.status || "ativa"}
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
                                min="0"
                                step="0.01"
                            />
                        </DisplayFlex>
                    </DisplayFlex>

                    <DisplayFlex>
                        <BackButton type="button" onClick={handleBack} disabled={loading}>
                            Cancelar
                        </BackButton>

                        <Button
                            type="button"
                            onClick={handleManageHorarios}
                            style={{
                                backgroundColor: '#ee0c0cff',
                                marginRight: '10px'
                            }}
                        >
                            Gerenciar Horários
                        </Button>

                        <Button
                            type="submit"
                            disabled={loading}
                            style={{
                                opacity: loading ? 0.6 : 1
                            }}
                        >
                            {loading ? "Salvando..." : "Salvar"}
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

export default UpdateTurma;