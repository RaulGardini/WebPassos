// Screens/Professor/professor.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>👨‍🏫 Área do Professor</h1>
        <div style={styles.userInfo}>
          <span style={styles.welcomeText}>
            Bem-vindo, <strong>{usuario.nome || usuario.login}</strong>
          </span>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Sair
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        {/* Professor Info Card */}
        <div style={styles.professorInfoCard}>
          <div style={styles.professorIcon}>👨‍🏫</div>
          <div>
            <h2 style={styles.professorName}>{usuario.nome || usuario.login}</h2>
            <p style={styles.professorRole}>Professor</p>
          </div>
        </div>
      </main>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f6fa',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    backgroundColor: '#2f3542',
    color: 'white',
    padding: '20px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  title: {
    margin: 0,
    fontSize: '24px'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  welcomeText: {
    fontSize: '16px'
  },
  logoutBtn: {
    backgroundColor: '#ff4757',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold'
  },
  main: {
    padding: '30px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  professorInfoCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '25px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    marginBottom: '30px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    border: '2px solid #5352ed'
  },
  professorIcon: {
    fontSize: '48px'
  },
  professorName: {
    margin: '0 0 5px 0',
    color: '#2f3542',
    fontSize: '28px',
    fontWeight: 'bold'
  },
  professorRole: {
    margin: 0,
    color: '#5352ed',
    fontSize: '16px',
    fontWeight: '500'
  },
  cardContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    marginBottom: '40px'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '25px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    textAlign: 'center',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer'
  },
  cardIcon: {
    fontSize: '48px',
    marginBottom: '15px'
  },
  cardTitle: {
    margin: '0 0 10px 0',
    color: '#2f3542',
    fontSize: '20px'
  },
  cardDescription: {
    color: '#747d8c',
    marginBottom: '20px',
    lineHeight: '1.5'
  },
  cardButton: {
    backgroundColor: '#5352ed',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'background-color 0.2s'
  },
  quickInfo: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '25px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  quickInfoTitle: {
    margin: '0 0 20px 0',
    color: '#2f3542',
    textAlign: 'center'
  },
  quickInfoCards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '15px'
  },
  quickCard: {
    textAlign: 'center',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px'
  },
  quickCardNumber: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#5352ed',
    marginBottom: '5px'
  },
  quickCardLabel: {
    fontSize: '14px',
    color: '#747d8c'
  }
};

export default Professor;