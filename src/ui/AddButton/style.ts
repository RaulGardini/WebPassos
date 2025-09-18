import styled from "styled-components";

export const AddButton = styled.button<{ active?: boolean }>`
  background-color: ${props => props.active ? '#2a9c33' : '#36BC3F'};
  font-size: 1.4rem;
  width: 7.225rem;
  height: 2.5rem;
  display: flex;
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 1.875rem;
  cursor: pointer;
  cursor: pointer;
   align-items: center;

  &:hover {
     background-color: ${props => props.active ? '#2a9c33' : '#4be255ff'};
   }
`;