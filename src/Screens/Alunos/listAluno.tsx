import { useState, useEffect } from "react";
import Header from "../../Header/header";
import type { Aluno, AlunoFilters } from "../../Models/alunos";
import { IoAdd } from "react-icons/io5";
import { FiSearch, FiX, FiUser, FiMail, FiPhone, FiMapPin, FiUsers } from "react-icons/fi";
import { MdEditSquare, MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
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

function ListAlunos() {
    const [alunos, setAlunos] = useState<Aluno[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [filters, setFilters] = useState<AlunoFilters>({
        nome: '',
        email: '',
        telefone: '',
        cidade: '',
        responsavel_financeiro: ''
    });
    const [selectedAluno, setSelectedAluno] = useState<Aluno | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openAlunoModal = (aluno: Aluno) => {
        setSelectedAluno(aluno);
        setIsModalOpen(true);
    };

    const closeAlunoModal = () => {
        setSelectedAluno(null);
        setIsModalOpen(false);
    };

    // Função para buscar alunos da API
    const fetchAlunos = async (searchFilters?: AlunoFilters) => {
        try {
            setLoading(true);

            let url = 'http://localhost:3000/alunos';

            // Se há filtros, usa o endpoint de filtros
            if (searchFilters && Object.values(searchFilters).some(filter => filter.trim() !== '')) {
                const queryParams = new URLSearchParams();

                Object.entries(searchFilters).forEach(([key, value]) => {
                    if (value && value.trim() !== '') {
                        queryParams.append(key, value.trim());
                    }
                });

                url = `http://localhost:3000/alunos/filter?${queryParams.toString()}`;
            }

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Erro ao buscar alunos');
            }

            const data = await response.json();
            setAlunos(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
        } finally {
            setLoading(false);
        }
    };

    // Carregar alunos ao montar o componente
    useEffect(() => {
        fetchAlunos();
    }, []);

    // Função para lidar com mudanças nos filtros
    const handleFilterChange = (field: keyof AlunoFilters, value: string) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Função para aplicar filtros
    const applyFilters = () => {
        fetchAlunos(filters);
    };

    // Função para limpar filtros
    const clearFilters = () => {
        const emptyFilters = {
            nome: '',
            email: '',
            telefone: '',
            cidade: '',
            responsavel_financeiro: ''
        };
        setFilters(emptyFilters);
        fetchAlunos(); // Busca todos os alunos novamente
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
    
    const handleDelete = async (aluno_id: number) => {
        if (!window.confirm("Tem certeza que deseja deletar este aluno?")) return;

        try {
            const response = await fetch(`http://localhost:3000/alunos/${aluno_id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(errorData.message || "Erro ao deletar aluno");
                return;
            }

            alert("Aluno deletado com sucesso!");

            setAlunos((prev) => prev.filter((aluno) => aluno.aluno_id !== aluno_id));
        } catch (error) {
            alert("Erro de conexão com o servidor");
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

    return (
        <>
            <Header />
            <Container>
                <DisplayFlex>
                    <Title>Alunos</Title>
                    <TopLine></TopLine>
                </DisplayFlex>
                <AddButton onClick={() => navigate("/addAlunos")}><IoAdd />Novo</AddButton>
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
                                placeholder="Digite o nome do aluno..."
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
                                <FiPhone />
                                Telefone
                            </FilterLabel>
                            <FilterInput
                                type="text"
                                placeholder="Digite o telefone..."
                                value={filters.telefone}
                                onChange={(e) => handleFilterChange('telefone', e.target.value)}
                            />
                        </FilterGroup>

                        <FilterGroup>
                            <FilterLabel>
                                <FiMapPin />
                                Cidade
                            </FilterLabel>
                            <FilterInput
                                type="text"
                                placeholder="Digite a cidade..."
                                value={filters.cidade}
                                onChange={(e) => handleFilterChange('cidade', e.target.value)}
                            />
                        </FilterGroup>

                        <FilterGroup>
                            <FilterLabel>
                                <FiUsers />
                                Responsável Financeiro
                            </FilterLabel>
                            <FilterInput
                                type="text"
                                placeholder="Digite o nome do responsável..."
                                value={filters.responsavel_financeiro}
                                onChange={(e) => handleFilterChange('responsavel_financeiro', e.target.value)}
                            />
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

                {/* Tabela de Alunos */}
                <TableContainer>
                    {loading && (
                        <LoadingState>
                            Carregando alunos...
                        </LoadingState>
                    )}

                    {error && (
                        <ErrorState>
                            {error}
                        </ErrorState>
                    )}

                    {!loading && !error && alunos.length === 0 && (
                        <EmptyState>
                            Nenhum aluno encontrado
                        </EmptyState>
                    )}

                    {!loading && !error && alunos.length > 0 && (
                        <Table>
                            <TableHeader>
                                <tr>
                                    <TableHeaderCell>ID</TableHeaderCell>
                                    <TableHeaderCell>Nome</TableHeaderCell>
                                    <TableHeaderCell>Email</TableHeaderCell>
                                    <TableHeaderCell>CPF</TableHeaderCell>
                                    <TableHeaderCell>Telefone</TableHeaderCell>
                                    <TableHeaderCell>Cidade</TableHeaderCell>
                                    <TableHeaderCell>Data Nasc.</TableHeaderCell>
                                    <TableHeaderCell className="center">Ações</TableHeaderCell>
                                </tr>
                            </TableHeader>
                            <TableBody>
                                {alunos.map((aluno, index) => (
                                    <TableRow key={aluno.aluno_id} index={index}>
                                        <TableCell>{aluno.aluno_id}</TableCell>
                                        <TableCell fontWeight="500">{aluno.nome}</TableCell>
                                        <TableCell color="#6c757d">{aluno.email}</TableCell>
                                        <TableCell>{formatCpf(aluno.cpf)}</TableCell>
                                        <TableCell>{formatTelefone(aluno.telefone || '')}</TableCell>
                                        <TableCell>{aluno.cidade || '-'}</TableCell>
                                        <TableCell>{calcularIdade(aluno.data_nascimento || '')}</TableCell>
                                        <TableCell textAlign="center">
                                            <ActionButtons>
                                                <EditButton
                                                    onClick={() => navigate(`/updateAluno/${aluno.aluno_id}`)}
                                                >
                                                    <MdEditSquare />
                                                </EditButton>
                                                <EditButton
                                                    onClick={() => openAlunoModal(aluno)}
                                                >
                                                    <FaEye />
                                                </EditButton>
                                                <EditButton
                                                    onClick={() => handleDelete(aluno.aluno_id)}
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
                {isModalOpen && selectedAluno && (
                    <Modal>
                        <InfoModal>
                            <h2>Detalhes do Aluno</h2>
                            <p><strong>Nome:</strong> {selectedAluno.nome}</p>
                            <p><strong>Email:</strong> {selectedAluno.email}</p>
                            <p><strong>CPF:</strong> {formatCpf(selectedAluno.cpf)}</p>
                            <p><strong>Telefone:</strong> {formatTelefone(selectedAluno.telefone || '')}</p>
                            <p><strong>Data Nascimento:</strong> {selectedAluno.data_nascimento}</p>
                            <p><strong>Cidade:</strong> {selectedAluno.cidade}</p>
                            <p><strong>Endereço:</strong> {selectedAluno.endereco}</p>
                            <p><strong>CEP:</strong> {selectedAluno.cep}</p>
                            <p><strong>Responsável Financeiro: </strong> {selectedAluno.responsavel_financeiro}</p>
                            <p><strong>Sexo:</strong> {selectedAluno.sexo}</p>
                            <p><strong>Data de Criação:</strong> {selectedAluno.data_criacao}</p>
                            <button onClick={closeAlunoModal} style={{
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

export default ListAlunos;