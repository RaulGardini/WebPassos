import { useState, useEffect } from "react";
import Header from "../../Header/header";
import type { Colaborador, ColaboradorFilters } from "../../Models/colaborador";
import { IoAdd } from "react-icons/io5";
import { FiSearch, FiX, FiUser, FiMail, FiUsers, FiHash } from "react-icons/fi";
import { MdEditSquare, MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { FaEye, FaVenusMars } from "react-icons/fa";
import { getCargos } from "../../services/cargoService";
import { getColaboradores, deleteColaborador } from "../../services/colaboradorService";
import type { Cargo } from '../../Models/cargo';
import {
    Container,
    Title,
    DisplayFlex,
    TopLine,
    MidLine,
    FilterContainer,
    FilterGrid,
    FilterGroup,
    FilterLabel,
    FilterInput,
    FilterActions,
    FilterButton,
    TableContainer,
    LoadingState,
    ErrorState,
    EmptyState,
    Table,
    TableHeader,
    TableHeaderCell,
    TableBody,
    TableRow,
    TableCell,
    ActionButtons,
    ClearButton,
    EditButton,
    Modal,
    InfoModal
} from "./style";
import { AddButton } from '../../ui/AddButton/style';

function ListColaboradores() {
    const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [cargos, setCargos] = useState<Cargo[]>([]);
    const [filters, setFilters] = useState<ColaboradorFilters>({
        nome: '',
        email: '',
        cpf: '',
        sexo: '',
        cargo_id: ''
    });
    const [selectedColaborador, setSelectedColaborador] = useState<Colaborador | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        getCargos().then(setCargos);
    }, []);

    const openColaboradorModal = (colaborador: Colaborador) => {
        setSelectedColaborador(colaborador);
        setIsModalOpen(true);
    };

    const closeColaboradorModal = () => {
        setSelectedColaborador(null);
        setIsModalOpen(false);
    };

    // Função para buscar colaboradores usando o service
    const fetchColaboradores = async (searchFilters?: ColaboradorFilters) => {
        try {
            setLoading(true);
            const data = await getColaboradores(searchFilters);
            setColaboradores(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
        } finally {
            setLoading(false);
        }
    };

    // Carregar colaboradores ao montar o componente
    useEffect(() => {
        fetchColaboradores();
    }, []);

    // Função para lidar com mudanças nos filtros
    const handleFilterChange = (field: keyof ColaboradorFilters, value: string) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Função para aplicar filtros
    const applyFilters = () => {
        fetchColaboradores(filters);
    };

    // Função para limpar filtros
    const clearFilters = () => {
        const emptyFilters = {
            nome: '',
            email: '',
            cpf: '',
            sexo: '',
            cargo_id: ''
        };
        setFilters(emptyFilters);
        fetchColaboradores(); // Busca todos os colaboradores novamente
    };

    // Função para formatar CPF
    const formatCpf = (cpf: string) => {
        if (!cpf) return '';
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    };

    // Função para formatar telefone
    const formatTelefone = (telefone: string) => {
        if (!telefone) return '';
        const clean = telefone.replace(/\D/g, '');
        if (clean.length === 11) {
            return clean.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        }
        if (clean.length === 10) {
            return clean.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        }
        return telefone;
    };

    // Função para formatar sexo
    const formatSexo = (sexo?: string) => {
        if (!sexo) return '';
        return sexo === 'M' ? 'Masculino' : 'Feminino';
    };

    const handleDelete = async (colaborador_id: number) => {
        if (!window.confirm("Tem certeza que deseja deletar este colaborador?")) return;

        try {
            await deleteColaborador(colaborador_id);
            alert("Colaborador deletado com sucesso!");
            setColaboradores((prev) => prev.filter((colaborador) => colaborador.colaborador_id !== colaborador_id));
        } catch (error) {
            alert(error instanceof Error ? error.message : "Erro ao deletar colaborador");
        }
    };

    const calcularIdade = (dateString: string) => {
        if (!dateString) return '';
        const hoje = new Date();
        const nascimento = new Date(dateString);
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const m = hoje.getMonth() - nascimento.getMonth();
        if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
            idade--;
        }
        return `${idade} anos`;
    };

    const formatDataCriacao = (dataString?: string) => {
        if (!dataString) return '';
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR');
    };

    return (
        <>
            <Header />
            <Container>
                <DisplayFlex>
                    <Title>Colaboradores</Title>
                    <TopLine></TopLine>
                </DisplayFlex>
                <AddButton onClick={() => navigate("/addColaboradores")}><IoAdd />Novo</AddButton>
                <MidLine></MidLine>

                {/* Filtros */}
                <FilterContainer>
                    <FilterGrid>
                        <FilterGroup>
                            <FilterLabel>
                                <FiUser />
                                Nome
                            </FilterLabel>
                            <FilterInput
                                type="text"
                                placeholder="Digite o nome do colaborador..."
                                value={filters.nome}
                                onChange={(e) => handleFilterChange('nome', e.target.value)}
                            />
                        </FilterGroup>

                        <FilterGroup>
                            <FilterLabel>
                                <FiMail />
                                E-mail
                            </FilterLabel>
                            <FilterInput
                                type="text"
                                placeholder="Digite o e-mail..."
                                value={filters.email}
                                onChange={(e) => handleFilterChange('email', e.target.value)}
                            />
                        </FilterGroup>

                        <FilterGroup>
                            <FilterLabel>
                                <FiHash />
                                CPF
                            </FilterLabel>
                            <FilterInput
                                type="text"
                                placeholder="Digite o CPF..."
                                value={filters.cpf}
                                onChange={(e) => handleFilterChange('cpf', e.target.value)}
                            />
                        </FilterGroup>

                        <FilterGroup>
                            <FilterLabel>
                                <FaVenusMars />
                                Sexo
                            </FilterLabel>
                            <FilterInput
                                as="select"
                                value={filters.sexo}
                                onChange={(e) => handleFilterChange('sexo', e.target.value)}
                            >
                                <option value="">Todos</option>
                                <option value="M">Masculino</option>
                                <option value="F">Feminino</option>
                            </FilterInput>
                        </FilterGroup>

                        <FilterGroup>
                            <FilterLabel>
                                <FiUsers />
                                Cargo ID
                            </FilterLabel>
                            <FilterInput
                                as="select"
                                value={filters.cargo_id}
                                onChange={(e) => handleFilterChange('cargo_id', e.target.value)}
                            >
                                <option value="">Todos os cargos</option>
                                {cargos.map((cargo) => (
                                    <option key={cargo.cargo_id} value={cargo.cargo_id.toString()}>
                                        {cargo.nome_cargo}
                                    </option>
                                ))}
                            </FilterInput>
                        </FilterGroup>

                        <FilterActions>
                            <FilterButton onClick={applyFilters} disabled={loading}>
                                <FiSearch />
                                {loading ? 'Buscando...' : 'Buscar'}
                            </FilterButton>

                            <ClearButton onClick={clearFilters}>
                                <FiX />
                                Limpar Filtros
                            </ClearButton>
                        </FilterActions>
                    </FilterGrid>
                </FilterContainer>

                {/* Tabela de Colaboradores */}
                <TableContainer>
                    {loading && (
                        <LoadingState>
                            Carregando colaboradores...
                        </LoadingState>
                    )}

                    {error && (
                        <ErrorState>
                            {error}
                        </ErrorState>
                    )}

                    {!loading && !error && colaboradores.length === 0 && (
                        <EmptyState>
                            Nenhum colaborador encontrado
                        </EmptyState>
                    )}

                    {!loading && !error && colaboradores.length > 0 && (
                        <Table>
                            <TableHeader>
                                <tr>
                                    <TableHeaderCell>ID</TableHeaderCell>
                                    <TableHeaderCell>Nome</TableHeaderCell>
                                    <TableHeaderCell>Email</TableHeaderCell>
                                    <TableHeaderCell>CPF</TableHeaderCell>
                                    <TableHeaderCell>Telefone</TableHeaderCell>
                                    <TableHeaderCell>Sexo</TableHeaderCell>
                                    <TableHeaderCell>Idade</TableHeaderCell>
                                    <TableHeaderCell>Cargo ID</TableHeaderCell>
                                    <TableHeaderCell className="center">Ações</TableHeaderCell>
                                </tr>
                            </TableHeader>
                            <TableBody>
                                {colaboradores.map((colaborador, index) => (
                                    <TableRow key={colaborador.colaborador_id} index={index}>
                                        <TableCell>{colaborador.colaborador_id}</TableCell>
                                        <TableCell fontWeight="500">{colaborador.nome}</TableCell>
                                        <TableCell color="#6c757d">{colaborador.email}</TableCell>
                                        <TableCell>{formatCpf(colaborador.cpf)}</TableCell>
                                        <TableCell>{formatTelefone(colaborador.telefone || '')}</TableCell>
                                        <TableCell>{formatSexo(colaborador.sexo)}</TableCell>
                                        <TableCell>{calcularIdade(colaborador.data_nascimento)}</TableCell>
                                        <TableCell>{cargos.find(cargo => cargo.cargo_id === colaborador.cargo_id)?.nome_cargo}</TableCell>
                                        <TableCell textAlign="center">
                                            <ActionButtons>
                                                <EditButton
                                                    onClick={() => navigate(`/updateColaborador/${colaborador.colaborador_id}`)}
                                                >
                                                    <MdEditSquare />
                                                </EditButton>
                                                <EditButton
                                                    onClick={() => openColaboradorModal(colaborador)}
                                                >
                                                    <FaEye />
                                                </EditButton>
                                                <EditButton
                                                    onClick={() => handleDelete(colaborador.colaborador_id)}
                                                >
                                                    <MdDelete />
                                                </EditButton>
                                            </ActionButtons>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </TableContainer>

                {/* Modal de Detalhes */}
                {isModalOpen && selectedColaborador && (
                    <Modal>
                        <InfoModal>
                            <h2>Detalhes do Colaborador</h2>
                            <p><strong>ID:</strong> {selectedColaborador.colaborador_id}</p>
                            <p><strong>Nome:</strong> {selectedColaborador.nome}</p>
                            <p><strong>Email:</strong> {selectedColaborador.email}</p>
                            <p><strong>CPF:</strong> {formatCpf(selectedColaborador.cpf)}</p>
                            <p><strong>Telefone:</strong> {formatTelefone(selectedColaborador.telefone || '')}</p>
                            <p><strong>Sexo:</strong> {formatSexo(selectedColaborador.sexo)}</p>
                            <p><strong>Data de Nascimento:</strong> {new Date(selectedColaborador.data_nascimento).toLocaleDateString('pt-BR')}</p>
                            <p><strong>Idade:</strong> {calcularIdade(selectedColaborador.data_nascimento)}</p>
                            <p><strong>Cargo: </strong>{cargos.find(cargo => cargo.cargo_id === selectedColaborador.cargo_id)?.nome_cargo}</p>
                            <p><strong>Data de Criação:</strong> {formatDataCriacao(selectedColaborador.data_criacao)}</p>
                            <button onClick={closeColaboradorModal} style={{
                                marginTop: '1rem',
                                padding: '0.5rem 1rem',
                                borderRadius: '4px',
                                border: 'none',
                                backgroundColor: '#333',
                                color: 'white',
                                cursor: 'pointer'
                            }}>Fechar</button>
                        </InfoModal>
                    </Modal>
                )}
            </Container>
        </>
    );
}

export default ListColaboradores;