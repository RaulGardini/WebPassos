import { useState, useEffect } from "react";
import Header from '../../Header/header';
import { FiUsers, FiTrendingUp, FiCalendar, FiActivity } from "react-icons/fi";
import { MdPeople } from "react-icons/md";
// import { useNavigate } from "react-router-dom";
import { getInfoEscola } from "../../services/homeService";
import type { EscolaInfoData } from '../../Models/home';
import { getAulasHoje } from "../../services/turmasHojeService";
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
    LoadingState,
    ErrorState
} from "./style";
import { Container } from '../../ui/Container/style';

interface AulasHojeData {
  total_aulas: number;
}

function Home() {
  const [ocupacaoData, setOcupacaoData] = useState<EscolaInfoData | null>(null);
  const [aulasHoje, setAulasHoje] = useState<AulasHojeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const navigate = useNavigate();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [ocupacao, aulas] = await Promise.all([
          getInfoEscola(),
          getAulasHoje()
        ]);
        
        setOcupacaoData(ocupacao);
        setAulasHoje(aulas);
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
            Carregando dashboard...
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
          {/* Card de Ocupação Total */}
          <Card className={`ocupacao-${ocupacaoData?.status_ocupacao}`}>
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
          </Card>

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
      </Container>
    </>
  );
}

export default Home;