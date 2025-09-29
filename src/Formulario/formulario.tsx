import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Form,
  FormularioContainer,
  Title,
  Button,
  LoadingState
} from './style';

function Formulario() {
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const redirecionarPorTipo = (tipo: string) => {
    switch (tipo) {
      case 'Admin':
        navigate("/home");
        break;
      case 'Professor':
        navigate("/professor");
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!login.trim() || !senha) {
      setMensagem("❌ Preencha todos os campos");
      return;
    }
    
    setIsLoading(true);
    setMensagem("");

    try {
      const response = await axios.post("http://localhost:3000/usuarios/login", {
        login: login.trim(),
        senha
      });

      const { usuario } = response.data;
      
      // Salva no localStorage (simples)
      localStorage.setItem("usuario", JSON.stringify(usuario));
      
      console.log("Login realizado:", usuario);
      redirecionarPorTipo(usuario.tipo);

    } catch (error: any) {
      if (error.response?.data?.message) {
        setMensagem(`❌ ${error.response.data.message}`);
      } else {
        setMensagem("❌ Erro de conexão");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormularioContainer>
      <Title>Web Passos</Title>
      <Form onSubmit={handleSubmit}>
        <label htmlFor="usuario">Usuário</label>
        <input
          type="text"
          id="usuario"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          disabled={isLoading}
        />

        <label htmlFor="senha">Senha</label>
        <input
          type="password"
          id="senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          disabled={isLoading}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? <LoadingState />: 'Entrar'}
        </Button>
      </Form>

      {mensagem && (
        <p style={{
          color: mensagem.includes('❌') ? 'red' : 'green',
          marginTop: '10px',
          textAlign: 'center',
          fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
          maxWidth: '90%'
        }}>
          {mensagem}
        </p>
      )}
    </FormularioContainer>
  );
}

export default Formulario;