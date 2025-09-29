import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../ProfessorScreens/Header/header';
import { getTurmasHojeColaborador } from '../services/turmaService';
import { criarChamadaHoje } from '../services/chamadaService';
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
    if (criandoChamada === turmaId) return; // Evitar cliques duplos

    try {
      setCriandoChamada(turmaId);
      
      const resultado = await criarChamadaHoje(turmaId);
      
      // Mostrar mensagem de sucesso
      alert(`✅ ${resultado.message}\nChamada criada para ${resultado.data_aula}`);
      
      console.log('Chamada criada:', resultado);
      
      // Aqui você pode implementar navegação para tela de chamada se necessário
      // navigate(`/chamada/${resultado.chamada.chamada_id}`);
      
    } catch (error: any) {
      console.error('Erro ao criar chamada:', error);
      
      // Mostrar mensagem de erro mais amigável
      if (error.response?.data?.error) {
        alert(`❌ Erro: ${error.response.data.error}`);
      } else if (error.response?.data?.message) {
        alert(`❌ ${error.response.data.message}`);
      } else {
        alert('❌ Erro ao criar chamada. Tente novamente.');
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
            onClick={() => handleTurmaClick(turma.turma_id)}
          >
            <ChamadaTitle>{turma.nome_turma}</ChamadaTitle>
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
        <p>Carregando...</p>
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
            <p>Carregando turmas de hoje...</p>
          </LoadingContainer>
        ) : (
          renderContent()
        )}
      </Container>
    </>
  );
};

export default Professor;