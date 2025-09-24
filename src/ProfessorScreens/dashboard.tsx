import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../ProfessorScreens/Header/header';
import { buscarChamadasDoDia, gerarChamadasDoMes } from '../services/chamadaService';
import type { Usuario, ChamadasResponse } from '../Models/chamada';
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
  AddChamadasButton,
  EmptyStateCard,
  EmptyStateTitle,
  EmptyStateText,
  LoadingContainer
} from './style';

const Professor: React.FC = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [chamadas, setChamadas] = useState<ChamadasResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingCalls, setGeneratingCalls] = useState(false);
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
    carregarChamadasDoDia(dadosUsuario);
  };

  const carregarChamadasDoDia = async (dadosUsuario: Usuario) => {
    if (!dadosUsuario.colaborador_id) {
      setChamadas({
        message: 'Usuário não está associado a um colaborador',
        data: new Date().toLocaleDateString('pt-BR'),
        chamadas: []
      });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await buscarChamadasDoDia(dadosUsuario.colaborador_id)
      setChamadas(data);
    } catch (error) {
      setChamadas({
        message: 'Erro ao carregar chamadas',
        data: new Date().toLocaleDateString('pt-BR'),
        chamadas: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGerarChamadasDoMes = async () => {
    if (!usuario?.colaborador_id) {
      alert('Erro: Usuário não está associado a um colaborador');
      return;
    }

    try {
      setGeneratingCalls(true);
      await gerarChamadasDoMes(usuario.colaborador_id);
      
      await carregarChamadasDoDia(usuario);
    } catch (error: any) {
      alert(`Erro: ${error.message}`);
    } finally {
      setGeneratingCalls(false);
    }
  };

  const handleChamadaClick = (chamadaId: number) => {
    console.log('Fazer chamada para:', chamadaId);
    // Aqui você pode implementar a navegação para a tela de chamada
  };

  const renderChamadasList = () => {
    if (!chamadas?.chamadas.length) return null;

    return (
      <ChamadasContainer>
        {chamadas.chamadas.map((chamada) => (
          <ChamadaCard
            key={chamada.chamada_id}
            onClick={() => handleChamadaClick(chamada.chamada_id)}
          >
            <ChamadaTitle>{chamada.turma_nome}</ChamadaTitle>
            <ChamadaInfo>
              <InfoText>{chamada.horario}</InfoText>
              <InfoText variant="secondary">{chamadas.data}</InfoText>
              <InfoText variant="secondary">{chamada.nome_sala}</InfoText>
            </ChamadaInfo>
          </ChamadaCard>
        ))}
      </ChamadasContainer>
    );
  };

  const renderEmptyState = () => {
    if (chamadas?.message === "Nenhuma chamada encontrada para hoje") {
      return (
        <EmptyStateCard>
          <EmptyStateTitle>Sem aulas hoje!</EmptyStateTitle>
          <EmptyStateText variant="secondary">
            {chamadas.data}
          </EmptyStateText>
        </EmptyStateCard>
      );
    }

    return (
      <AddChamadasButton 
        onClick={handleGerarChamadasDoMes}
        disabled={generatingCalls}
      >
        <p style={{color: '#dfdfdfff'}}>{generatingCalls ? 'Gerando...' : 'Gerar Chamadas do Mês'}</p>
        <p style={{color: '#dfdfdfff'}}>
          {generatingCalls 
            ? 'Aguarde...' 
            : `referentes ao mês de: ${new Date().toLocaleDateString('pt-BR', { 
                month: 'long', 
                year: 'numeric' 
              })}`
          }
        </p>
      </AddChamadasButton>
    );
  };

  const renderContent = () => {
    if (!chamadas) return null;

    const hasChamadas = chamadas.chamadas?.length > 0;
    
    return hasChamadas ? renderChamadasList() : renderEmptyState();
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
          <Subtitle>Vamos ao trabalho</Subtitle>
        </ProfessorInfoCard>

        {loading ? (
          <LoadingContainer>
            <p>Carregando aulas do dia...</p>
          </LoadingContainer>
        ) : (
          renderContent()
        )}
      </Container>
    </>
  );
};

export default Professor;