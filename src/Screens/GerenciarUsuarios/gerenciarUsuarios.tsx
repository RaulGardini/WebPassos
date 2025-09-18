import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from "../../Header/header";
import { IoAdd } from "react-icons/io5";
import { MdEditSquare, MdDelete } from "react-icons/md";
import type { Usuario } from '../../Models/usuario';
import type { Colaborador } from '../../Models/colaborador';
import {
    Container,
    Title,
    DisplayFlex,
    TopLine,
    MidLine,
    FilterGrid,
    FilterGroup,
    FilterLabel,
    FilterInput,
    TableContainer,
    LoadingState,
    EmptyState,
    Table,
    TableHeader,
    TableHeaderCell,
    TableBody,
    TableRow,
    TableCell,
    ActionButtons,
    EditButton,
    BackButton,
    Button,
    Form,
    Select,
    EditInput,
    EditSelect,
    EditActions,
    FormTitle,
    Message,
    TipoBadge
} from "./style";
import { AddButton } from '../../ui/AddButton/style';

const GerenciarUsuarios = () => {
    // Estados principais
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
    const [loading, setLoading] = useState(true);
    const [aba, setAba] = useState<'usuarios' | 'criar'>('usuarios');

    // Estados para criar login
    const [colaboradorSelecionado, setColaboradorSelecionado] = useState('');
    const [senha, setSenha] = useState('');
    const [tipoNovoUsuario, setTipoNovoUsuario] = useState<'Professor' | 'Admin'>('Professor');

    // Estados para editar
    const [editandoId, setEditandoId] = useState<number | null>(null);
    const [editLogin, setEditLogin] = useState('');
    const [editNome, setEditNome] = useState('');
    const [editSenha, setEditSenha] = useState('');
    const [editTipo, setEditTipo] = useState<'Professor' | 'Admin'>('Professor');

    // Estados para mensagens
    const [mensagem, setMensagem] = useState('');
    const [tipoMensagem, setTipoMensagem] = useState('');

    const navigate = useNavigate();

    // Verificação de acesso e carregamento inicial
    useEffect(() => {
        const usuarioLogado = localStorage.getItem("usuario");
        if (!usuarioLogado) {
            navigate("/");
            return;
        }

        const dadosUsuario = JSON.parse(usuarioLogado);
        if (dadosUsuario.tipo !== 'Admin') {
            alert('Acesso negado! Apenas administradores podem gerenciar usuários.');
            navigate("/home");
            return;
        }

        carregarDados();
    }, [navigate]);

    // Função para carregar dados
    const carregarDados = async () => {
        try {
            setLoading(true);
            const [usuariosRes, colaboradoresRes] = await Promise.all([
                axios.get("http://localhost:3000/usuarios/"),
                axios.get("http://localhost:3000/colaboradores/")
            ]);

            setUsuarios(usuariosRes.data);
            setColaboradores(colaboradoresRes.data);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            mostrarMensagem('Erro ao carregar dados do sistema', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Função para mostrar mensagens
    const mostrarMensagem = (texto: string, tipo: string) => {
        setMensagem(texto);
        setTipoMensagem(tipo);
        setTimeout(() => setMensagem(''), 4000);
    };

    // Função para criar login
    const criarLogin = async () => {
        if (!colaboradorSelecionado || !senha) {
            mostrarMensagem('Por favor, selecione um colaborador e digite uma senha', 'error');
            return;
        }

        if (senha.length < 4) {
            mostrarMensagem('A senha deve ter pelo menos 4 caracteres', 'error');
            return;
        }

        try {
            await axios.post("http://localhost:3000/usuarios/criar-login-colaborador", {
                colaboradorId: parseInt(colaboradorSelecionado),
                senha,
                tipo: tipoNovoUsuario
            });

            setColaboradorSelecionado('');
            setSenha('');
            setTipoNovoUsuario('Professor');
            setAba('usuarios');
            carregarDados();
            mostrarMensagem('Login criado com sucesso!', 'success');
        } catch (error: any) {
            const mensagemErro = error.response?.data?.message || 'Erro ao criar login';
            mostrarMensagem(mensagemErro, 'error');
        }
    };

    // Função para iniciar edição
    const editarUsuario = (usuario: Usuario) => {
        setEditandoId(usuario.id);
        setEditLogin(usuario.login);
        setEditNome(usuario.nome);
        setEditSenha('');
        setEditTipo(usuario.tipo);
    };

    // Função para cancelar edição
    const cancelarEdicao = () => {
        setEditandoId(null);
        setEditLogin('');
        setEditNome('');
        setEditSenha('');
        setEditTipo('Professor');
    };

    // Função para salvar edição
    const salvarEdicao = async () => {
        if (!editandoId) return;

        try {
            const dados: any = {
                login: editLogin,
                nome: editNome,
                tipo: editTipo
            };

            if (editSenha) {
                dados.senha = editSenha;
            }

            await axios.put(`http://localhost:3000/usuarios/${editandoId}`, dados);

            setEditandoId(null);
            carregarDados();
            mostrarMensagem('Usuário atualizado com sucesso!', 'success');
        } catch (error: any) {
            const mensagemErro = error.response?.data?.message || 'Erro ao atualizar usuário';
            mostrarMensagem(mensagemErro, 'error');
        }
    };

    // Função para excluir usuário
    const excluirUsuario = async (id: number, login: string) => {
        if (!window.confirm(`Tem certeza que deseja excluir o usuário "${login}"?`)) {
            return;
        }

        try {
            await axios.delete(`http://localhost:3000/usuarios/${id}`);
            carregarDados();
            mostrarMensagem('Usuário excluído com sucesso!', 'success');
        } catch (error: any) {
            const mensagemErro = error.response?.data?.message || 'Erro ao excluir usuário';
            mostrarMensagem(mensagemErro, 'error');
        }
    };

    // Filtrar colaboradores que ainda não têm login
    const colaboradoresSemLogin = colaboradores.filter(colaborador =>
        !usuarios.some(usuario => usuario.nome === colaborador.nome)
    );

    return (
        <>
            <Header />
            <Container>
                <DisplayFlex>
                    <Title>Gerenciar Usuários</Title>
                    <TopLine />
                </DisplayFlex>
                
                <AddButton
                    active={aba === 'criar'}
                    onClick={() => setAba('criar')}
                >
                    <IoAdd />Novo
                </AddButton>
                
                <MidLine />

                {mensagem && (
                    <Message tipo={tipoMensagem}>
                        {mensagem}
                    </Message>
                )}

                <TableContainer>
                    {loading && (
                        <LoadingState>
                            Carregando dados do sistema...
                        </LoadingState>
                    )}

                    {!loading && aba === 'usuarios' && (
                        <>
                            {usuarios.length === 0 ? (
                                <EmptyState>
                                    Nenhum usuário encontrado
                                </EmptyState>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <tr>
                                            <TableHeaderCell>ID</TableHeaderCell>
                                            <TableHeaderCell>Login</TableHeaderCell>
                                            <TableHeaderCell>Nome</TableHeaderCell>
                                            <TableHeaderCell>Tipo</TableHeaderCell>
                                            <TableHeaderCell className="center">Ações</TableHeaderCell>
                                        </tr>
                                    </TableHeader>
                                    <TableBody>
                                        {usuarios.map((usuario, index) => (
                                            <TableRow key={usuario.id} index={index}>
                                                <TableCell>{usuario.id}</TableCell>
                                                <TableCell>
                                                    {editandoId === usuario.id ? (
                                                        <EditInput
                                                            value={editLogin}
                                                            onChange={(e) => setEditLogin(e.target.value)}
                                                            placeholder="Login"
                                                        />
                                                    ) : (
                                                        usuario.login
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {editandoId === usuario.id ? (
                                                        <EditInput
                                                            value={editNome}
                                                            onChange={(e) => setEditNome(e.target.value)}
                                                            placeholder="Nome"
                                                        />
                                                    ) : (
                                                        usuario.nome
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {editandoId === usuario.id ? (
                                                        <EditSelect
                                                            value={editTipo}
                                                            onChange={(e) => setEditTipo(e.target.value as 'Professor' | 'Admin')}
                                                        >
                                                            <option value="Professor">Professor</option>
                                                            <option value="Admin">Admin</option>
                                                        </EditSelect>
                                                    ) : (
                                                        <TipoBadge tipo={usuario.tipo}>
                                                            {usuario.tipo}
                                                        </TipoBadge>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {editandoId === usuario.id ? (
                                                        <EditActions>
                                                            <EditInput
                                                                type="password"
                                                                placeholder="Nova senha (opcional)"
                                                                value={editSenha}
                                                                onChange={(e) => setEditSenha(e.target.value)}
                                                            />
                                                            <ActionButtons>
                                                                <BackButton onClick={cancelarEdicao}>
                                                                    Cancelar
                                                                </BackButton>
                                                                <Button onClick={salvarEdicao}>
                                                                    Salvar
                                                                </Button>
                                                            </ActionButtons>
                                                        </EditActions>
                                                    ) : (
                                                        <ActionButtons>
                                                            <EditButton
                                                                onClick={() => editarUsuario(usuario)}
                                                                title="Editar usuário"
                                                            >
                                                                <MdEditSquare />
                                                            </EditButton>
                                                            <EditButton
                                                                onClick={() => excluirUsuario(usuario.id, usuario.login)}
                                                                title="Excluir usuário"
                                                            >
                                                                <MdDelete />
                                                            </EditButton>
                                                        </ActionButtons>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </>
                    )}

                    {!loading && aba === 'criar' && (
                        <Form>
                            {colaboradoresSemLogin.length === 0 ? (
                                <EmptyState>
                                    Todos os colaboradores já possuem login no sistema
                                </EmptyState>
                            ) : (
                                <FilterGrid>
                                    <FormTitle>Criar Login para Colaborador</FormTitle>
                                    <DisplayFlex style={{ gap: '1rem', flexWrap: 'wrap' }}>
                                        <FilterGroup>
                                            <FilterLabel>
                                                Colaborador
                                            </FilterLabel>
                                            <Select
                                                value={colaboradorSelecionado}
                                                onChange={(e) => setColaboradorSelecionado(e.target.value)}
                                            >
                                                <option value="">Selecione um colaborador...</option>
                                                {colaboradoresSemLogin.map(colaborador => (
                                                    <option key={colaborador.colaborador_id} value={colaborador.colaborador_id}>
                                                        {colaborador.nome} - {colaborador.email}
                                                    </option>
                                                ))}
                                            </Select>
                                        </FilterGroup>

                                        <FilterGroup>
                                            <FilterLabel>
                                                Tipo de Usuário
                                            </FilterLabel>
                                            <Select
                                                value={tipoNovoUsuario}
                                                onChange={(e) => setTipoNovoUsuario(e.target.value as 'Professor' | 'Admin')}
                                            >
                                                <option value="Professor">Professor</option>
                                                <option value="Admin">Admin</option>
                                            </Select>
                                        </FilterGroup>

                                        <FilterGroup>
                                            <FilterLabel>
                                                Senha
                                            </FilterLabel>
                                            <FilterInput
                                                type="password"
                                                value={senha}
                                                onChange={(e) => setSenha(e.target.value)}
                                                placeholder="Digite uma senha (mín. 4 caracteres)"
                                                minLength={4}
                                            />
                                        </FilterGroup>
                                    </DisplayFlex>
                                    
                                    <DisplayFlex style={{ marginLeft: '-1rem' }}>
                                        <BackButton
                                            onClick={() => setAba('usuarios')}
                                        >
                                            Cancelar
                                        </BackButton>
                                        <Button onClick={criarLogin}>
                                            Criar Login
                                        </Button>
                                    </DisplayFlex>
                                </FilterGrid>
                            )}
                        </Form>
                    )}
                </TableContainer>
            </Container>
        </>
    );
};

export default GerenciarUsuarios;