import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../ProfessorScreens/Header/header';
import { getTurmasHojeColaborador } from '../services/turmaService';
import { criarChamadaHoje } from '../services/chamadaService';
import { criarPresencas } from '../services/presencaService';
import { buscarChamadasDoDia } from '../services/chamadaService';
import type { Usuario } from '../Models/chamada';
import {
  Container,
  ProfessorInfoCard,
  ProfessorName,
  Subtitle,
  ChamadasContainer,
  ChamadaCard,
  ChamadaTitle,
  ChamadaInfo,
  InfoText,
  EmptyStateCard,
  EmptyStateTitle,
  EmptyStateText,
  LoadingContainer
} from './style';
import { LoadingState } from '../ui/Loading/style'

interface TurmaHoje {
  turma_id: number;
  nome_turma: string;
  sala_id: number;
  modalidade_id: number;
  professor1_id: number;
  professor2_id: number;
  capacidade: number;
  horarios: Array<{
    horario_id: number;
    dia_semana: string;
    horario: string;
  }>;
}

interface TurmasHojeResponse {
  colaborador_id: number;
  data: string;
  dia_semana: string;
  total_aulas: number;
  aulas: TurmaHoje[];
}

const Professor: React.FC = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [turmasHoje, setTurmasHoje] = useState<TurmasHojeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [criandoChamada, setCriandoChamada] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    verificarAutenticacao();
  }, [navigate]);

  const verificarAutenticacao = () => {
    const usuarioLogado = localStorage.getItem("usuario");
    
    if (!usuarioLogado) {
      navigate("/");
      return;
    }

    const dadosUsuario = JSON.parse(usuarioLogado);

    if (dadosUsuario.tipo !== 'Professor') {
      alert('Acesso negado! Apenas professores podem acessar esta área.');
      navigate("/");
      return;
    }

    setUsuario(dadosUsuario);
    carregarTurmasDoColaborador(dadosUsuario);
  };

  const carregarTurmasDoColaborador = async (dadosUsuario: Usuario) => {
    if (!dadosUsuario.colaborador_id) {
      setTurmasHoje(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getTurmasHojeColaborador(dadosUsuario.colaborador_id);
      setTurmasHoje(data);
    } catch (error) {
      console.error('Erro ao carregar turmas de hoje:', error);
      setTurmasHoje(null);
    } finally {
      setLoading(false);
    }
  };

  const handleTurmaClick = async (turmaId: number) => {
    if (criandoChamada === turmaId) return;

    try {
      setCriandoChamada(turmaId);
      
      let chamadaId: number;
      
      try {
        // 1. Tentar criar a chamada
        const resultadoChamada = await criarChamadaHoje(turmaId);
        console.log('Chamada criada:', resultadoChamada);
        chamadaId = resultadoChamada.chamada.chamada_id;
        
        // 2. Criar as presenças automaticamente (só se a chamada foi criada agora)
        try {
          const resultadoPresencas = await criarPresencas(chamadaId);
          console.log('Presenças criadas:', resultadoPresencas);
        } catch (presencaError: any) {
          // Se já existem presenças, apenas continuar
          console.log('Presenças já existem ou erro ao criar:', presencaError);
        }
        
      } catch (chamadaError: any) {
        // Se a chamada já existe, pegar o ID dela da resposta ou buscar
        if (chamadaError.response?.data?.error?.includes('Já existe uma chamada')) {
          // Buscar a chamada existente do dia
          if (!usuario?.colaborador_id) return;
          
          const chamadasDoDia = await buscarChamadasDoDia(usuario.colaborador_id);
          const chamadaExistente = chamadasDoDia.chamadas?.find(
            (c: any) => c.turma_id === turmaId
          );
          
          if (chamadaExistente) {
            chamadaId = chamadaExistente.chamada_id;
            console.log('Usando chamada existente:', chamadaId);
          } else {
            throw new Error('Não foi possível encontrar a chamada');
          }
        } else {
          throw chamadaError;
        }
      }
      
      // 3. Navegar para a tela de presenças
      navigate(`/presencas/${chamadaId}`);
      
    } catch (error: any) {
      console.error('Erro ao processar chamada:', error);
      
      if (error.response?.data?.error) {
        alert(`Erro: ${error.response.data.error}`);
      } else if (error.response?.data?.message) {
        alert(`${error.response.data.message}`);
      } else {
        alert('Erro ao processar chamada. Tente novamente.');
      }
    } finally {
      setCriandoChamada(null);
    }
  };

  const renderTurmasList = () => {
    if (!turmasHoje?.aulas.length) return null;

    return (
      <ChamadasContainer>
        {turmasHoje.aulas.map((turma) => (
          <ChamadaCard
            key={turma.turma_id}
            onClick={() => {
              if (criandoChamada !== turma.turma_id) {
                handleTurmaClick(turma.turma_id);
              }
            }}
            style={criandoChamada === turma.turma_id ? { pointerEvents: 'none', opacity: 0.6 } : {}}
          >
            <ChamadaTitle>
              {criandoChamada === turma.turma_id 
                ? 'Criando chamada...' 
                : turma.nome_turma
              }
            </ChamadaTitle>
            <ChamadaInfo>
              {turma.horarios.map((horario) => (
                <InfoText key={horario.horario_id}>
                  {horario.horario}
                </InfoText>
              ))}
              <InfoText variant="secondary">{turmasHoje.data}</InfoText>
              <InfoText variant="secondary">Capacidade: {turma.capacidade} alunos</InfoText>
            </ChamadaInfo>
          </ChamadaCard>
        ))}
      </ChamadasContainer>
    );
  };

  const renderEmptyState = () => {
    return (
      <EmptyStateCard>
        <EmptyStateTitle>Sem aulas hoje!</EmptyStateTitle>
        <EmptyStateText variant="secondary">
          {new Date().toLocaleDateString('pt-BR')}
        </EmptyStateText>
        <EmptyStateText>
          Aproveite para descansar ou planejar as próximas aulas.
        </EmptyStateText>
      </EmptyStateCard>
    );
  };

  const renderContent = () => {
    if (!turmasHoje) return renderEmptyState();

    const hasAulas = turmasHoje.aulas?.length > 0;
    
    return hasAulas ? renderTurmasList() : renderEmptyState();
  };

  if (!usuario) {
    return (
      <LoadingContainer>
        <LoadingState />
      </LoadingContainer>
    );
  }

  return (
    <>
      <Header />
      <Container>
        <ProfessorInfoCard>
          <ProfessorName>Olá, {usuario.nome}</ProfessorName>
          <Subtitle>
            {turmasHoje && turmasHoje.total_aulas > 0
              ? `Você tem ${turmasHoje.total_aulas} aula${turmasHoje.total_aulas > 1 ? 's' : ''} hoje`
              : 'Vamos ao trabalho'
            }
          </Subtitle>
        </ProfessorInfoCard>

        {loading ? (
          <LoadingContainer>
            <LoadingState />
          </LoadingContainer>
        ) : (
          renderContent()
        )}
      </Container>
    </>
  );
};

export default Professor;