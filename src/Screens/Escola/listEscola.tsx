import { useState, useEffect } from "react";
import Header from "../../Header/header";
import { IoAdd } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { VscChromeClose } from "react-icons/vsc";
import { getCargos, createCargo, updateCargo, deleteCargo } from "../../services/cargoService";
import { getSalas, createSala, updateSala, deleteSala } from "../../services/salaService";
import { getModalidades, createModalidade, updateModalidade, deleteModalidade } from "../../services/modalidadeService";
import { MdEditSquare, MdDelete } from "react-icons/md";
import type { Cargo } from "../../Models/cargo";
import type { Sala } from "../../Models/sala";
import type { Modalidade } from "../../Models/modalidade";
import {
    Title,
    DisplayFlex,
    HorizontalLine,
    VerticalLine,
    ContainerSala,
    ContainerModalidade,
    ContainerCargo,
    Filter,
    FilterContainer,
    ButtonFind,
    LimparFilter,
    SalaModalCaargoItemContainer,
    SalaItem,
    ModalidadeItem,
    CargoItem,
    Overlay,
    ModalContainer,
    ButtonSalvar,
    ButtonCancelar,
    Input,
    ButtonsModal,
    ActionButton
} from "./style";
import { LoadingState } from '../../ui/Loading/style'
import { AddButton } from '../../ui/AddButton/style';
import { Container } from '../../ui/Container/style';

