import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../ProfessorScreens/Header/header';
import { listarPresencas, atualizarStatusPresenca } from '../../services/presencaService';
import type { Presenca, ListarPresencasResponse } from '../../services/presencaService';
import { AiOutlineLike, AiOutlineDislike  } from "react-icons/ai";
import {
  Container,
  Card,
  Title,
  StatsContainer,
  StatCard,
  StatLabel,
  StatValue,
  PresencasList,
  PresencaItem,
  AlunoInfo,
  AlunoNome,
  StatusButton,
  LoadingContainer,
  EmptyState,
  BackButton,
  TopLine
} from './style';
import { LoadingState } from '../../ui/Loading/style'
import { IoArrowBack } from 'react-icons/io5';

const Presencas: React.FC = () => {
  const { chamada_id } = useParams<{ chamada_id: string }>();
  const navigate = useNavigate();
  const [presencasData, setPresencasData] = useState<ListarPresencasResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [atualizando, setAtualizando] = useState<number | null>(null);

  useEffect(() => {
    if (!chamada_id) {
      alert('ID da chamada não encontrado');
      navigate('/professor');
      return;
    }

    carregarPresencas();
  }, [chamada_id]);

  const carregarPresencas = async () => {
    if (!chamada_id) return;

    try {
      setLoading(true);
      const data = await listarPresencas(Number(chamada_id));
      setPresencasData(data);
    } catch (error: any) {
      console.error('Erro ao carregar presenças:', error);
      if (error.response?.data?.error) {
        alert(`Erro: ${error.response.data.error}`);
      } else {
        alert('Erro ao carregar presenças');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (presenca: Presenca) => {
    if (atualizando === presenca.presenca_id) return;

    const novoStatus = presenca.status === "presente" ? "falta" : "presente";

    try {
      setAtualizando(presenca.presenca_id);
      
      await atualizarStatusPresenca(presenca.presenca_id, novoStatus);
      
      // Atualizar estado local
      setPresencasData(prev => {
        if (!prev) return null;

        const presencasAtualizadas = prev.presencas.map(p =>
          p.presenca_id === presenca.presenca_id
            ? { ...p, status: novoStatus as "presente" | "falta" }
            : p
        );

        const presentes = presencasAtualizadas.filter(p => p.status === "presente").length;
        const faltas = presencasAtualizadas.filter(p => p.status === "falta").length;

        return {
          ...prev,
          presentes,
          faltas,
          presencas: presencasAtualizadas
        };
      });

    } catch (error: any) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status da presença');
    } finally {
      setAtualizando(null);
    }
  };

  const handleVoltar = () => {
    navigate(-1); // Volta para a página anterior
  };

  if (loading) {
    return (
      <>
        <Header />
        <Container>
          <LoadingContainer>
            <LoadingState />
          </LoadingContainer>
        </Container>
      </>
    );
  }

  if (!presencasData || presencasData.total === 0) {
    return (
      <>
        <Header />
        <Container>
          <BackButton onClick={handleVoltar}>
            <IoArrowBack />
            Voltar
          </BackButton>
          <EmptyState>
            <Title>Nenhuma presença encontrada</Title>
          </EmptyState>
        </Container>
      </>
    );
  }

  return (
    <>
      <Header />
      <Container>
        <BackButton onClick={handleVoltar}>
          <IoArrowBack />
          Voltar
        </BackButton>
        
        <Card>
          <Title>Lista de Presença</Title>
          <TopLine />

          <StatsContainer>
            <StatCard>
              <StatLabel>Alunos</StatLabel>
              <StatValue>{presencasData.total}</StatValue>
            </StatCard>
            <StatCard>
              <StatLabel variant="presente">Presentes</StatLabel>
              <StatValue variant="presente">{presencasData.presentes}</StatValue>
            </StatCard>
            <StatCard>
              <StatLabel variant="falta">Faltas</StatLabel>
              <StatValue variant="falta">{presencasData.faltas}</StatValue>
            </StatCard>
          </StatsContainer>

          <PresencasList>
            {presencasData.presencas.map((presenca) => (
              <PresencaItem key={presenca.presenca_id}>
                <AlunoInfo>
                  <AlunoNome>{presenca.aluno}</AlunoNome>
                </AlunoInfo>
                <StatusButton
                  status={presenca.status}
                  onClick={() => handleToggleStatus(presenca)}
                  disabled={atualizando === presenca.presenca_id}
                >
                  {atualizando === presenca.presenca_id 
                    ? '...' 
                    : presenca.status === "presente" ? (
                        <>
                          <AiOutlineLike style={{fontSize: '1.2rem'}} />
                        </>
                      ) : (
                        <>
                          <AiOutlineDislike style={{fontSize: '1.2rem'}} />
                        </>
                      )
                  }
                </StatusButton>
              </PresencaItem>
            ))}
          </PresencasList>
        </Card>
      </Container>
    </>
  );
};

export default Presencas;