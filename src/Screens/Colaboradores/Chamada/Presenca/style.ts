import styled from 'styled-components';

export const Card = styled.div`
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

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

export const StatsContainer = styled.div`
  margin-top: 1rem;
  background: #ffffffff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  margin-bottom: 2rem;
  font-family: arial;
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

export const StatCard = styled.div`
  border-radius: 8px;
  padding: 16px;
  text-align: center;
`;

export const StatLabel = styled.div`
  color: #575757ff;
  font-size: 14px;
  margin-bottom: 8px;
`;

export const StatValue = styled.div`
  color: #575757ff;
  font-size: 32px;
  font-weight: bold;
`;

export const PresencasList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const PresencaItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #fcfcfcff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  transition: all 0.2s;
`;

export const AlunoInfo = styled.div`
  flex: 1;
`;

export const AlunoNome = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #333;
`;

export const StatusButton = styled.button<{ status: 'presente' | 'falta' }>`
  padding: 8px 24px;
  border-radius: 6px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background: ${props => props.status === 'presente' ? '#28a745' : '#dc3545'};
  color: white;

  &:hover:not(:disabled) {
    opacity: 0.8;
    transform: scale(1.02);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-size: 18px;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

export const BackButton = styled.button`
  background-color: #211F1F;
  color: white;
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin: 1rem 1rem;

  &:hover {
    background-color: #494444ff;
  }
`;

export const TopLine = styled.div`
  border-top: 1px solid red;
  flex: 1;
  margin: 2rem 0 0 2rem;
`;