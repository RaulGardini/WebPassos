import { useState } from "react";
import Header from "../../Header/header";
import { useNavigate } from "react-router-dom";
import {
    Container,
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

function AddAlunos() {
    const navigate = useNavigate();
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
    const [loading, setLoading] = useState<boolean>(false);

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

    // Função para validar CPF (opcional - melhora UX)
    const isValidCPF = (cpf: string) => {
        const cleanCPF = cpf.replace(/\D/g, "");
        
        if (cleanCPF.length !== 11) return false;
        
        // Verificar se todos os dígitos são iguais
        if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
        
        // Algoritmo de validação do CPF
        let sum = 0;
        let remainder;
        
        for (let i = 1; i <= 9; i++) {
            sum += parseInt(cleanCPF.substring(i - 1, i)) * (11 - i);
        }
        
        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cleanCPF.substring(9, 10))) return false;
        
        sum = 0;
        for (let i = 1; i <= 10; i++) {
            sum += parseInt(cleanCPF.substring(i - 1, i)) * (12 - i);
        }
        
        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cleanCPF.substring(10, 11))) return false;
        
        return true;
    };

    // Função para validar campos
    const validateFields = () => {
        const errors = [];

        if (!formData.nome.trim()) {
            errors.push("Nome é obrigatório");
        }

        if (!formData.email.trim()) {
            errors.push("E-mail é obrigatório");
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.push("E-mail inválido");
        }

        if (!formData.cpf.trim()) {
            errors.push("CPF é obrigatório");
        } else if (!isValidCPF(formData.cpf)) {
            errors.push("CPF inválido");
        }

        if (!formData.data_nascimento) {
            errors.push("Data de nascimento é obrigatória");
        } else {
            const birthDate = new Date(formData.data_nascimento);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            
            if (age < 0 || age > 120) {
                errors.push("Data de nascimento inválida");
            }
        }

        if (formData.cep && formData.cep.replace(/\D/g, "").length !== 8) {
            errors.push("CEP deve ter 8 dígitos");
        }

        if (formData.telefone && formData.telefone.replace(/\D/g, "").length < 10) {
            errors.push("Telefone deve ter pelo menos 10 dígitos");
        }

        return errors;
    };

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

        // Validar campos antes de enviar
        const validationErrors = validateFields();
        if (validationErrors.length > 0) {
            setSuccess(false);
            setMessage(validationErrors[0]); // Mostrar primeiro erro
            return;
        }

        setLoading(true);

        try {
            // Preparar dados para envio (remover formatação)
            const dataToSend = {
                nome: formData.nome.trim(),
                email: formData.email.trim(),
                cpf: formData.cpf.replace(/\D/g, ""),
                telefone: formData.telefone ? formData.telefone.replace(/\D/g, "") : undefined,
                sexo: formData.sexo || undefined,
                cep: formData.cep ? formData.cep.replace(/\D/g, "") : undefined,
                cidade: formData.cidade.trim() || undefined,
                endereco: formData.endereco.trim() || undefined,
                responsavel_financeiro: formData.responsavel_financeiro.trim() || undefined,
                data_nascimento: formData.data_nascimento ? new Date(formData.data_nascimento + 'T00:00:00.000Z') : undefined,
            };

            // Remover campos undefined ou vazios (exceto campos obrigatórios)
            Object.keys(dataToSend).forEach(key => {
                const value = dataToSend[key as keyof typeof dataToSend];
                if (value === undefined || value === "") {
                    delete dataToSend[key as keyof typeof dataToSend];
                }
            });

            console.log("Enviando dados:", dataToSend);

            const response = await fetch("http://localhost:3000/alunos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dataToSend),
            });

            const data = await response.json();

            if (!response.ok) {
                setSuccess(false);
                setMessage(data.message || "Erro ao cadastrar aluno");
            } else {
                setSuccess(true);
                setMessage("Aluno cadastrado com sucesso!");
                
                // Limpar formulário após sucesso
                setTimeout(() => {
                    setFormData({
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
                    setMessage(null);
                }, 2000);
            }
        } catch (error) {
            console.error("Erro ao cadastrar aluno:", error);
            setSuccess(false);
            setMessage("Erro de conexão com o servidor");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (Object.values(formData).some(value => value.trim() !== "")) {
            if (window.confirm("Deseja realmente cancelar? Os dados não salvos serão perdidos.")) {
                navigate("/listAlunos");
            }
        } else {
            navigate("/listAlunos");
        }
    };

    return (
        <>
            <Header />
            <Container>
                <DisplayFlex>
                    <Title>Novo Aluno</Title>
                    <TopLine style={{width: '83%'}}></TopLine>
                </DisplayFlex>
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
                        required
                    />
                    <DisplayFlex>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Salvando..." : "Salvar"}
                        </Button>
                        <BackButton 
                            type="button" 
                            onClick={handleCancel}
                            disabled={loading}
                        >
                            Cancelar
                        </BackButton>
                    </DisplayFlex>
                </Form>
                {message && <Message success={success}>{message}</Message>}
            </Container>
        </>
    );
}

export default AddAlunos;