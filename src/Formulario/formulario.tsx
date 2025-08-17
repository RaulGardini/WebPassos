import {
  Form,
  FormularioContainer,
  Title,
  Button
} from './style';
import minhaImagem from '../assets/Logo.png';

function Formulario() {
  return (
    <FormularioContainer>
      <Title>Web
        Passos</Title>
      <Form>
      <form action="">
        <label htmlFor="">Usuario</label>
        <input type="text" placeholder="Usuario" />
        <label htmlFor="">Senha</label>
        <input type="password" placeholder="Senha" />
        <Button type="submit">Entrar</Button>
      </form></Form>
    </FormularioContainer>
  );
}

export default Formulario;