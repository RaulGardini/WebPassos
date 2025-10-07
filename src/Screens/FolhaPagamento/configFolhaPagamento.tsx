import { useState, useEffect } from "react";
import Header from "../../Header/header";
import { useNavigate } from "react-router-dom";
import { IoAdd } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { FiArrowLeft } from "react-icons/fi";
import { 
    getHoraAula, 
    createHoraAula, 
    deleteHoraAula, 
    getHoraAulaProfSec, 
    createHoraAulaProfSec, 
    deleteHoraAulaProfSec,
    getTempoAulaValor,
    createTempoAulaValor,
    deleteTempoAulaValor,
} from "../../services/folhaPagamentoService";
import type { HoraAula, HoraAulaProfSec, TempoAulaValor } from "../../Models/folhaPagamento";
import {
    Title,
    DisplayFlex,
    TopLine,
    EditButton,
    BackButton,
    HoraAulaSection,
    HoraAulaTitle,
    HoraAulaList,
    HoraAulaCard,
    HoraAulaInfo,
    Label,
    Value,
    Modal,
    ModalContent,
    ModalTitle,
    ModalInput,
    ModalActions,
    ModalButton
} from "./style";
import { AddButton } from "../../ui/AddButton/style"
import { Container } from '../../ui/Container/style';

type ModalType = 'horaAula' | 'horaAulaProfSec' | 'tempoAulaValor' | null;

