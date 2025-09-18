import styled from 'styled-components';

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
  margin: 1.4rem 0 0 2rem;
`;

export const InfoHeader = styled.div`
  background: #ffffffff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
`;

export const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 0.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  color: #666;
  
  svg {
    color: #d80d0dff;
  }
  
  strong {
    color: #333;
  }
`;

export const RefreshButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  margin-bottom: 2rem;
  transition: background-color 0.2s;
  
  &:hover {
    background: #0056b3;
  }
  
  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;

export const AulasGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

export const AulaCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s, box-shadow 0.2s;
`;

export const AulaHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
`;

export const AulaTitulo = styled.h3`
  margin: 0;
  color: #333;
  font-size: 1.25rem;
  font-weight: 600;
  flex: 1;
`;

export const AulaHorario = styled.div`
  background: #ff0000be;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

export const AulaInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

export const AulaInfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #666;
  
  svg {
    color: #ff0000ff;
    font-size: 1rem;
  }
  
  span {
    color: #333;
    font-weight: 500;
  }
`;

export const AulaActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
`;

export const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid #ff0000ff;
  background: transparent;
  color: #ff0000ff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
  
  &:hover {
    background: #ff0000ff;
    color: white;
  }
`;

export const LoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #666;
  font-size: 1.1rem;
`;

export const ErrorState = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border-radius: 4px;
  border: 1px solid #f5c6cb;
  margin: 1rem 0;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
  
  h3 {
    color: #333;
    margin-bottom: 0.5rem;
  }
  
  p {
    margin: 0;
    font-size: 1rem;
  }
`;