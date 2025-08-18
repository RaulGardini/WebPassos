// src/components/Button.tsx
import styled from "styled-components";

export const FormularioContainer = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #222222;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const Form = styled.form`
  background-color: #d3d3d3ff;
  padding: 1rem;
  font-size: 1.5rem;
  font-family: 'Arial', sans-serif;
  border-radius: 12px;
  width: 20%;

  form {
    display: flex;
    flex-direction: column;
  }

  label{
  margin-top: 2rem;
  color: #535353ff;
  }

  input{
    padding: 0.5rem;
    margin-bottom: 1.5rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    width: 95%;
  }
`;

export const Title = styled.h1`
  font-size: 5rem;
            font-weight: 900;
            font-family: 'Arial', sans-serif;
            letter-spacing: 0.1em;
            background: linear-gradient(135deg, 
                rgba(255, 255, 255, 0.36) 0%,
                rgba(255, 255, 255, 0.30) 40%,
                rgba(255, 255, 255, 0.30) 60%,
                rgba(255, 255, 255, 0.30) 100%);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            -webkit-text-stroke: 1px rgba(255, 255, 255, 0.3);
            text-shadow: 0 1px 3px rgba(255, 255, 255, 0.1);
            position: relative;
`;

export const Button = styled.button`
  background-color: #ff0000ff;
  padding: 0.5rem;
  border-radius: 12px;
  font-size: 1.5rem;
  margin-top: 1rem;
  font-family: 'Arial', sans-serif;
  border: none;
  cursor: pointer;
  width: 100%;
  color: #ddddddff;

  &:hover {
    background-color: #c90000ff;
  }
`;