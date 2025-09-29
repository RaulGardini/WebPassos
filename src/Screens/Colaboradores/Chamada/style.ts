import styled from 'styled-components';

export const Title = styled.h1`
  font-size: 3rem;
  margin: 0;
  margin-bottom: 0.8rem;
  color: black;
  font-family: 'Arial', sans-serif;
`;

export const DisplayFlex = styled.div`
  display: flex;
`;

export const TopLine = styled.div`
  border-top: 1px solid red;
  flex: 1;
  margin: 2rem 0 0 2rem;
`;

export const MidLine = styled.div`
  border-top: 1px solid red;
  width: 100%;
  margin: 1.5rem 0 0 0;
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

export const MonthsContainer = styled.div`
    margin: 2rem 0;
    width: 50%;
    font-family: arial;
`;

export const MonthTitle = styled.h2`
    font-size: 1.3rem;
    color: #333;
    margin-bottom: 1.5rem;
    font-weight: 500;
    text-align: center;
`;

export const MonthCard = styled.div`
    padding: 2rem;
    border: 2px solid #ff0000ff;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    background: #bebebeff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

    &:hover {
        border-color: #ff0000ff;
        background-color: #d4d4d4ff;
        box-shadow: 0 4px 8px rgba(0, 123, 255, 0.15);
    }

    &:active {
        transform: translateY(0);
    }

    strong {
        color: #333;
        font-size: 1.1rem;
    }
`;

export const ChamadasInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    background-color: #f8f9fa;
    border-left: 4px solid #007bff;
    border-radius: 4px;
    margin-bottom: 1.5rem;
    font-weight: 500;
    color: #333;

    svg {
        color: #007bff;
        font-size: 1.1rem;
    }
`;

export const TableContainer = styled.div``;

export const LoadingState = styled.div`
    text-align: center;
    font-family: arial;
    padding: 3rem;
    color: #666;
    font-size: 1.1rem;

    &::before {
        content: '';
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 2px solid #f3f3f3;
        border-top: 2px solid #ff0000ff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-right: 0.5rem;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;

export const ErrorState = styled.div`
    text-align: center;
    padding: 3rem;
    color: #dc3545;
    font-size: 1.1rem;
    background: #fff5f5;
    border: 1px solid #f5c6cb;

    &::before {
        content: '⚠️';
        display: block;
        font-size: 2rem;
        margin-bottom: 0.5rem;
    }
`;

export const EmptyState = styled.div`
    text-align: center;
    padding: 3rem;
    color: #666;
    font-size: 1.1rem;
    font-family: 'arial';

    &::before {
        display: block;
        font-size: 3rem;
        margin-bottom: 1rem;
        opacity: 0.5;
    }
`;

export const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
    background-color: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    overflow: hidden;
`;

export const TableHeader = styled.thead`
    background-color: #211F1F;
`;

export const TableHeaderCell = styled.th`
    padding: 12px 16px;
    text-align: left;
    font-weight: 600;
    color: #d8d8d8ff;
    font-family: 'Arial', sans-serif;
    font-size: 14px;
    
    &.center {
        text-align: center;
    }
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr<{ index: number }>`
    transition: background-color 0.2s;
    background-color: ${props => props.index % 2 === 0 ? '#fff' : '#e9e9e9ff'};
`;

export const TableCell = styled.td<{ fontWeight?: string; color?: string; textAlign?: string }>`
    padding: 8px 10px;
    font-size: 14px;
    color: ${props => props.color || '#495057'};
    font-weight: ${props => props.fontWeight || 'normal'};
    text-align: ${props => props.textAlign || 'left'};
`;

export const ActionButtons = styled.div`
    display: flex;
    gap: 8px;
    justify-content: center;
`;

export const EditButton = styled.button`
    border: none;
    border-radius: 4px;
    background-color: transparent;
    cursor: pointer;
    font-size: 1rem;
    transition: transform 0.2s, color 0.2s;

    &:hover {
        transform: scale(1.2);
        color: red;
    }
`;