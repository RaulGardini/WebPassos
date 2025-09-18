// Screens/Professor/professor.jsx
import React, { useState, useEffect } from 'react';
import Header from '../ProfessorScreens/Header/header';
import { useNavigate } from 'react-router-dom';
import { 
  Container,
  ProfessorInfoCard,
  ProfessorName
 } from '../ProfessorScreens/style';

type Usuario = {
  nome?: string;
  login: string;
  tipo: string;
};

const Professor = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Verifica se o usuário está logado
    const usuarioLogado = localStorage.getItem("usuario");
    if (!usuarioLogado) {
      navigate("/");
      return;
    }

    const dadosUsuario = JSON.parse(usuarioLogado);

    // Verifica se é professor
    if (dadosUsuario.tipo !== 'Professor') {
      alert('Acesso negado! Apenas professores podem acessar esta área.');
      navigate("/");
      return;
    }

    setUsuario(dadosUsuario);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    navigate("/");
  };

  if (!usuario) {
    return <div>Carregando...</div>;
  }

  return (
    <>
    <Header />
      <Container>
          <ProfessorInfoCard>
              <ProfessorName>Ola, {usuario.nome}</ProfessorName>
              <p style={{color: '#252525ff', fontSize: '1.2rem', fontFamily: 'arial'}}>Vamos ao trabalho</p>
          </ProfessorInfoCard>
      </Container>
    </>
  );
};

export default Professor;