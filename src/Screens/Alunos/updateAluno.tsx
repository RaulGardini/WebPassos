import { useState, useEffect } from "react";
import Header from "../../Header/header";
import { useNavigate, useParams } from "react-router-dom";
import { getAlunoById, updateAluno } from "../../services/alunoService";
import type { UpdateAlunoData } from "../../Models/aluno";
import {
    Title,
    DisplayFlex,
    Form,
    Input,
    Select,
    Button,
    Message,
    TopLine,
    MidLine,
    BackButton
} from "./style";
import { Container } from '../../ui/Container/style';

function UpdateAlunos() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    
    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        cpf: "",
        telefone: "",
        sexo: "",
        cep: "",
        cidade: "",
        endereco: "",
        responsavel_financeiro: "",
        data_nascimento: "",
    });

    const [message, setMessage] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingUpdate, setLoadingUpdate] = useState<boolean>(false);

    // Funções de formatação
    const formatCPF = (value: string) => {
        const cleanValue = value.replace(/\D/g, "");
        if (cleanValue.length <= 11) {
            return cleanValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
        }
        return cleanValue.substring(0, 11).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    };

    const formatCEP = (value: string) => {
        const cleanValue = value.replace(/\D/g, "");
        if (cleanValue.length <= 8) {
            return cleanValue.replace(/(\d{5})(\d{3})/, "$1-$2");
        }
        return cleanValue.substring(0, 8).replace(/(\d{5})(\d{3})/, "$1-$2");
    };

    const formatPhone = (value: string) => {
        const cleanValue = value.replace(/\D/g, "");
        if (cleanValue.length <= 10) {
            return cleanValue.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
        } else if (cleanValue.length === 11) {
            return cleanValue.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
        }
        return cleanValue.substring(0, 11).replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    };

    // Função para formatar data para input date
    const formatDateForInput = (dateString: string) => {
        if (!dateString) return "";
        try {
            const date = new Date(dateString);
            // Verificar se a data é válida
            if (isNaN(date.getTime())) return "";
            return date.toISOString().split('T')[0];
        } catch (error) {
            console.error("Erro ao formatar data:", error);
            return "";
        }
    };

    // Buscar dados do aluno ao carregar o componente
    useEffect(() => {
        const fetchAluno = async () => {
            if (!id) {
                console.error("ID do aluno não encontrado");
                setMessage("ID do aluno não encontrado");
                setSuccess(false);
                setLoading(false);
                return;
            }

            console.log("Buscando aluno com ID:", id);

            try {
                const aluno = await getAlunoById(parseInt(id));
                console.log("Dados do aluno recebidos:", aluno);
                
                // Preencher o formulário com os dados do aluno (aplicando formatação)
                setFormData({
                    nome: aluno.nome || "",
                    email: aluno.email || "",
                    cpf: aluno.cpf ? formatCPF(aluno.cpf) : "",
                    telefone: aluno.telefone ? formatPhone(aluno.telefone) : "",
                    sexo: aluno.sexo || "",
                    cep: aluno.cep ? formatCEP(aluno.cep) : "",
                    cidade: aluno.cidade || "",
                    endereco: aluno.endereco || "",
                    responsavel_financeiro: aluno.responsavel_financeiro || "",
                    data_nascimento: aluno.data_nascimento ? formatDateForInput(aluno.data_nascimento) : "",
                });
                
                setMessage(null);
                setSuccess(false);
                
            } catch (error: any) {
                console.error("Erro ao buscar aluno:", error);
                
                // Tratamento de erros do axios
                if (error.response) {
                    const errorMessage = error.response.data?.message || 
                                       error.response.data?.error || 
                                       "Erro ao carregar dados do aluno";
                    setMessage(errorMessage);
                } else if (error.request) {
                    setMessage("Erro de conexão com o servidor");
                } else {
                    setMessage("Erro inesperado ao carregar dados");
                }
                setSuccess(false);
            } finally {
                setLoading(false);
            }
        };

        fetchAluno();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        let formattedValue = value;

        // Aplicar formatação específica
        if (name === "cpf") {
            formattedValue = formatCPF(value);
        } else if (name === "cep") {
            formattedValue = formatCEP(value);
        } else if (name === "telefone") {
            formattedValue = formatPhone(value);
        } else if (name === "nome" || name === "cidade" || name === "responsavel_financeiro") {
            // Capitalizar primeira letra de cada palavra
            formattedValue = value
                .toLowerCase()
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        } else if (name === "email") {
            // Manter email em minúsculas
            formattedValue = value.toLowerCase();
        }

        setFormData(prev => ({ ...prev, [name]: formattedValue }));
        
        // Limpar mensagem quando o usuário começar a digitar
        if (message) {
            setMessage(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setLoadingUpdate(true);

        try {
            if (!id) {
                throw new Error("ID do aluno não encontrado");
            }

            // Preparar dados para envio (remover formatação)
            const dataToSend: UpdateAlunoData = {
                nome: formData.nome.trim(),
                email: formData.email.trim(),
                cpf: formData.cpf.replace(/\D/g, ""),
                telefone: formData.telefone ? formData.telefone.replace(/\D/g, "") : undefined,
                sexo: formData.sexo ? (formData.sexo as "M" | "F") : undefined,
                cep: formData.cep ? formData.cep.replace(/\D/g, "") : undefined,
                cidade: formData.cidade.trim() || undefined,
                endereco: formData.endereco.trim() || undefined,
                responsavel_financeiro: formData.responsavel_financeiro.trim() || undefined,
                data_nascimento: formData.data_nascimento ? new Date(formData.data_nascimento + 'T00:00:00.000Z') : undefined,
            };

            // Remover campos undefined ou vazios
            Object.keys(dataToSend).forEach(key => {
                const value = dataToSend[key as keyof UpdateAlunoData];
                if (value === undefined || value === "" || value === null) {
                    delete dataToSend[key as keyof UpdateAlunoData];
                }
            });

            console.log("Enviando dados:", dataToSend);

            // Usar o service em vez de fetch direto
            const result = await updateAluno(parseInt(id), dataToSend);
            console.log("Resposta da API:", result);

            setSuccess(true);
            setMessage("Aluno atualizado com sucesso!");
            
            // Redirecionar após sucesso
            setTimeout(() => {
                navigate("/listAlunos");
            }, 1500);

        } catch (error: any) {
            console.error("Erro ao atualizar aluno:", error);
            setSuccess(false);
            
            // Tratamento de erros do axios
            if (error.response) {
                const errorMessage = error.response.data?.message || 
                                   error.response.data?.error || 
                                   "Erro ao atualizar aluno";
                setMessage(errorMessage);
            } else if (error.request) {
                setMessage("Erro de conexão com o servidor");
            } else {
                setMessage("Erro inesperado");
            }
        } finally {
            setLoadingUpdate(false);
        }
    };

    const handleCancel = () => {
        navigate("/listAlunos");
    };

    // Debug: mostrar estado atual
    console.log("Estado atual - Loading:", loading, "Message:", message, "FormData:", formData);

    return (
        <>
            <Header />
            <Container>
                <DisplayFlex>
                    <Title>
                        {loading ? "Carregando..." : "Editar Aluno"}
                    </Title>
                    <TopLine style={{width: '80%'}}></TopLine>
                </DisplayFlex>
                
                {loading ? (
                    <Message success={true}>Carregando dados do aluno...</Message>
                ) : message && !success ? (
                    // Mostrar erro se houver
                    <>
                        <Message success={false}>{message}</Message>
                        <DisplayFlex>
                            <BackButton 
                                type="button" 
                                onClick={handleCancel}
                            >
                                Voltar
                            </BackButton>
                        </DisplayFlex>
                    </>
                ) : (
                    // Mostrar formulário se não há erro
                    <Form onSubmit={handleSubmit}>
                        <DisplayFlex>
                            <Input
                                type="text"
                                name="nome"
                                placeholder="Nome"
                                value={formData.nome}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                type="email"
                                name="email"
                                placeholder="E-mail"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                type="text"
                                name="cpf"
                                placeholder="CPF (000.000.000-00)"
                                value={formData.cpf}
                                onChange={handleChange}
                                maxLength={14}
                                required
                            />
                        </DisplayFlex>
                        <Input
                            type="text"
                            name="telefone"
                            placeholder="Telefone ((00) 00000-0000)"
                            value={formData.telefone}
                            onChange={handleChange}
                            maxLength={15}
                        />
                        <MidLine></MidLine>
                        <Select name="sexo" value={formData.sexo} onChange={handleChange}>
                            <option value="">Selecione o sexo</option>
                            <option value="M">Masculino</option>
                            <option value="F">Feminino</option>
                        </Select>
                        <Input
                            type="text"
                            name="cep"
                            placeholder="CEP (00000-000)"
                            value={formData.cep}
                            onChange={handleChange}
                            maxLength={9}
                        />
                        <Input
                            type="text"
                            name="cidade"
                            placeholder="Cidade"
                            value={formData.cidade}
                            onChange={handleChange}
                        />
                        <Input
                            type="text"
                            name="endereco"
                            placeholder="Endereço"
                            value={formData.endereco}
                            onChange={handleChange}
                        />
                        <Input
                            type="text"
                            name="responsavel_financeiro"
                            placeholder="Responsável financeiro"
                            value={formData.responsavel_financeiro}
                            onChange={handleChange}
                        />
                        <Input
                            type="date"
                            name="data_nascimento"
                            placeholder="Data de Nascimento"
                            value={formData.data_nascimento}
                            onChange={handleChange}
                        />
                        <DisplayFlex>
                            <BackButton 
                                type="button" 
                                onClick={handleCancel}
                                disabled={loadingUpdate}
                            >
                                Cancelar
                            </BackButton>
                            <Button type="submit" disabled={loadingUpdate}>
                                {loadingUpdate ? "Atualizando..." : "Atualizar"}
                            </Button>
                        </DisplayFlex>
                        {message && <Message success={success}>{message}</Message>}
                    </Form>
                )}
            </Container>
        </>
    );
}

export default UpdateAlunos;