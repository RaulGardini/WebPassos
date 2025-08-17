import {Form, FormularioContainer} from'./style';

function Formulario() {
  return (
    <FormularioContainer>
    <Form><form action="">
        <input type="text" placeholder="Nome" />
        <input type="email" placeholder="Email" />
        <button type="submit">h</button>
    </form></Form>
    </FormularioContainer>
  );
}

export default Formulario;