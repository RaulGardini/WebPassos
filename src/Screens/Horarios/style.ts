import styled from "styled-components";

export const DisplayFlex = styled.div`
  display: flex;
`;

export const Title = styled.h1`
  font-size: 3rem;
  margin: 0;
  margin-bottom: 0.8rem;
  color: black;
  font-family: 'Arial', sans-serif;
`;

export const TopLine = styled.div`
  border-top: 1px solid red;
  flex: 1;
  margin: 2rem 0 0 2rem;
`;

export const DiaContainer = styled.div`
  width: 13%;
  margin-top: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const DiaTitle = styled.h1`
  font-size: 1.5rem;
  margin: 0;
  margin-bottom: 0.8rem;
  color: black;
  font-family: 'Arial', sans-serif;
`;

export const VerticalLine = styled.div`
   border-left: 1px solid red;
   height: 80vh;
`;

export const HorarioBox = styled.div`
  width: 9rem;
  height: 3.1875rem;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.25rem;
  border-radius: 0.9375rem;
  background: rgba(230, 169, 61, 0.75);
  font-size: 0.95rem;
  font-weight: 500;
  margin-top: 0.5rem;
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  width: 400px;
  max-width: 90%;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const ModalHeader = styled.div`
  h2 {
    margin: 0;
    font-size: 1.2rem;
    color: #333;
  }
`;

export const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

export const Input = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
`;

export const Button = styled.button<{ variant?: "save" | "cancel" }>`
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  color: #fff;
  background-color: ${({ variant }) =>
    variant === "save" ? "#4CAF50" : variant === "cancel" ? "#f44336" : "#007BFF"};

  &:hover {
    opacity: 0.9;
  }
`;
