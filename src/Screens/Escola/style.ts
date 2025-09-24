import styled from "styled-components";

export const Title = styled.h1`
  font-family: 'Arial', sans-serif;
  display: flex;
  justify-content: center;
  font-size: 3rem;
`;

export const HorizontalLine = styled.div`
  border-top: 1px solid red;
  width: 45%;
  margin: 4rem 2rem 0 2rem;
`;

export const VerticalLine = styled.div`
   border-left: 1px solid red;
   height: 60vh;
`;

export const DisplayFlex = styled.div`
  display: flex;
`;

export const ContainerSala = styled.div`
    width: 33%;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'Arial', sans-serif;
`;

export const ContainerModalidade = styled.div`
    width: 33%;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'Arial', sans-serif;
`;

export const ContainerCargo = styled.div`
    width: 33%;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'Arial', sans-serif;
`;

export const FilterContainer = styled.div`
    display: flex;
    margin-top: 1rem
`;

export const Filter = styled.input`
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-family: 'Arial', sans-serif;
    font-size: 1rem;
    margin: 0.5rem 0;
`;

export const ButtonFind = styled.button`
font-size: 1.5rem;
border: none;
background-color: #D9D55B;
width: 50px;
border-radius: 10px;
margin-left: 0.3rem;
margin-left: 0.3rem;

&:hover {
    background-color: #c8c83f;
}
`;

export const LimparFilter = styled.button`
    font-size: 1.5rem;
    border: none;
    color: white;
    background-color: #1d1d1dff;
    width: 50px;
    border-radius: 10px;
    margin-left: 0.3rem;
    margin-left: 0.3rem;

&:hover {
    background-color: #313131ff;

`;

export const SalaModalCaargoItemContainer = styled.div`
    width: 90%;
    max-height: 550px;   /* altura máxima visível */
    overflow-y: auto;    /* rolagem vertical */
    overflow-x: auto;    /* rolagem horizontal, se precisar */
    padding: 0.5rem;
`;

export const SalaItem = styled.div`
    width: 85%;
    border-radius: 0.625rem;
    border: 5px solid #D42626;
    background: #D9D9D9;
    margin: 1rem;
    padding: 0.3rem 1rem 0.3rem 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const ModalidadeItem = styled.div`
    width: 85%;
    border-radius: 0.625rem;
    border: 5px solid #7A26D4;
    background: #D9D9D9;
    margin: 1rem;
    padding: 0.3rem 1rem 0.3rem 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const CargoItem = styled.div`
    width: 85%;
    border-radius: 0.625rem;
    border: 5px solid #26D4C0;
    background: #D9D9D9;
    margin: 1rem;
    padding: 0.3rem 1rem 0.3rem 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ModalContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 300px;
`;

export const ButtonSalvar = styled.button`
  background-color: green;
  color: white;
  border: none;
  padding: 0.7rem;
  border-radius: 8px;
  cursor: pointer;
`;

export const ButtonCancelar = styled.button`
  background-color: #161616ff;
  color: white;
  border: none;
  padding: 0.7rem;
  border-radius: 8px;
  cursor: pointer;
`;

export const ButtonsModal = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
`;

export const Input = styled.input`
  width: 90%;
  padding: 0.75rem 1rem;
  margin-top: 1rem;

  border: 2px solid #ccc;
  border-radius: 8px;

  font-size: 1rem;
  font-family: 'Arial', sans-serif;
  color: #333;

  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #f81616ff; /* cor que você usou na borda */
    box-shadow: 0 0 6px rgba(248, 22, 210, 0.4);
  }

  &::placeholder {
    color: #aaa;
    font-style: italic;
  }
`;

export const ActionButton = styled.button`
    border: none;
    border-radius: 4px;
    background-color: transparent;
    cursor: pointer;
    font-size: 1.5rem;
    transition: transform 0.2s, color 0.2s;

    &:hover {
        transform: scale(1.2);
        color: red;
    }
`;