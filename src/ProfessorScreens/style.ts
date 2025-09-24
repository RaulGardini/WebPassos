import styled from "styled-components";

export const Container = styled.div`
  padding: 1rem;
  height: 100vh;
  background-color: #1f1f1fff;
  align-items: center;
  display: flex;
  flex-direction: column;
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
    width: 90%
`;

export const ProfessorName = styled.h1`
    font-family: 'Arial', sans-serif;
    color: #3a3a3aff;
    font-weight: bold;
`;

export const AddChamadasButton = styled.button`
background: rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(25px);
            -webkit-backdrop-filter: blur(25px);
            border-radius: 20px;
            padding: 2rem 1rem;
            text-align: center;
            border: 1px solid rgba(255, 255, 255, 0.18);
            box-shadow:
                0 25px 45px rgba(0, 0, 0, 0.1),
                0 10px 20px rgba(0, 0, 0, 0.05),
                inset 0 1px 0 rgba(255, 255, 255, 0.3),
                inset 0 -1px 0 rgba(0, 0, 0, 0.1);
            position: relative;
            width: 90%;
            color: #e9e9e9ff
            font-family: 'Arial', sans-serif;
            font-size: 1.5rem;
`;

export const Chamada = styled.button`
background: rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(25px);
            -webkit-backdrop-filter: blur(25px);
            border-radius: 20px;
            padding: 2rem 1rem;
            text-align: center;
            border: 1px solid rgba(255, 255, 255, 0.18);
            box-shadow:
                0 25px 45px rgba(0, 0, 0, 0.1),
                0 10px 20px rgba(0, 0, 0, 0.05),
                inset 0 1px 0 rgba(255, 255, 255, 0.3),
                inset 0 -1px 0 rgba(0, 0, 0, 0.1);
            position: relative;
            width: 90%;
            color: #e9e9e9ff
            font-family: 'Arial', sans-serif;
            font-size: 1.5rem;
`;

export const ChamadaTitle = styled.h5`
color: #ffffffff;
font-family: 'Arial', sans-serif;
font-size: 1.8rem;
font-weight: bold;
margin: 0 0 5px 0;
`;

export const ChamadaInfo = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  margin: 8px 0;
`;

export const InfoText = styled.p<{ variant?: 'primary' | 'secondary' }>`
  color: ${props => props.variant === 'secondary' ? '#999' : '#666'};
  margin: 4px 0;
  font-size: ${props => props.variant === 'secondary' ? '0.9rem' : '1rem'};
`;

export const EmptyStateCard = styled.div`
            text-align: center;
            position: relative;
            width: 90%;
            color: #e9e9e9ff
            font-family: 'Arial', sans-serif;
            font-size: 1.5rem;
`;

export const EmptyStateTitle = styled.h3`
  color: #dadadaff;
  font-family: 'Arial', sans-serif;
  margin-bottom: 10px;
  font-size: 1.5rem;
`;

export const EmptyStateText = styled.p<{ variant?: 'primary' | 'secondary' }>`
  color: ${props => props.variant === 'secondary' ? '#999' : '#666'};
  font-size: ${props => props.variant === 'secondary' ? '0.9rem' : '1.1rem'};
  margin: ${props => props.variant === 'secondary' ? '10px 0 0 0' : '0'};
`;

export const LoadingContainer = styled.div`
  text-align: center;
  padding: 20px;
  
  p {
    color: #666;
    font-size: 1.1rem;
  }
`;

export const Subtitle = styled.p`
  color: #252525;
  font-size: 1.2rem;
  font-family: 'Arial', sans-serif;
  margin: 0;
`;

export const ChamadasContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
  max-width: 600px;
`;

export const ChamadaCard = styled.div`
  background: rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(25px);
            -webkit-backdrop-filter: blur(25px);
            border-radius: 20px;
            padding: 2rem 1rem;
            text-align: center;
            border: 1px solid rgba(255, 255, 255, 0.18);
            box-shadow:
                0 25px 45px rgba(0, 0, 0, 0.1),
                0 10px 20px rgba(0, 0, 0, 0.05),
                inset 0 1px 0 rgba(255, 255, 255, 0.3),
                inset 0 -1px 0 rgba(0, 0, 0, 0.1);
            position: relative;
            width: 90%;
            color: #e9e9e9ff
            font-family: 'Arial', sans-serif;
            font-size: 1.5rem;
`;