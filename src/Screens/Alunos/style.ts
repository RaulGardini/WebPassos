import styled from "styled-components";

export const ListAlunosContainer = styled.div`
  margin-right: 2rem;
  margin-left: 2rem;
//   background-color: #d6d6d6ff;
`;

export const DisplayFlex = styled.div`
  display: flex;
`;

export const AlunosTitle = styled.h1`
  font-size: 3rem;
  margin: 0;
  margin-bottom: 0.8rem;
  color: black;
  font-family: 'Arial', sans-serif;
`;

export const TopLine = styled.div`
  border-top: 1px solid red;
  width: 100%;
  margin: 2rem 0 0 2rem;
`;

export const MidLine = styled.div`
  border-top: 1px solid red;
  width: 100%;
  margin: 1.5rem 0 0 0;
`;

// Styled Components para os filtros
export const FilterContainer = styled.div`
    padding: 24px;
    margin: 20px 0;
`;

export const FilterGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 16px;
    margin-bottom: 16px;
    
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

export const FilterGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

export const FilterLabel = styled.label`
    display: flex;
    align-items: center;
    font-family: 'Arial', sans-serif;
    gap: 5px;
    font-size: 14px;
    font-weight: 500;
    color: #495057;
    
    svg {
        width: 16px;
        height: 16px;
        color: #6c757d;
    }
`;

export const FilterInput = styled.input`
    padding: 5px 6px;
    border: 1px solid #ced4da;
    border-radius: 6px;
    font-size: 14px;
    transition: all 0.2s;
    
    &:focus {
        outline: none;
        border-color: #ff0000ff;
        box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }
    
    &::placeholder {
        color: #6c757d;
    }
`;

export const FilterActions = styled.div`
    display: flex;
    gap: 12px;
    justify-content: space-around;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

export const FilterButton = styled.button`
    display: flex;
    align-items: center;
    background-color: #D9D55B;
    gap: 5px;
    padding: 10px 16px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
`;

export const ClearButton = styled.button`
    display: flex;
    align-items: center;
    background-color: #211F1F;
    color: white;
    gap: 8px;
    padding: 10px 16px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
`;

// Styled Components para a tabela
export const TableContainer = styled.div`
    margin-top: 20px;
`;

export const LoadingState = styled.div`
    text-align: center;
    padding: 20px;
    font-size: 16px;
    color: #495057;
`;

export const ErrorState = styled.div`
    text-align: center;
    padding: 20px;
    color: #e74c3c;
    font-size: 16px;
`;

export const EmptyState = styled.div`
    text-align: center;
    padding: 20px;
    font-size: 16px;
    color: #6c757d;
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
    padding: 6px 10px;
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

export const ActionButton = styled.button<{ variant?: 'edit' | 'delete' }>`
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    transition: background-color 0.2s;
    color: white;
    
    ${props => props.variant === 'delete' ? `
        background-color: #dc3545;
        
        &:hover {
            background-color: #c82333;
        }
    ` : `
        background-color: #007bff;
        
        &:hover {
            background-color: #0056b3;
        }
    `}
`;