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
    padding: 0.5rem 2.5rem 0.5rem 1rem;
    border: 1px solid #ced4da;
    border-radius: 6px;
    font-size: 14px;
    transition: all 0.2s;
    
    &:focus {
    outline: none;
    border-color: #ff0000ff;
  }
  
  &.error {
    border-color: #dc3545;
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

export const Form = styled.form`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
  font-family: arial;
`;

export const FormGroup = styled.div`
  margin-bottom: 20px;
`;

export const FormRow = styled.div`
  display: flex;
  gap: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0;
  }
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  color: #333;
  font-weight: 600;
`;

export const Input = styled.input`
  width: 20rem;
  padding: 12px;
  margin: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #ff0000ff;
  }
  
  &.error {
    border-color: #dc3545;
  }
`;

export const Select = styled.select`
  width: 15rem;
  margin: 1rem;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
  
  &.error {
    border-color: #dc3545;
  }
`;

export const Button = styled.button`
  background-color: #007bff;
  color: white;
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin-right: 10px;
  display: flex;
  align-items: center;
  margin: 1rem 1rem;

  &:hover {
    background-color: #0056b3;
  }
  
  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
`;

export const BackButton = styled.button`
  background-color: #211F1F;
  color: white;
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin-right: 10px;
  display: flex;
  align-items: center;
  margin: 1rem 1rem;

  &:hover {
    background-color: #494444ff;
  }
`;

export const CancelButton = styled(Button)`
  background-color: #6c757d;
  
  &:hover {
    background-color: #545b62;
  }
`;

export const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 14px;
  margin-top: 5px;
`;

export const SuccessMessage = styled.div`
  color: #28a745;
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 20px;
`;

export const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 10px;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const Message = styled.p<{ success?: boolean }>`
  margin-top: 15px;
  font-weight: bold;
  color: ${({ success }) => (success ? "green" : "red")};
`;

export const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const InfoModal = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  font-family: Arial, sans-serif;
`;