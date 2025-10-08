import { useState, useEffect } from "react";
import Header from '../../Header/header';
import { FiUsers, FiTrendingUp, FiCalendar, FiActivity } from "react-icons/fi";
import { MdPeople } from "react-icons/md";
// import { useNavigate } from "react-router-dom";
import { getInfoEscola } from "../../services/homeService";
import type { EscolaInfoData } from '../../Models/home';
import { getAulasHoje } from "../../services/turmasHojeService";
import { getMatriculasMov } from "../../services/matriculasMovService"
import type { MatriculasMov } from "../../Models/matriculasMov"
import {
  Title,
  TopLine,
  DisplayFlex,
  DashboardGrid,
  Card,
  CardHeader,
  CardTitle,
  CardValue,
  CardSubtitle,
  StatusBadge,
  ProgressBar,
  ProgressFill,
  ErrorState,
  GraficosContainer,
  GraphicCard,
  GraphicGrid,
  MovContainer,
  RealEncerrContainer
} from "./style";
import { LoadingState } from '../../ui/Loading/style';
import { Container } from '../../ui/Container/style';

interface AulasHojeData {
  total_aulas: number;
}

function Home() {
  const [ocupacaoData, setOcupacaoData] = useState<EscolaInfoData | null>(null);
  const [aulasHoje, setAulasHoje] = useState<AulasHojeData | null>(null);
  const [matriculasMov, setMatriculasMov] = useState<MatriculasMov | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const navigate = useNavigate();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [ocupacao, aulas, matriculasMov] = await Promise.all([
          getInfoEscola(),
          getAulasHoje(),
          getMatriculasMov()
        ]);

        setOcupacaoData(ocupacao);
        setAulasHoje(aulas);
        setMatriculasMov(matriculasMov);
      } catch (err) {
        console.error('Erro ao carregar dados do dashboard:', err);
        setError('Erro ao carregar dados do dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'baixa':
        return 'Ocupação baixa - Há muitas vagas disponíveis';
      case 'media':
        return 'Ocupação média - Situação equilibrada';
      case 'alta':
        return 'Ocupação alta - Poucas vagas disponíveis';
      case 'lotado':
        return 'Turmas lotadas - Sem vagas disponíveis';
      default:
        return 'Status da ocupação';
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <Container>
          <LoadingState>
          </LoadingState>
        </Container>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <Container>
          <Title>Dashboard - WebPassos</Title>
          <ErrorState>
            {error}
          </ErrorState>
        </Container>
      </>
    );
  }

  return (
    <>
      <Header />
      <Container>
        <DisplayFlex>
          <Title>Dashboard - WebPassos</Title>
          <TopLine></TopLine>
        </DisplayFlex>

        <DashboardGrid>
          {/* Card de Matrículas Ativas */}
          <Card>
            <CardHeader>
              <CardTitle>
                <MdPeople />
                Alunos Matriculados
              </CardTitle>
            </CardHeader>
            <CardValue>{ocupacaoData?.matriculas_ativas || 0}</CardValue>
            <CardSubtitle>
              Total de matrículas ativas
            </CardSubtitle>
          </Card>

          {/* Card de Vagas Disponíveis */}
          <Card>
            <CardHeader>
              <CardTitle>
                <FiTrendingUp />
                Vagas Disponíveis
              </CardTitle>
            </CardHeader>
            <CardValue>{ocupacaoData?.vagas_disponiveis || 0}</CardValue>
            <CardSubtitle>
              De {ocupacaoData?.capacidade_total || 0} vagas totais
            </CardSubtitle>
          </Card>

          {/* Card de Aulas Hoje */}
          <Card>
            <CardHeader>
              <CardTitle>
                <FiCalendar />
                Aulas Hoje
              </CardTitle>
            </CardHeader>
            <CardValue>{aulasHoje?.total_aulas || 0}</CardValue>
            <CardSubtitle>
              {new Date().toLocaleDateString('pt-BR', {
                weekday: 'long',
                day: '2-digit',
                month: '2-digit'
              })}
            </CardSubtitle>
          </Card>

          {/* Card de Turmas Ativas */}
          <Card>
            <CardHeader>
              <CardTitle>
                <FiActivity />
                Turmas Ativas
              </CardTitle>
            </CardHeader>
            <CardValue>{ocupacaoData?.detalhes.total_turmas_ativas || 0}</CardValue>
            <CardSubtitle>
              Turmas em funcionamento
            </CardSubtitle>
          </Card>

          {/* Card de Capacidade Total */}
          <Card>
            <CardHeader>
              <CardTitle>
                <FiUsers />
                Capacidade Total
              </CardTitle>
            </CardHeader>
            <CardValue>{ocupacaoData?.capacidade_total || 0}</CardValue>
            <CardSubtitle>
              Máximo de alunos possível
            </CardSubtitle>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <FiUsers />
                Total de alunas
              </CardTitle>
            </CardHeader>
            <CardValue>{ocupacaoData?.detalhes.total_alunos || 0}</CardValue>
            <CardSubtitle>
              total de alunos matriculados e não matriculados
            </CardSubtitle>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <FiUsers />
                Total de colaboradores
              </CardTitle>
            </CardHeader>
            <CardValue>{ocupacaoData?.detalhes.total_colaboradores || 0}</CardValue>
            <CardSubtitle>
              Total de todos os colaboradores
            </CardSubtitle>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <FiUsers />
                Total de salas
              </CardTitle>
            </CardHeader>
            <CardValue>{ocupacaoData?.detalhes.total_salas || 0}</CardValue>
            <CardSubtitle>
              Total de salas na academia
            </CardSubtitle>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <FiUsers />
                Total de modalidades
              </CardTitle>
            </CardHeader>
            <CardValue>{ocupacaoData?.detalhes.total_modalidades || 0}</CardValue>
            <CardSubtitle>
              Total de modalidades na academia
            </CardSubtitle>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <FiUsers />
                Total de cargos
              </CardTitle>
            </CardHeader>
            <CardValue>{ocupacaoData?.detalhes.total_cargos || 0}</CardValue>
            <CardSubtitle>
              Total de cargos na academia
            </CardSubtitle>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <FiUsers />
                Total de fornecedores
              </CardTitle>
            </CardHeader>
            <CardValue>{ocupacaoData?.detalhes.total_fornecedores || 0}</CardValue>
            <CardSubtitle>
              Total de fornecedores na academia
            </CardSubtitle>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <FiUsers />
                Total de usuarios
              </CardTitle>
            </CardHeader>
            <CardValue>{ocupacaoData?.detalhes.total_usuarios || 0}</CardValue>
            <CardSubtitle>
              Total de usuarios do sistema
            </CardSubtitle>
          </Card>
        </DashboardGrid>
        <GraficosContainer>
          <GraphicCard className={`ocupacao-${ocupacaoData?.status_ocupacao}`}>
            <CardHeader>
              <CardTitle>
                <FiUsers />
                Ocupação Geral
              </CardTitle>
              <StatusBadge status={ocupacaoData?.status_ocupacao || 'baixa'}>
                {ocupacaoData?.status_ocupacao || 'N/A'}
              </StatusBadge>
            </CardHeader>
            <CardValue>{ocupacaoData?.porcentagem_ocupacao || 0}%</CardValue>
            <CardSubtitle>
              {getStatusMessage(ocupacaoData?.status_ocupacao || 'baixa')}
            </CardSubtitle>
            <ProgressBar>
              <ProgressFill
                percentage={ocupacaoData?.porcentagem_ocupacao || 0}
                status={ocupacaoData?.status_ocupacao || 'baixa'}
              />
            </ProgressBar>
          </GraphicCard>

          <GraphicCard>
            <CardHeader>
              <CardTitle>
                <FiActivity />
                Matrículas - Status
              </CardTitle>
            </CardHeader>
            <GraphicGrid>
              <svg width="180" height="180" viewBox="0 0 200 200">
                {(() => {
                  const realizadas = matriculasMov?.total_realizadas || 0;
                  const encerradas = matriculasMov?.total_encerradas || 0;
                  const total = realizadas + encerradas;
                  
                  if (total === 0) {
                    return (
                      <>
                        <circle cx="100" cy="100" r="80" fill="none" stroke="#e9ecef" strokeWidth="40" />
                        <text x="100" y="105" textAnchor="middle" fontSize="20" fill="#666" fontWeight="bold">0</text>
                      </>
                    );
                  }
                  
                  const percent = (realizadas / total) * 100;
                  const circumference = 2 * Math.PI * 80;
                  const realizadasLength = (percent / 100) * circumference;
                  const encerradasLength = circumference - realizadasLength;
                  
                  return (
                    <>
                      {/* Círculo de fundo (encerradas) */}
                      <circle
                        cx="100"
                        cy="100"
                        r="80"
                        fill="none"
                        stroke="#dc3545"
                        strokeWidth="40"
                      />
                      {/* Círculo sobreposto (realizadas) */}
                      <circle
                        cx="100"
                        cy="100"
                        r="80"
                        fill="none"
                        stroke="#28a745"
                        strokeWidth="40"
                        strokeDasharray={`${realizadasLength} ${encerradasLength}`}
                        strokeDashoffset={circumference / 4}
                        transform="rotate(-90 100 100)"
                      />
                    </>
                  );
                })()}
              </svg>
              <MovContainer>
                <RealEncerrContainer>
                  <div style={{ width: '16px', height: '16px', background: '#28a745', borderRadius: '3px' }}></div>
                  <span style={{ fontSize: '0.9rem', color: '#333', fontWeight: '500' }}>
                    Realizadas: <strong>{matriculasMov?.total_realizadas || 0}</strong>
                  </span>
                </RealEncerrContainer>
                <RealEncerrContainer>
                  <div style={{ width: '16px', height: '16px', background: '#dc3545', borderRadius: '3px' }}></div>
                  <span style={{ fontSize: '0.9rem', color: '#333', fontWeight: '500' }}>
                    Encerradas: <strong>{matriculasMov?.total_encerradas || 0}</strong>
                  </span>
                </RealEncerrContainer>
              </MovContainer>
            </GraphicGrid>
          </GraphicCard>
        </GraficosContainer>
      </Container>
    </>
  );
}

export default Home;