import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../Header/header";
import type { FolhaPagamento, FolhaPagamentoFilters } from "../../Models/folhaPagamento";
import { FiSearch, FiX, FiUser, FiUsers } from "react-icons/fi";
import { getCargos } from "../../services/cargoService";
import { getFolhaPagamento } from "../../services/folhaPagamentoService";
import { FaGears } from "react-icons/fa6";
import type { Cargo } from '../../Models/cargo';
import {
    Title,
    DisplayFlex,
    TopLine,
    FilterContainer,
    FilterGrid,
    FilterGroup,
    FilterLabel,
    FilterInput,
    FilterActions,
    FilterButton,
    TableContainer,
    ErrorState,
    EmptyState,
    Table,
    TableHeader,
    TableHeaderCell,
    TableBody,
    TableRow,
    TableCell,
    ClearButton,
    MonthSelector,
    MonthButton,
    ConfigButton
} from "./style";
import CustomSelect from '../../ui/Select/custumSelect';
import { LoadingState } from "../../ui/Loading/style";
import { Container } from '../../ui/Container/style';


function ListFolhaPagamento() {
    const [folhaPagamento, setFolhaPagamento] = useState<FolhaPagamento[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [cargos, setCargos] = useState<Cargo[]>([]);
    const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
    const navigate = useNavigate();
    const [filters, setFilters] = useState<FolhaPagamentoFilters>({
        nome: '',
        cargo_id: undefined,
        mes: new Date().getMonth() + 1
    });

    useEffect(() => {
        getCargos().then(setCargos);
        fetchFolhaPagamento(filters);
    }, []);

    const fetchFolhaPagamento = async (searchFilters?: FolhaPagamentoFilters) => {
        try {
            setLoading(true);
            const data = await getFolhaPagamento(searchFilters);
            setFolhaPagamento(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (field: keyof FolhaPagamentoFilters, value: string | number) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleMonthSelect = (mes: number) => {
        setSelectedMonth(mes);
        const newFilters = {
            ...filters,
            mes
        };
        setFilters(newFilters);
        fetchFolhaPagamento(newFilters);
    };

    const applyFilters = () => {
        fetchFolhaPagamento(filters);
    };

    const clearFilters = () => {
        const emptyFilters = {
            nome: '',
            cargo_id: undefined,
            mes: selectedMonth
        };
        setFilters(emptyFilters);
        fetchFolhaPagamento(emptyFilters);
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const meses = [
        { value: 1, label: 'Janeiro' },
        { value: 2, label: 'Fevereiro' },
        { value: 3, label: 'Março' },
        { value: 4, label: 'Abril' },
        { value: 5, label: 'Maio' },
        { value: 6, label: 'Junho' },
        { value: 7, label: 'Julho' },
        { value: 8, label: 'Agosto' },
        { value: 9, label: 'Setembro' },
        { value: 10, label: 'Outubro' },
        { value: 11, label: 'Novembro' },
        { value: 12, label: 'Dezembro' }
    ];

    return (
        <>
            <Header />
            <Container>
                <DisplayFlex>
                    <Title>Folha de Pagamento</Title>
                    <TopLine></TopLine>
                </DisplayFlex>
                <ConfigButton onClick={() => navigate("/configFolhaPagamento")}>
                    <FaGears style={{ marginRight: '0.5rem' }} />
                    Configuraçoes
                </ConfigButton>

                {/* Seletor de Meses */}
                <MonthSelector>
                    {meses.map((mes) => (
                        <MonthButton
                            key={mes.value}
                            $active={selectedMonth === mes.value}
                            onClick={() => handleMonthSelect(mes.value)}
                        >
                            {mes.label}
                        </MonthButton>
                    ))}
                </MonthSelector>

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
                                <FiUsers />
                                Cargo
                            </FilterLabel>
                            <CustomSelect 
                                value={filters.cargo_id?.toString() || ''}
                                onChange={(value) => handleFilterChange('cargo_id', value ? String(value) : '')}
                                options={[
                                    { value: '', label: 'Todos os cargos' },
                                    ...cargos.map((cargo) => ({
                                        value: cargo.cargo_id.toString(),
                                        label: cargo.nome_cargo
                                    }))
                                ]}
                                placeholder="Selecione o Cargo"
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

                {/* Tabela de Folha de Pagamento */}
                <TableContainer>
                    {loading && (
                        <LoadingState>
                            Calculando folha de pagamento...
                        </LoadingState>
                    )}

                    {error && (
                        <ErrorState>
                            {error}
                        </ErrorState>
                    )}

                    {!loading && !error && folhaPagamento.length === 0 && (
                        <EmptyState>
                            Nenhum registro encontrado. Clique em "Buscar" para consultar a folha de pagamento.
                        </EmptyState>
                    )}

                    {!loading && !error && folhaPagamento.length > 0 && (
                        <Table>
                            <TableHeader>
                                <tr>
                                    <TableHeaderCell>ID</TableHeaderCell>
                                    <TableHeaderCell>Nome do Colaborador</TableHeaderCell>
                                    <TableHeaderCell>Cargo</TableHeaderCell>
                                    <TableHeaderCell>Valor Total a Receber</TableHeaderCell>
                                    <TableHeaderCell>Valor Já Acumulado</TableHeaderCell>
                                </tr>
                            </TableHeader>
                            <TableBody>
                                {folhaPagamento.map((item, index) => (
                                    <TableRow key={item.colaborador_id} index={index}>
                                        <TableCell>{item.colaborador_id}</TableCell>
                                        <TableCell fontWeight="500">{item.nome_colaborador}</TableCell>
                                        <TableCell>{item.nome_cargo}</TableCell>
                                        <TableCell color="#28a745" fontWeight="600">
                                            {formatCurrency(item.valor_total_a_receber)}
                                        </TableCell>
                                        <TableCell color="#28a745" fontWeight="600">
                                            {formatCurrency(item.valor_ja_acumulado)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </TableContainer>
            </Container>
        </>
    );
}

export default ListFolhaPagamento;