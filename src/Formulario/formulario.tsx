import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Form,
  FormularioContainer,
  Title,
  Button
} from './style';

function Formulario() {
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // evita o refresh da página
    
    setIsLoading(true); // inicia o loading
    setMensagem(""); // limpa mensagens anteriores

    try {
      const response = await axios.post("http://localhost:3000/usuarios/login", {
        login,
        senha
      });

      console.log("Usuário logado:", response.data.usuario);
      navigate("/home");

      // 👉 aqui você poderia salvar no localStorage, por exemplo:
      // localStorage.setItem("usuario", JSON.stringify(response.data.usuario));
    } catch (error: any) {
      if (error.response) {
        setMensagem(`❌ ${error.response.data.message}`);
      } else {
        setMensagem("❌ Erro de conexão com o servidor");
      }
    } finally {
      setIsLoading(false); // finaliza o loading
    }
  };

  return (
    <FormularioContainer>
      <Title>Web Passos</Title>
      <Form onSubmit={handleSubmit}>
        <label htmlFor="usuario">Usuário</label>
        <input
          type="text"
          placeholder="Usuário"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          disabled={isLoading}
        />

        <label htmlFor="senha">Senha</label>
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          disabled={isLoading}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Carregando..." : "Entrar"}
        </Button>
      </Form>

      {mensagem && <p>{mensagem}</p>}
    </FormularioContainer>
  );
}

export default Formulario;