import { useState } from "react";
import Header from "../../Header/header";
import { useNavigate } from "react-router-dom";
import type { CreateFornecedorData } from "../../Models/fornecedor";
import { createFornecedor } from "../../services/fornecedorService";
import {
    Title,
    DisplayFlex,
    Form,
    Input,
    Button,
    Message,
    TopLine,
    MidLine,
    BackButton
} from "./style";
import { Container } from '../../ui/Container/style';

function AddFornecedores() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        telefone: "",
    });

    const [message, setMessage] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

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

        setLoading(true);

        try {
            // Preparar dados para envio (remover formatação)
            const dataToSend: CreateFornecedorData = {
                nome: formData.nome.trim(),
                email: formData.email.trim(),
                telefone: formData.telefone.trim()
            };

            console.log("Enviando dados:", dataToSend);

            await createFornecedor(dataToSend);
            
            setSuccess(true);
            setMessage("Fornecedor cadastrado com sucesso!");
            
            // Limpar formulário após sucesso
                navigate(`/listFornecedores`);
        } catch (error: any) {
            console.error("Erro ao cadastrar fornecedor:", error);
            setSuccess(false);
            
            // Tratar diferentes tipos de erro
            if (error.response?.data?.error) {
                setMessage(error.response.data.error);
            } else if (error.message) {
                setMessage(error.message);
            } else {
                setMessage("Erro ao cadastrar fornecedor");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (Object.values(formData).some(value => value.trim() !== "")) {
            if (window.confirm("Deseja realmente cancelar? Os dados não salvos serão perdidos.")) {
                navigate("/listFornecedores");
            }
        } else {
            navigate("/listFornecedores");
        }
    };

    return (
        <>
            <Header />
            <Container>
                <DisplayFlex>
                    <Title>Novo Fornecedor</Title>
                    <TopLine style={{width: '83%'}}></TopLine>
                </DisplayFlex>
                <Form onSubmit={handleSubmit}>
                    <DisplayFlex>
                        <Input
                            type="text"
                            name="nome"
                            placeholder="Nome do Fornecedor"
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
                        />
                        <Input
                            type="text"
                            name="telefone"
                            placeholder="Telefone ((00) 00000-0000)"
                            value={formData.telefone}
                            onChange={handleChange}
                            maxLength={15}
                        />
                    </DisplayFlex>
                    <MidLine></MidLine>
                    <DisplayFlex>
                        <BackButton 
                            type="button" 
                            onClick={handleCancel}
                            disabled={loading}
                        >
                            Cancelar
                        </BackButton>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Salvando..." : "Salvar"}
                        </Button>
                    </DisplayFlex>
                </Form>
                {message && <Message success={success}>{message}</Message>}
            </Container>
        </>
    );
}

export default AddFornecedores;