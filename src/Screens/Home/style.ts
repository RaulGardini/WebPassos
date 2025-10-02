import styled from 'styled-components';

export const DisplayFlex = styled.div`
  display: flex;
`;

export const Title = styled.h1`
  font-size: 2rem;
  margin: 0;
  margin-bottom: 0.8rem;
  color: black;
  font-family: 'Arial', sans-serif;
`;

export const TopLine = styled.div`
  border-top: 1px solid red;
  flex: 1;
  margin: 1.5rem 0 0 2rem;
`;

export const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 0 15rem 4rem;
`;

export const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 0.5rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
  border: 1px solid #ff0000ff;

  &.ocupacao-baixa {
    border-left-color: #28a745;
  }
  
  &.ocupacao-media {
    border-left-color: #ffc107;
  }
  
  &.ocupacao-alta {
    border-left-color: #fd7e14;
  }
  
  &.ocupacao-lotado {
    border-left-color: #dc3545;
  }
`;

export const GraphicCard = styled.div`
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
  padding: 0.5rem;
  width: 25%;
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

export const CardTitle = styled.h3`
  font-size: 1rem;
  color: #666;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const CardValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.5rem;
`;

export const CardSubtitle = styled.p`
  color: #888;
  margin: 0;
  font-size: 0.9rem;
`;

export const StatusBadge = styled.span<{ status: string }>`
  padding: 0.25rem 0.5rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  
  ${props => {
    switch (props.status) {
      case 'baixa':
        return 'background: #d4edda; color: #155724;';
      case 'media':
        return 'background: #fff3cd; color: #856404;';
      case 'alta':
        return 'background: #f8d7da; color: #721c24;';
      case 'lotado':
        return 'background: #f5c6cb; color: #721c24;';
      default:
        return 'background: #e2e3e5; color: #495057;';
    }
  }}
`;

export const ProgressBar = styled.div`
  background: #e9ecef;
  border-radius: 10px;
  height: 8px;
  overflow: hidden;
  margin-top: 1rem;
`;

export const ProgressFill = styled.div<{ percentage: number; status: string }>`
  height: 100%;
  border-radius: 10px;
  transition: width 0.3s ease;
  width: ${props => props.percentage}%;
  
  ${props => {
    switch (props.status) {
      case 'baixa':
        return 'background: linear-gradient(90deg, #28a745, #20c997);';
      case 'media':
        return 'background: linear-gradient(90deg, #ffc107, #fd7e14);';
      case 'alta':
        return 'background: linear-gradient(90deg, #fd7e14, #e83e8c);';
      case 'lotado':
        return 'background: linear-gradient(90deg, #dc3545, #c82333);';
      default:
        return 'background: linear-gradient(90deg, #007bff, #0056b3);';
    }
  }}
`;

export const ErrorState = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  border-left: 4px solid #dc3545;
`;

export const GraficosContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
`;

export const GraphicGrid = styled.div`
display: flex; 
flex-direction: column; 
align-items: center; 
gap: 1rem; 
padding: 1rem;
`;

export const MovContainer = styled.div`
display: flex; 
flex-direction: column;
gap: 0.5rem;
width: 100%;
`;

export const RealEncerrContainer = styled.div`
display: flex;
align-items: center;
gap: 0.5rem;
`;