function UpdateColaborador() {
    const [loading, setLoading] = useState(true);
    // Estados para Cargos
    const [cargos, setCargos] = useState<Cargo[]>([]);
    const [filtro, setFiltro] = useState("");
    const [isCreateCargoOpen, setIsCreateCargoOpen] = useState(false);
    const [isEditCargoOpen, setIsEditCargoOpen] = useState(false);
    const [nomeCargo, setNomeCargo] = useState("");
    const [cargoEditando, setCargoEditando] = useState<Cargo | null>(null);

    // Estados para Salas
    const [salas, setSalas] = useState<Sala[]>([]);
    const [filtroSala, setFiltroSala] = useState("");
    const [isCreateSalaOpen, setIsCreateSalaOpen] = useState(false);
    const [isEditSalaOpen, setIsEditSalaOpen] = useState(false);
    const [nomeSala, setNomeSala] = useState("");
    const [capacidadeSala, setCapacidadeSala] = useState<number>(0);
    const [salaEditando, setSalaEditando] = useState<Sala | null>(null);

    // Estados para Modalidades
    const [modalidades, setModalidades] = useState<Modalidade[]>([]);
    const [filtroModalidade, setFiltroModalidade] = useState("");
    const [isCreateModalidadeOpen, setIsCreateModalidadeOpen] = useState(false);
    const [isEditModalidadeOpen, setIsEditModalidadeOpen] = useState(false);
    const [nomeModalidade, setNomeModalidade] = useState("");
    const [modalidadeEditando, setModalidadeEditando] = useState<Modalidade | null>(null);

    useEffect(() => {
        carregarCargos();
        carregarSalas();
        carregarModalidades();
    }, []);

    // Funções para Cargos
    const carregarCargos = async () => {
        try {
            const data = await getCargos();
            setCargos(data);
            setLoading(true);
        } finally {
            setLoading(false);
        }
    };

    const handleBuscarCargo = async () => {
        const data = await getCargos(filtro);
        setCargos(data);
    };

    const handleOpenCreateCargo = () => {
        setNomeCargo("");
        setIsCreateCargoOpen(true);
    };

    const handleEditCargo = (cargo: Cargo) => {
        setCargoEditando(cargo);
        setNomeCargo(cargo.nome_cargo);
        setIsEditCargoOpen(true);
    };

    const handleSaveCargo = async () => {
        if (!nomeCargo.trim()) return;
        await createCargo({ nome_cargo: nomeCargo });
        await carregarCargos();
        setNomeCargo("");
        setIsCreateCargoOpen(false);
    };

    const handleUpdateCargo = async () => {
        if (!cargoEditando) return;
        await updateCargo(cargoEditando.cargo_id, { nome_cargo: nomeCargo });
        await carregarCargos();
        setCargoEditando(null);
        setNomeCargo("");
        setIsEditCargoOpen(false);
    };

    const handleDeleteCargo = async (id: number) => {
        const confirmar = window.confirm("Tem certeza que deseja excluir este cargo?");
        if (!confirmar) return;

        await deleteCargo(id);
        await carregarCargos();
    };

    // Funções para Salas
    const carregarSalas = async () => {
        try {
            const data = await getSalas();
        setSalas(data);
            setLoading(true);
        } finally {
            setLoading(false);
        }
    };

    const handleBuscarSala = async () => {
        const data = await getSalas(filtroSala);
        setSalas(data);
    };

    const handleOpenCreateSala = () => {
        setNomeSala("");
        setCapacidadeSala(0);
        setIsCreateSalaOpen(true);
    };

    const handleEditSala = (sala: Sala) => {
        setSalaEditando(sala);
        setNomeSala(sala.nome_sala);
        setCapacidadeSala(sala.capacidade);
        setIsEditSalaOpen(true);
    };

    const handleSaveSala = async () => {
        if (!nomeSala.trim() || capacidadeSala <= 0) return;
        await createSala({ nome_sala: nomeSala, capacidade: capacidadeSala });
        await carregarSalas();
        setNomeSala("");
        setCapacidadeSala(0);
        setIsCreateSalaOpen(false);
    };

    const handleUpdateSala = async () => {
        if (!salaEditando) return;
        await updateSala(salaEditando.sala_id, { nome_sala: nomeSala, capacidade: capacidadeSala });
        await carregarSalas();
        setSalaEditando(null);
        setNomeSala("");
        setCapacidadeSala(0);
        setIsEditSalaOpen(false);
    };

    const handleDeleteSala = async (id: number) => {
        const confirmar = window.confirm("Tem certeza que deseja excluir esta sala?");
        if (!confirmar) return;

        await deleteSala(id);
        await carregarSalas();
    };

    // Funções para Modalidades
    const carregarModalidades = async () => {
        try {
            const data = await getModalidades();
        setModalidades(data);
            setLoading(true);
        } finally {
            setLoading(false);
        }
    };

    const handleBuscarModalidade = async () => {
        const data = await getModalidades(filtroModalidade);
        setModalidades(data);
    };

    const handleOpenCreateModalidade = () => {
        setNomeModalidade("");
        setIsCreateModalidadeOpen(true);
    };

    const handleEditModalidade = (modalidade: Modalidade) => {
        setModalidadeEditando(modalidade);
        setNomeModalidade(modalidade.nome_modalidade);
        setIsEditModalidadeOpen(true);
    };

    const handleSaveModalidade = async () => {
        if (!nomeModalidade.trim()) return;
        await createModalidade({ nome_modalidade: nomeModalidade });
        await carregarModalidades();
        setNomeModalidade("");
        setIsCreateModalidadeOpen(false);
    };

    const handleUpdateModalidade = async () => {
        if (!modalidadeEditando) return;
        await updateModalidade(modalidadeEditando.modalidade_id, { nome_modalidade: nomeModalidade });
        await carregarModalidades();
        setModalidadeEditando(null);
        setNomeModalidade("");
        setIsEditModalidadeOpen(false);
    };

    const handleDeleteModalidade = async (id: number) => {
        const confirmar = window.confirm("Tem certeza que deseja excluir esta modalidade?");
        if (!confirmar) return;

        await deleteModalidade(id);
        await carregarModalidades();
    };

    return (
        <>
            <Header />
            <Container>
                <DisplayFlex>
                    <HorizontalLine />
                    <Title>Escola</Title>
                    <HorizontalLine />
                </DisplayFlex>

                <DisplayFlex>
                    {/* Coluna Salas */}
                    <ContainerSala>
                        <h1>Salas</h1>
                        <AddButton onClick={handleOpenCreateSala}><IoAdd />Novo</AddButton>

                        {/* Modal de Criação Sala */}
                        {isCreateSalaOpen && (
                            <Overlay>
                                <ModalContainer>
                                    <h1>Adicionar Sala</h1>
                                    <Input
                                        type="text"
                                        placeholder="Nome da sala"
                                        value={nomeSala}
                                        onChange={(e) => setNomeSala(e.target.value)}
                                    />
                                    <Input
                                        type="number"
                                        placeholder="Capacidade"
                                        value={capacidadeSala}
                                        onChange={(e) => setCapacidadeSala(Number(e.target.value))}
                                    />
                                    <ButtonsModal>
                                        <ButtonSalvar onClick={handleSaveSala}>Salvar</ButtonSalvar>
                                        <ButtonCancelar onClick={() => setIsCreateSalaOpen(false)}>Cancelar</ButtonCancelar>
                                    </ButtonsModal>
                                </ModalContainer>
                            </Overlay>
                        )}

                        <FilterContainer>
                            <Filter
                                type="text"
                                placeholder="Buscar sala..."
                                value={filtroSala}
                                onChange={(e) => setFiltroSala(e.target.value)}
                            />
                            <ButtonFind onClick={handleBuscarSala}><CiSearch /></ButtonFind>
                            <LimparFilter onClick={async () => {
                                setFiltroSala("");
                                const data = await getSalas();
                                setSalas(data);
                            }}><VscChromeClose /></LimparFilter>
                        </FilterContainer>

                        {/* Lista de salas */}
                        <SalaModalCaargoItemContainer>
                            {salas.map(s => (
                                <SalaItem key={s.sala_id}>
                                    <h4>{s.nome_sala} - <small>Capacidade: {s.capacidade}</small></h4>
                                    <DisplayFlex style={{ gap: '1rem', fontSize: '1.5rem', cursor: 'pointer' }}>
                                        <ActionButton onClick={() => handleEditSala(s)}><MdEditSquare /></ActionButton>
                                        <ActionButton onClick={() => handleDeleteSala(s.sala_id)}><MdDelete /></ActionButton>
                                    </DisplayFlex>
                                </SalaItem>
                            ))}
                        </SalaModalCaargoItemContainer>

                        {/* Modal de Edição Sala */}
                        {isEditSalaOpen && (
                            <Overlay>
                                <ModalContainer>
                                    <h1>Editar Sala</h1>
                                    <Input
                                        type="text"
                                        value={nomeSala}
                                        onChange={(e) => setNomeSala(e.target.value)}
                                    />
                                    <Input
                                        type="number"
                                        placeholder="Capacidade"
                                        value={capacidadeSala}
                                        onChange={(e) => setCapacidadeSala(Number(e.target.value))}
                                    />
                                    <ButtonsModal>
                                        <ButtonSalvar onClick={handleUpdateSala}>Salvar</ButtonSalvar>
                                        <ButtonCancelar onClick={() => setIsEditSalaOpen(false)}>Cancelar</ButtonCancelar>
                                    </ButtonsModal>
                                </ModalContainer>
                            </Overlay>
                        )}
                        {loading && (
                            <LoadingState>
                            </LoadingState>
                        )}
                    </ContainerSala>

                    <VerticalLine />

                    {/* Coluna Modalidades */}
                    <ContainerModalidade>
                        <h1>Modalidades</h1>
                        <AddButton onClick={handleOpenCreateModalidade}><IoAdd />Novo</AddButton>

                        {/* Modal de Criação Modalidade */}
                        {isCreateModalidadeOpen && (
                            <Overlay>
                                <ModalContainer>
                                    <h1>Adicionar Modalidade</h1>
                                    <Input
                                        type="text"
                                        placeholder="Nome da modalidade"
                                        value={nomeModalidade}
                                        onChange={(e) => setNomeModalidade(e.target.value)}
                                    />
                                    <ButtonsModal>
                                        <ButtonSalvar onClick={handleSaveModalidade}>Salvar</ButtonSalvar>
                                        <ButtonCancelar onClick={() => setIsCreateModalidadeOpen(false)}>Cancelar</ButtonCancelar>
                                    </ButtonsModal>
                                </ModalContainer>
                            </Overlay>
                        )}

                        <FilterContainer>
                            <Filter
                                type="text"
                                placeholder="Buscar modalidade..."
                                value={filtroModalidade}
                                onChange={(e) => setFiltroModalidade(e.target.value)}
                            />
                            <ButtonFind onClick={handleBuscarModalidade}><CiSearch /></ButtonFind>
                            <LimparFilter onClick={async () => {
                                setFiltroModalidade("");
                                const data = await getModalidades();
                                setModalidades(data);
                            }}><VscChromeClose /></LimparFilter>
                        </FilterContainer>

                        {/* Lista de modalidades */}
                        <SalaModalCaargoItemContainer>
                            {modalidades.map(m => (
                                <ModalidadeItem key={m.modalidade_id}>
                                    <h4>{m.nome_modalidade}</h4>
                                    <DisplayFlex style={{ gap: '1rem', fontSize: '1.5rem', cursor: 'pointer' }}>
                                        <ActionButton onClick={() => handleEditModalidade(m)}><MdEditSquare /></ActionButton>
                                        <ActionButton onClick={() => handleDeleteModalidade(m.modalidade_id)}><MdDelete /></ActionButton>
                                    </DisplayFlex>
                                </ModalidadeItem>
                            ))}
                        </SalaModalCaargoItemContainer>

                        {/* Modal de Edição Modalidade */}
                        {isEditModalidadeOpen && (
                            <Overlay>
                                <ModalContainer>
                                    <h1>Editar Modalidade</h1>
                                    <Input
                                        type="text"
                                        value={nomeModalidade}
                                        onChange={(e) => setNomeModalidade(e.target.value)}
                                    />
                                    <ButtonsModal>
                                        <ButtonSalvar onClick={handleUpdateModalidade}>Salvar</ButtonSalvar>
                                        <ButtonCancelar onClick={() => setIsEditModalidadeOpen(false)}>Cancelar</ButtonCancelar>
                                    </ButtonsModal>
                                </ModalContainer>
                            </Overlay>
                        )}
                        {loading && (
                            <LoadingState>
                            </LoadingState>
                        )}
                    </ContainerModalidade>

                    <VerticalLine />

                    {/* Coluna Cargos */}
                    <ContainerCargo>
                        <h1>Cargos</h1>
                        <AddButton onClick={handleOpenCreateCargo}><IoAdd />Novo</AddButton>

                        {/* Modal de Criação Cargo */}
                        {isCreateCargoOpen && (
                            <Overlay>
                                <ModalContainer>
                                    <h1>Adicionar Cargo</h1>
                                    <Input
                                        type="text"
                                        placeholder="Nome do cargo"
                                        value={nomeCargo}
                                        onChange={(e) => setNomeCargo(e.target.value)}
                                    />
                                    <ButtonsModal>
                                        <ButtonSalvar onClick={handleSaveCargo}>Salvar</ButtonSalvar>
                                        <ButtonCancelar onClick={() => setIsCreateCargoOpen(false)}>Cancelar</ButtonCancelar>
                                    </ButtonsModal>
                                </ModalContainer>
                            </Overlay>
                        )}

                        <FilterContainer>
                            <Filter
                                type="text"
                                placeholder="Buscar cargo..."
                                value={filtro}
                                onChange={(e) => setFiltro(e.target.value)}
                            />
                            <ButtonFind onClick={handleBuscarCargo}><CiSearch /></ButtonFind>
                            <LimparFilter onClick={async () => {
                                setFiltro("");
                                const data = await getCargos();
                                setCargos(data);
                            }}><VscChromeClose /></LimparFilter>
                        </FilterContainer>

                        {/* Lista de cargos */}
                        <SalaModalCaargoItemContainer>
                            {cargos.map(c => (
                                <CargoItem key={c.cargo_id}>
                                    <h4>{c.nome_cargo}</h4>
                                    <DisplayFlex style={{ gap: '1rem', fontSize: '1.5rem', cursor: 'pointer' }}>
                                        <ActionButton onClick={() => handleEditCargo(c)}><MdEditSquare /></ActionButton>
                                        <ActionButton onClick={() => handleDeleteCargo(c.cargo_id)}><MdDelete /></ActionButton>
                                    </DisplayFlex>
                                </CargoItem>
                            ))}
                        </SalaModalCaargoItemContainer>

                        {/* Modal de Edição Cargo */}
                        {isEditCargoOpen && (
                            <Overlay>
                                <ModalContainer>
                                    <h1>Editar Cargo</h1>
                                    <Input
                                        type="text"
                                        value={nomeCargo}
                                        onChange={(e) => setNomeCargo(e.target.value)}
                                    />
                                    <ButtonsModal>
                                        <ButtonSalvar onClick={handleUpdateCargo}>Salvar</ButtonSalvar>
                                        <ButtonCancelar onClick={() => setIsEditCargoOpen(false)}>Cancelar</ButtonCancelar>
                                    </ButtonsModal>
                                </ModalContainer>
                            </Overlay>
                        )}
                        {loading && (
                            <LoadingState>
                            </LoadingState>
                        )}
                    </ContainerCargo>
                </DisplayFlex>
            </Container >
        </>
    );
}

export default UpdateColaborador;