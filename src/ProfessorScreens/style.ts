import styled from "styled-components";

export const Container = styled.div`
  padding: 1.5rem;
  height: 100vh;
  background-color: #1f1f1fff;
`;

export const ProfessorInfoCard = styled.div`
    background-color: #e2e2e2ff;
    border-radius: 12px;
    padding: 0.8rem;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    margin-bottom: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 2px solid #ff0000ff;
`;

export const ProfessorName = styled.h1`
    font-family: 'Arial', sans-serif;
    color: #3a3a3aff;
    font-weight: bold;
`;