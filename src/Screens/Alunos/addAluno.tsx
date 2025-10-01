import { useState } from "react";
import Header from "../../Header/header";
import { useNavigate } from "react-router-dom";
import { createAluno } from "../../services/alunoService";
import type { CreateAlunoData } from "../../Models/aluno";
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
import { validateCPF } from "../../ui/ValidCPF/validateCPF"
import { Container } from '../../ui/Container/style';

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
    const [valido, setValido] = useState<boolean | null>(null);

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

    // Função para validar campos
    const validateFields = () => {
        const errors = [];

        if (!formData.nome.trim()) {
            errors.push("Nome é obrigatório");
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

        if (name === "cpf") {
            formattedValue = formatCPF(value);
            const cleanCPF = value.replace(/\D/g, '');
            if (cleanCPF.length === 11) {
                setValido(validateCPF(value));
            } else {
                setValido(null);
            }
        } else if (name === "cep") {
            formattedValue = formatCEP(value);
        } else if (name === "telefone") {
            formattedValue = formatPhone(value);
        } else if (name === "nome" || name === "cidade" || name === "responsavel_financeiro") {
            formattedValue = value
                .toLowerCase()
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        } else if (name === "email") {
            formattedValue = value.toLowerCase();
        }

        setFormData(prev => ({ ...prev, [name]: formattedValue }));

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
            const dataToSend: CreateAlunoData = {
                nome: formData.nome.trim(),
                email: formData.email.trim() || undefined,
                cpf: formData.cpf ? formData.cpf.replace(/\D/g, "") : undefined,
                telefone: formData.telefone ? formData.telefone.replace(/\D/g, "") : undefined,
                sexo: formData.sexo ? (formData.sexo as "M" | "F") : undefined,
                cep: formData.cep ? formData.cep.replace(/\D/g, "") : undefined,
                cidade: formData.cidade.trim() || undefined,
                endereco: formData.endereco.trim() || undefined,
                responsavel_financeiro: formData.responsavel_financeiro.trim() || undefined,
                data_nascimento: new Date(formData.data_nascimento + 'T00:00:00.000Z'),
            };

            // Remover campos undefined ou vazios (exceto campos obrigatórios)
            Object.keys(dataToSend).forEach(key => {
                const value = dataToSend[key as keyof CreateAlunoData];
                if (value === undefined || value === "") {
                    delete dataToSend[key as keyof CreateAlunoData];
                }
            });

            console.log("Enviando dados:", dataToSend);

            // Usar o service em vez de fetch direto
            await createAluno(dataToSend);

            setSuccess(true);
            setMessage("Aluno cadastrado com sucesso!");

            setTimeout(() => {
                navigate(`/listAlunos`);
            }, 1000);

        } catch (error: any) {
            console.error("Erro ao cadastrar aluno:", error);
            setSuccess(false);

            // Tratar diferentes tipos de erro do axios
            if (error.response) {
                // Erro de resposta da API
                const errorMessage = error.response.data?.message ||
                    error.response.data?.error ||
                    "Erro ao cadastrar aluno";
                setMessage(errorMessage);
            } else if (error.request) {
                // Erro de conexão
                setMessage("Erro de conexão com o servidor");
            } else {
                // Outros erros
                setMessage("Erro inesperado");
            }
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
                    <TopLine style={{ width: '83%' }}></TopLine>
                </DisplayFlex>
                <Form onSubmit={handleSubmit}>
                    <DisplayFlex>
                        <DisplayFlex style={{ flexDirection: 'column' }}>
                            <p style={{ marginBottom: '-0.5rem', marginLeft: '1.2rem', color: '#666' }}>Nome do aluno(a)</p>
                            <Input
                                type="text"
                                name="nome"
                                placeholder="Nome"
                                value={formData.nome}
                                onChange={handleChange}
                                required
                            />
                        </DisplayFlex>
                        <DisplayFlex style={{ flexDirection: 'column' }}>
                            <p style={{ marginBottom: '-0.5rem', marginLeft: '1.2rem', color: '#666' }}>Email do responsável</p>
                            <Input
                                type="email"
                                name="email"
                                placeholder="E-mail"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </DisplayFlex>
                        <DisplayFlex style={{ flexDirection: 'column' }}>
                            <p style={{ marginBottom: '-0.5rem', marginLeft: '1.2rem', color: '#666' }}>CPF do responsável</p>
                            <Input
                                type="text"
                                name="cpf"
                                placeholder="000.000.000-00"
                                value={formData.cpf}
                                onChange={handleChange}
                                maxLength={14}
                            />
                        </DisplayFlex>
                        {valido === true && (
                            <div style={{ marginTop: '3rem', color: '#7bff61ff' }}>
                                ✓ CPF válido
                            </div>
                        )}

                        {valido === false && (
                            <div style={{ marginTop: '3rem', color: '#ff4343ff' }}>
                                ✗ CPF inválido
                            </div>
                        )}
                    </DisplayFlex>
                    <DisplayFlex style={{ flexDirection: 'column' }}>
                        <p style={{ marginBottom: '-0.5rem', marginLeft: '1.2rem', color: '#666' }}>Telefone do responsável</p>
                        <Input
                            type="text"
                            name="telefone"
                            placeholder="(00) 00000-0000"
                            value={formData.telefone}
                            onChange={handleChange}
                            maxLength={15}
                        />
                    </DisplayFlex>
                    <MidLine></MidLine>
                    <DisplayFlex>
                        <DisplayFlex style={{ flexDirection: 'column' }}>
                            <p style={{ marginBottom: '-0.5rem', marginLeft: '1.2rem', color: '#666' }}>Sexo do aluno(a)</p>
                            <Select name="sexo" value={formData.sexo} onChange={handleChange}>
                                <option value="">Selecione o sexo</option>
                                <option value="M">Masculino</option>
                                <option value="F">Feminino</option>
                            </Select>
                        </DisplayFlex>
                        <DisplayFlex style={{ flexDirection: 'column' }}>
                            <p style={{ marginBottom: '-0.5rem', marginLeft: '1.2rem', color: '#666' }}>CEP do aluno(a)</p>
                            <Input
                                type="text"
                                name="cep"
                                placeholder="00000-000"
                                value={formData.cep}
                                onChange={handleChange}
                                maxLength={9}
                            />
                        </DisplayFlex>
                        <DisplayFlex style={{ flexDirection: 'column' }}>
                            <p style={{ marginBottom: '-0.5rem', marginLeft: '1.2rem', color: '#666' }}>Cidade do aluno(a)</p>
                            <Input
                                type="text"
                                name="cidade"
                                placeholder="Cidade"
                                value={formData.cidade}
                                onChange={handleChange}
                            />
                        </DisplayFlex>
                        <DisplayFlex style={{ flexDirection: 'column' }}>
                            <p style={{ marginBottom: '-0.5rem', marginLeft: '1.2rem', color: '#666' }}>Endereço do aluno(a)</p>
                            <Input
                                type="text"
                                name="endereco"
                                placeholder="Endereço"
                                value={formData.endereco}
                                onChange={handleChange}
                            />
                        </DisplayFlex>
                        <DisplayFlex style={{ flexDirection: 'column' }}>
                            <p style={{ marginBottom: '-0.5rem', marginLeft: '1.2rem', color: '#666' }}>Responsável Financeiro</p>
                            <Input
                                type="text"
                                name="responsavel_financeiro"
                                placeholder="Responsável financeiro"
                                value={formData.responsavel_financeiro}
                                onChange={handleChange}
                            />
                        </DisplayFlex>
                    </DisplayFlex>
                    <DisplayFlex style={{ flexDirection: 'column' }}>
                        <p style={{ marginBottom: '-0.5rem', marginLeft: '1.2rem', color: '#666' }}>Data de nascimento do aluno(a)</p>
                        <Input
                            type="date"
                            name="data_nascimento"
                            placeholder="Data de Nascimento"
                            value={formData.data_nascimento}
                            onChange={handleChange}
                            required
                        />
                    </DisplayFlex>
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

export default AddAlunos;