function ConfigFolhaPagamento() {
    const [horasAula, setHorasAula] = useState<HoraAula[]>([]);
    const [horasAulaProfSec, setHorasAulaProfSec] = useState<HoraAulaProfSec[]>([]);
    const [temposAulaValor, setTemposAulaValor] = useState<TempoAulaValor[]>([]);
    const [modalType, setModalType] = useState<ModalType>(null);
    const [newHoraAula, setNewHoraAula] = useState({ quant_alunos: '', valor_hora_aula: '' });
    const [newHoraAulaProfSec, setNewHoraAulaProfSec] = useState({ quant_alunos_prof_sec: '', valor_hora_aula_prof_sec: '' });
    const [newTempoAulaValor, setNewTempoAulaValor] = useState({ duracao_aula: '', valor_aula: '' });
    const navigate = useNavigate();

    useEffect(() => {
        fetchHorasAula();
        fetchHorasAulaProfSec();
        fetchTemposAulaValor();
    }, []);

    const fetchHorasAula = async () => {
        try {
            const data = await getHoraAula();
            setHorasAula(data);
        } catch (err) {
            console.error('Erro ao buscar horas aula:', err);
        }
    };

    const fetchHorasAulaProfSec = async () => {
        try {
            const dataProfSec = await getHoraAulaProfSec();
            setHorasAulaProfSec(dataProfSec);
        } catch (err) {
            console.error('Erro ao buscar horas aula prof sec:', err);
        }
    };

    const fetchTemposAulaValor = async () => {
        try {
            const data = await getTempoAulaValor();
            setTemposAulaValor(data);
        } catch (err) {
            console.error('Erro ao buscar tempos aula valor:', err);
        }
    };

    const handleAddHoraAula = async () => {
        try {
            await createHoraAula({
                quant_alunos: Number(newHoraAula.quant_alunos),
                valor_hora_aula: Number(newHoraAula.valor_hora_aula)
            });
            setModalType(null);
            setNewHoraAula({ quant_alunos: '', valor_hora_aula: '' });
            fetchHorasAula();
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Erro ao criar hora aula');
        }
    };

    const handleAddHoraAulaProfSec = async () => {
        try {
            await createHoraAulaProfSec({
                quant_alunos_prof_sec: Number(newHoraAulaProfSec.quant_alunos_prof_sec),
                valor_hora_aula_prof_sec: Number(newHoraAulaProfSec.valor_hora_aula_prof_sec)
            });
            setModalType(null);
            setNewHoraAulaProfSec({ quant_alunos_prof_sec: '', valor_hora_aula_prof_sec: '' });
            fetchHorasAulaProfSec();
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Erro ao criar hora aula');
        }
    };

    const handleAddTempoAulaValor = async () => {
        try {
            if (!newTempoAulaValor.duracao_aula || !newTempoAulaValor.valor_aula) {
                alert('Preencha todos os campos!');
                return;
            }

            await createTempoAulaValor({
                duracao_aula: newTempoAulaValor.duracao_aula,
                valor_aula: Number(newTempoAulaValor.valor_aula)
            });
            setModalType(null);
            setNewTempoAulaValor({ duracao_aula: '', valor_aula: '' });
            fetchTemposAulaValor();
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Erro ao criar tempo aula valor');
        }
    };

    const handleDeleteHoraAula = async (id: number) => {
        if (!window.confirm('Tem certeza que deseja deletar?')) return;
        try {
            await deleteHoraAula(id);
            fetchHorasAula();
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Erro ao deletar hora aula');
        }
    };

    const handleDeleteHoraAulaProfSec = async (id: number) => {
        if (!window.confirm('Tem certeza que deseja deletar?')) return;
        try {
            await deleteHoraAulaProfSec(id);
            fetchHorasAulaProfSec();
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Erro ao deletar hora aula');
        }
    };

    const handleDeleteTempoAulaValor = async (id: number) => {
        if (!window.confirm('Tem certeza que deseja deletar?')) return;
        try {
            await deleteTempoAulaValor(id);
            fetchTemposAulaValor();
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Erro ao deletar tempo aula valor');
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    return (
        <>
            <Header />
            <Container>
                <DisplayFlex>
                    <Title>Configurar Folha de Pagamento</Title>
                    <TopLine></TopLine>
                </DisplayFlex>
                <BackButton onClick={() => navigate(-1)}>
                    <FiArrowLeft /> Voltar
                </BackButton>

                <HoraAulaTitle>Hora aula professor 1</HoraAulaTitle>
                {/* Seção Hora Aula Professor 1 */}
                <HoraAulaSection>
                    <AddButton onClick={() => setModalType('horaAula')} style={{marginRight: '1rem'}}>
                        <IoAdd />
                        Novo
                    </AddButton>
                    <HoraAulaList>
                        {horasAula.map((hora) => (
                            <HoraAulaCard key={hora.hora_aula_id}>
                                <HoraAulaInfo>
                                    <Label>Max. Quant. alunos:</Label>
                                    <Value>{hora.quant_alunos}</Value>
                                </HoraAulaInfo>
                                <HoraAulaInfo>
                                    <Label>Hora aula:</Label>
                                    <Value>{formatCurrency(hora.valor_hora_aula)}</Value>
                                </HoraAulaInfo>
                                <EditButton onClick={() => handleDeleteHoraAula(hora.hora_aula_id)}>
                                    <MdDelete />
                                </EditButton>
                            </HoraAulaCard>
                        ))}
                    </HoraAulaList>
                </HoraAulaSection>

                <HoraAulaTitle>Hora aula professor 2</HoraAulaTitle>
                {/* Seção Hora Aula Professor 2 */}
                <HoraAulaSection>
                    <AddButton onClick={() => setModalType('horaAulaProfSec')} style={{marginRight: '1rem'}}>
                        <IoAdd />
                        Novo
                    </AddButton>
                    <HoraAulaList>
                        {horasAulaProfSec.map((horaProfSec) => (
                            <HoraAulaCard key={horaProfSec.hora_aula_prof_sec_id}>
                                <HoraAulaInfo>
                                    <Label>Max. Quant. alunos:</Label>
                                    <Value>{horaProfSec.quant_alunos_prof_sec}</Value>
                                </HoraAulaInfo>
                                <HoraAulaInfo>
                                    <Label>Hora aula:</Label>
                                    <Value>{formatCurrency(horaProfSec.valor_hora_aula_prof_sec)}</Value>
                                </HoraAulaInfo>
                                <EditButton onClick={() => handleDeleteHoraAulaProfSec(horaProfSec.hora_aula_prof_sec_id)}>
                                    <MdDelete />
                                </EditButton>
                            </HoraAulaCard>
                        ))}
                    </HoraAulaList>
                </HoraAulaSection>

                <HoraAulaTitle>Valor da aula por tempo</HoraAulaTitle>
                {/* Seção Tempo Aula Valor */}
                <HoraAulaSection>
                    <AddButton onClick={() => setModalType('tempoAulaValor')} style={{marginRight: '1rem'}}>
                        <IoAdd />
                        Novo
                    </AddButton>
                    <HoraAulaList>
                        {temposAulaValor.map((tempo) => (
                            <HoraAulaCard key={tempo.tempo_aula_valor_id}>
                                <HoraAulaInfo>
                                    <Label>Duração:</Label>
                                    <Value>{tempo.duracao_aula}</Value>
                                </HoraAulaInfo>
                                <HoraAulaInfo>
                                    <Label>Valor:</Label>
                                    <Value>{formatCurrency(tempo.valor_aula)}</Value>
                                </HoraAulaInfo>
                                <EditButton onClick={() => handleDeleteTempoAulaValor(tempo.tempo_aula_valor_id)}>
                                    <MdDelete />
                                </EditButton>
                            </HoraAulaCard>
                        ))}
                    </HoraAulaList>
                </HoraAulaSection>

                {/* Modal Hora Aula Professor 1 */}
                {modalType === 'horaAula' && (
                    <Modal onClick={() => setModalType(null)}>
                        <ModalContent onClick={(e) => e.stopPropagation()}>
                            <ModalTitle>Nova Hora Aula - Professor 1</ModalTitle>
                            <div>
                                <Label>Quantidade de alunos:</Label>
                                <ModalInput
                                    type="number"
                                    placeholder="Ex: 11"
                                    value={newHoraAula.quant_alunos}
                                    onChange={(e) => setNewHoraAula({...newHoraAula, quant_alunos: e.target.value})}
                                />
                            </div>
                            <div>
                                <Label>Valor hora aula (R$):</Label>
                                <ModalInput
                                    type="number"
                                    step="0.01"
                                    placeholder="Ex: 55.00"
                                    value={newHoraAula.valor_hora_aula}
                                    onChange={(e) => setNewHoraAula({...newHoraAula, valor_hora_aula: e.target.value})}
                                />
                            </div>
                            <ModalActions>
                                <ModalButton variant="secondary" onClick={() => setModalType(null)}>
                                    Cancelar
                                </ModalButton>
                                <ModalButton onClick={handleAddHoraAula}>
                                    Adicionar
                                </ModalButton>
                            </ModalActions>
                        </ModalContent>
                    </Modal>
                )}

                {/* Modal Hora Aula Professor 2 */}
                {modalType === 'horaAulaProfSec' && (
                    <Modal onClick={() => setModalType(null)}>
                        <ModalContent onClick={(e) => e.stopPropagation()}>
                            <ModalTitle>Nova Hora Aula - Professor 2</ModalTitle>
                            <div>
                                <Label>Quantidade de alunos:</Label>
                                <ModalInput
                                    type="number"
                                    placeholder="Ex: 11"
                                    value={newHoraAulaProfSec.quant_alunos_prof_sec}
                                    onChange={(e) => setNewHoraAulaProfSec({...newHoraAulaProfSec, quant_alunos_prof_sec: e.target.value})}
                                />
                            </div>
                            <div>
                                <Label>Valor hora aula (R$):</Label>
                                <ModalInput
                                    type="number"
                                    step="0.01"
                                    placeholder="Ex: 40.00"
                                    value={newHoraAulaProfSec.valor_hora_aula_prof_sec}
                                    onChange={(e) => setNewHoraAulaProfSec({...newHoraAulaProfSec, valor_hora_aula_prof_sec: e.target.value})}
                                />
                            </div>
                            <ModalActions>
                                <ModalButton variant="secondary" onClick={() => setModalType(null)}>
                                    Cancelar
                                </ModalButton>
                                <ModalButton onClick={handleAddHoraAulaProfSec}>
                                    Adicionar
                                </ModalButton>
                            </ModalActions>
                        </ModalContent>
                    </Modal>
                )}

                {/* Modal Tempo Aula Valor */}
                {modalType === 'tempoAulaValor' && (
                    <Modal onClick={() => setModalType(null)}>
                        <ModalContent onClick={(e) => e.stopPropagation()}>
                            <ModalTitle>Novo Tempo Aula Valor</ModalTitle>
                            <div>
                                <Label>Duração da aula (HH:MM:SS):</Label>
                                <ModalInput
                                    type="time"
                                    step="1"
                                    placeholder="Ex: 01:30:00"
                                    value={newTempoAulaValor.duracao_aula}
                                    onChange={(e) => setNewTempoAulaValor({...newTempoAulaValor, duracao_aula: e.target.value})}
                                    required
                                />
                            </div>
                            <div>
                                <Label>Valor da aula (R$):</Label>
                                <ModalInput
                                    type="number"
                                    step="0.01"
                                    placeholder="Ex: 80.00"
                                    value={newTempoAulaValor.valor_aula}
                                    onChange={(e) => setNewTempoAulaValor({...newTempoAulaValor, valor_aula: e.target.value})}
                                />
                            </div>
                            <ModalActions>
                                <ModalButton variant="secondary" onClick={() => setModalType(null)}>
                                    Cancelar
                                </ModalButton>
                                <ModalButton onClick={handleAddTempoAulaValor}>
                                    Adicionar
                                </ModalButton>
                            </ModalActions>
                        </ModalContent>
                    </Modal>
                )}
            </Container>
        </>
    );
}

export default ConfigFolhaPagamento;