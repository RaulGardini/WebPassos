import { useState, useEffect } from "react";
import Header from "../../Header/header";
import { useNavigate, useParams } from "react-router-dom";
import { getCargos } from "../../services/cargoService";
import type { Cargo } from '../../Models/cargo';
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

function UpdateColaborador() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [cargos, setCargos] = useState<Cargo[]>([]);
    
    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        cpf: "",
        telefone: "",
        sexo: "",
        data_nascimento: "",
        cargo_id: "",
    });

    const [message, setMessage] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingUpdate, setLoadingUpdate] = useState<boolean>(false);

    // Carregar cargos ao montar o componente
    useEffect(() => {
        const fetchCargos = async () => {
            try {
                const cargosData = await getCargos();
                setCargos(cargosData);
            } catch (error) {
                console.error("Erro ao carregar cargos:", error);
            }
        };
        
        fetchCargos();
    }, []);

    // Funções de formatação
    const formatCPF = (value: string) => {
        const cleanValue = value.replace(/\D/g, "");
        if (cleanValue.length <= 11) {
            return cleanValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
        }
        return cleanValue.substring(0, 11).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
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

    // Buscar dados do colaborador ao carregar o componente
    useEffect(() => {
        const fetchColaborador = async () => {
            if (!id) {
                console.error("ID do colaborador não encontrado");
                setMessage("ID do colaborador não encontrado");
                setSuccess(false);
                setLoading(false);
                return;
            }

            console.log("Buscando colaborador com ID:", id);

            try {
                const response = await fetch(`http://localhost:3000/colaboradores/${id}`);
                
                console.log("Status da resposta:", response.status);

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.error || `Erro HTTP ${response.status}`);
                }

                const colaborador = await response.json();
                console.log("Dados do colaborador recebidos:", colaborador);
                
                // Preencher o formulário com os dados do colaborador (aplicando formatação)
                setFormData({
                    nome: colaborador.nome || "",
                    email: colaborador.email || "",
                    cpf: colaborador.cpf ? formatCPF(colaborador.cpf) : "",
                    telefone: colaborador.telefone ? formatPhone(colaborador.telefone) : "",
                    sexo: colaborador.sexo || "",
                    data_nascimento: formatDateForInput(colaborador.data_nascimento) || "",
                    cargo_id: colaborador.cargo_id ? colaborador.cargo_id.toString() : "",
                });
                
                setMessage(null);
                setSuccess(false);
                
            } catch (error: any) {
                console.error("Erro ao buscar colaborador:", error);
                setMessage(error.message || "Erro ao carregar dados do colaborador");
                setSuccess(false);
            } finally {
                setLoading(false);
            }
        };

        fetchColaborador();
    }, [id]);

    // Função para validar CPF básico (apenas tamanho)
    const isValidCPFLength = (cpf: string) => {
        const cleanCPF = cpf.replace(/\D/g, "");
        return cleanCPF.length === 11;
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
        } else if (!isValidCPFLength(formData.cpf)) {
            errors.push("CPF deve ter 11 dígitos");
        }

        if (!formData.data_nascimento) {
            errors.push("Data de nascimento é obrigatória");
        } else {
            const birthDate = new Date(formData.data_nascimento);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            
            if (age < 16 || age > 80) {
                errors.push("Idade deve estar entre 16 e 80 anos");
            }
        }

        if (!formData.cargo_id) {
            errors.push("Cargo é obrigatório");
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
        } else if (name === "telefone") {
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

        // Validar campos antes de enviar
        const validationErrors = validateFields();
        if (validationErrors.length > 0) {
            setSuccess(false);
            setMessage(validationErrors[0]);
            return;
        }

        setLoadingUpdate(true);

        try {
            // Preparar dados para envio (remover formatação)
            const dataToSend = {
                nome: formData.nome.trim(),
                email: formData.email.trim(),
                cpf: formData.cpf.replace(/\D/g, ""),
                telefone: formData.telefone ? formData.telefone.replace(/\D/g, "") : undefined,
                sexo: formData.sexo || undefined,
                data_nascimento: new Date(formData.data_nascimento + 'T00:00:00.000Z'),
                cargo_id: parseInt(formData.cargo_id),
            };

            // Remover campos undefined
            Object.keys(dataToSend).forEach(key => {
                const value = dataToSend[key as keyof typeof dataToSend];
                if (value === undefined) {
                    delete dataToSend[key as keyof typeof dataToSend];
                }
            });

            console.log("Enviando dados:", dataToSend);

            const response = await fetch(`http://localhost:3000/colaboradores/${id}`, {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataToSend),
            });

            const data = await response.json();
            console.log("Resposta da API:", data);

            if (!response.ok) {
                setSuccess(false);
                setMessage(data.error || "Erro ao atualizar colaborador");
            } else {
                setSuccess(true);
                setMessage("Colaborador atualizado com sucesso!");
                
                // Redirecionar após sucesso
                setTimeout(() => {
                    navigate("/listColaboradores");
                }, 1500);
            }
        } catch (error: any) {
            console.error("Erro ao atualizar colaborador:", error);
            setSuccess(false);
            setMessage("Erro de conexão com o servidor");
        } finally {
            setLoadingUpdate(false);
        }
    };

    const handleCancel = () => {
        navigate("/listColaboradores");
    };

    // Debug: mostrar estado atual
    console.log("Estado atual - Loading:", loading, "Message:", message, "FormData:", formData);

    return (
        <>
            <Header />
            <Container>
                <DisplayFlex>
                    <Title>
                        {loading ? "Carregando..." : "Editar Colaborador"}
                    </Title>
                    <TopLine style={{width: '80%'}}></TopLine>
                </DisplayFlex>
                
                {loading ? (
                    <Message success={true}>Carregando dados do colaborador...</Message>
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
                                placeholder="Nome Completo"
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
                        <DisplayFlex>
                            <Input
                                type="text"
                                name="telefone"
                                placeholder="Telefone ((00) 00000-0000)"
                                value={formData.telefone}
                                onChange={handleChange}
                                maxLength={15}
                            />
                            <Select name="sexo" value={formData.sexo} onChange={handleChange}>
                                <option value="">Selecione o sexo</option>
                                <option value="M">Masculino</option>
                                <option value="F">Feminino</option>
                            </Select>
                            <Select 
                                name="cargo_id" 
                                value={formData.cargo_id} 
                                onChange={handleChange}
                                required
                            >
                                <option value="">Selecione um cargo</option>
                                {cargos.map((cargo) => (
                                    <option key={cargo.cargo_id} value={cargo.cargo_id.toString()}>
                                        {cargo.nome_cargo}
                                    </option>
                                ))}
                            </Select>
                        </DisplayFlex>
                        <MidLine></MidLine>
                        <Input
                            type="date"
                            name="data_nascimento"
                            placeholder="Data de Nascimento"
                            value={formData.data_nascimento}
                            onChange={handleChange}
                            required
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

export default UpdateColaborador;