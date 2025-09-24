import styled from "styled-components";

export const FormularioContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #222222;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2% 5%;
  box-sizing: border-box;
`;

export const Form = styled.form`
  background-color: #d3d3d3ff;
  padding: 2rem;
  font-size: clamp(1.2rem, 2vw, 0.2rem);
  font-family: 'Arial', sans-serif;
  border-radius: 10px;
  width: 100%;
  max-width: 250px;
  min-width: 300px;
  box-sizing: border-box;

  /* Desktop */
  @media (min-width: 1200px) {
    width: 25%;
    padding: 2rem;
  }

  /* Tablet */
  @media (min-width: 768px) and (max-width: 1199px) {
    width: 50%;
    padding: 2.5%;
  }

  /* Mobile */
  @media (max-width: 767px) {
    width: 90%;
    padding: 5%;
    margin: 0 2.5%;
  }

  label {
    margin-top: 8%;
    color: #535353ff;
    font-weight: 500;
    font-size: clamp(0.7rem, 1.5vw, 0.85rem);
    
    @media (max-width: 767px) {
      margin-top: 6%;
    }
  }

  input {
    padding: 3.5%;
    margin-bottom: 6%;
    border: 1px solid #d1d1d1ff;
    border-radius: 8px;
    width: 100%;
    box-sizing: border-box;
    font-size: clamp(0.9rem, 2vw, 1rem);
    transition: border-color 0.3s ease;
    background-color: #ecececff;

    &:focus {
      outline: none;
      border-color: #d1d1d1ff;
    }

    &:disabled {
      background-color: #e7e7e7ff;
      cursor: not-allowed;
    }

    @media (max-width: 767px) {
      padding: 4%;
      margin-bottom: 5%;
    }
  }
`;

export const Title = styled.h1`
  margin-bottom: 1%;
  font-size: clamp(2.5rem, 8vw, 5rem);
  font-weight: 900;
  font-family: 'Arial', sans-serif;
  letter-spacing: 0.1em;
  text-align: center;
  
  /* Efeito vidro translúcido */
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.25) 0%,
    rgba(255, 255, 255, 0.15) 40%,
    rgba(255, 255, 255, 0.10) 70%,
    rgba(255, 255, 255, 0.20) 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  
  /* Contorno mais suave */
  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.15);
  
  /* Sombra quase invisível para dar profundidade */
  text-shadow: 0 2px 6px rgba(255, 255, 255, 0.08);
  
  position: relative;

  /* Responsividade específica para o título */
  @media (max-width: 767px) {
    margin-bottom: 10%;
    line-height: 1.1;
  }

  @media (max-width: 480px) {
    margin-bottom: 12%;
    letter-spacing: 0.05em;
  }
`;

export const Button = styled.button`
  background-color: #ff0000ff;
  height: 2.2rem;
  padding: 0.1rem 0.5rem;
  border-radius: 5px;
  font-size: clamp(0.8rem, 1.9vw, 0.9rem);
  margin-top: 4%;
  font-family: 'Arial', sans-serif;
  border: none;
  cursor: pointer;
  width: 100%;
  color: #ddddddff;
  font-weight: 100;
  transition: all 0.3s ease;
  box-sizing: border-box;

  &:hover:not(:disabled) {
    background-color: #c90000ff;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(255, 0, 0, 0.2);
  }

  @media (max-width: 767px) {
    padding: 4.5%;
    margin-top: 6%;
  }

  @media (max-width: 480px) {
    padding: 5%;
  }
`;