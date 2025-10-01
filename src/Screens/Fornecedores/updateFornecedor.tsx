import { useState, useEffect } from "react";
import Header from "../../Header/header";
import { useNavigate, useParams } from "react-router-dom";
import type { UpdateFornecedorData } from "../../Models/fornecedor";
import { getFornecedorById, updateFornecedor } from "../../services/fornecedorService";
import {
    Title,
    DisplayFlex,
    Form,
    Input,
    Button,
    Message,
    TopLine,
    BackButton
} from "./style";
import { LoadingState } from "../../ui/Loading/style";
import { Container } from '../../ui/Container/style';

function UpdateFornecedores() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        telefone: "",
    });

    const [message, setMessage] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingUpdate, setLoadingUpdate] = useState<boolean>(false);

    // Função de formatação de telefone
    const formatPhone = (value: string) => {
        const cleanValue = value.replace(/\D/g, "");
        if (cleanValue.length <= 10) {
            return cleanValue.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
        } else if (cleanValue.length === 11) {
            return cleanValue.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
        }
        return cleanValue.substring(0, 11).replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    };

    // Buscar dados do fornecedor ao carregar o componente
    useEffect(() => {
        const fetchFornecedor = async () => {
            if (!id) {
                console.error("ID do fornecedor não encontrado");
                setMessage("ID do fornecedor não encontrado");
                setSuccess(false);
                setLoading(false);
                return;
            }

            console.log("Buscando fornecedor com ID:", id);

            try {
                const fornecedor = await getFornecedorById(parseInt(id));
                console.log("Dados do fornecedor recebidos:", fornecedor);

                // Preencher o formulário com os dados do fornecedor (aplicando formatação)
                setFormData({
                    nome: fornecedor.nome || "",
                    email: fornecedor.email || "",
                    telefone: fornecedor.telefone ? formatPhone(fornecedor.telefone) : "",
                });

                setMessage(null);
                setSuccess(false);

            } catch (error: any) {
                console.error("Erro ao buscar fornecedor:", error);

                // Tratamento de erros do axios
                if (error.response) {
                    const errorMessage = error.response.data?.message ||
                        error.response.data?.error ||
                        "Erro ao carregar dados do fornecedor";
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

        fetchFornecedor();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let formattedValue = value;

        // Aplicar formatação específica
        if (name === "telefone") {
            formattedValue = formatPhone(value);
        } else if (name === "nome") {
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
                throw new Error("ID do fornecedor não encontrado");
            }

            // Preparar dados para envio (remover formatação)
            const dataToSend: UpdateFornecedorData = {
                nome: formData.nome.trim(),
                email: formData.email.trim(),
                telefone: formData.telefone.trim()
            };

            // Remover campos undefined ou vazios (exceto nome que é obrigatório)
            Object.keys(dataToSend).forEach(key => {
                const value = dataToSend[key as keyof UpdateFornecedorData];
                if (value === undefined || value === "" || value === null) {
                    delete dataToSend[key as keyof UpdateFornecedorData];
                }
            });

            console.log("Enviando dados:", dataToSend);

            // Usar o service em vez de fetch direto
            const result = await updateFornecedor(parseInt(id), dataToSend);
            console.log("Resposta da API:", result);

            setSuccess(true);
            setMessage("Fornecedor atualizado com sucesso!");

            // Redirecionar após sucesso
            setTimeout(() => {
                navigate("/listFornecedores");
            }, 1500);

        } catch (error: any) {
            console.error("Erro ao atualizar fornecedor:", error);
            setSuccess(false);

            // Tratamento de erros do axios
            if (error.response) {
                const errorMessage = error.response.data?.message ||
                    error.response.data?.error ||
                    "Erro ao atualizar fornecedor";
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
        navigate("/listFornecedores");
    };

    // Debug: mostrar estado atual
    console.log("Estado atual - Loading:", loading, "Message:", message, "FormData:", formData);

    return (
        <>
            <Header />
            <Container>
                <DisplayFlex>
                    <Title>
                        {loading ? "Carregando..." : "Editar Fornecedor"}
                    </Title>
                    <TopLine style={{ width: '83%' }}></TopLine>
                </DisplayFlex>

                {loading ? (
                    <Message success={true}><LoadingState /></Message>
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
                            <DisplayFlex style={{ flexDirection: 'column' }}>
                                <p style={{ marginBottom: '-0.5rem', marginLeft: '1.2rem', color: '#666' }}>Nome do fornecedor</p>
                                <Input
                                    type="text"
                                    name="nome"
                                    placeholder="Nome do Fornecedor"
                                    value={formData.nome}
                                    onChange={handleChange}
                                    required
                                />
                            </DisplayFlex>
                            <DisplayFlex style={{ flexDirection: 'column' }}>
                                <p style={{ marginBottom: '-0.5rem', marginLeft: '1.2rem', color: '#666' }}>Email do fornecedor</p>
                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="E-mail"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </DisplayFlex>
                            <DisplayFlex style={{ flexDirection: 'column' }}>
                                <p style={{ marginBottom: '-0.5rem', marginLeft: '1.2rem', color: '#666' }}>Telefone do fornecedor</p>
                                <Input
                                    type="text"
                                    name="telefone"
                                    placeholder="(00) 00000-0000"
                                    value={formData.telefone}
                                    onChange={handleChange}
                                    maxLength={15}
                                />
                            </DisplayFlex>
                        </DisplayFlex>
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

export default UpdateFornecedores;