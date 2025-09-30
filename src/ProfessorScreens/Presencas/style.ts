import styled from 'styled-components';

export const Container = styled.div`
  padding: 1rem;
  min-height: 100vh;
  background-color: #1f1f1fff;
  align-items: center;
  display: flex;
  flex-direction: column;
  font-family: arial;
`;

export const Card = styled.div`
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

export const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: #e7e7e7ff;
  margin-bottom: 8px;
`;

export const StatsContainer = styled.div`
  display: grid;
  display: flex;
  justify-content: space-betwen;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`;

export const StatCard = styled.div`
  border-radius: 8px;
  padding: 16px;
  text-align: center;
`;

export const StatLabel = styled.div<{ variant?: 'presente' | 'falta' }>`
color: ${props => 
    props.variant === 'presente' ? '#00ff3cff' :
    props.variant === 'falta' ? '#ff0015ff' :
    '#f8f9fa'
  };
  font-size: 14px;
  margin-bottom: 8px;
`;

export const StatValue = styled.div<{ variant?: 'presente' | 'falta' }>`
color: ${props => 
    props.variant === 'presente' ? '#00ff3cff' :
    props.variant === 'falta' ? '#ff0015ff' :
    '#f8f9fa'
  };
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
  background: #c2c2c2ff;
  border-radius: 8px;
  border: 1px solid #dee2e6;
  transition: all 0.2s;

  &:hover {
    background: #e9ecef;
  }
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
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(25px);
            -webkit-backdrop-filter: blur(25px);
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.18);
            box-shadow:
                0 25px 45px rgba(0, 0, 0, 0.1),
                0 10px 20px rgba(0, 0, 0, 0.05),
                inset 0 1px 0 rgba(255, 255, 255, 0.3),
                inset 0 -1px 0 rgba(0, 0, 0, 0.1);
    padding: 0.75rem 1.5rem;
    margin-bottom: 1rem;
    font-size: 0.95rem;
    color: #e7e7e7ff;
    cursor: pointer;
    transition: all 0.2s ease;
    width: 100%;
    justify-content: center;

    &:hover {
        background: #f8f9fa;
        border-color: #007bff;
        color: #007bff;
    }

    svg {
        font-size: 1.2rem;
    }
`;

export const TopLine = styled.div`
    width: 60px;
    height: 3px;
    background-color: #ff0000ff;
    margin: 0.5rem auto 1.5rem;
    border-radius: 2px;
`;