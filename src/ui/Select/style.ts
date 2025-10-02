// CustomSelect/style.ts
import styled from 'styled-components';

interface SelectWrapperProps {
  fullWidth?: boolean;
}

interface StyledSelectProps {
  error?: boolean;
}

export const SelectWrapper = styled.div<SelectWrapperProps>`
  position: relative;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  display: inline-block;
`;

export const StyledSelect = styled.select<StyledSelectProps>`
  width: 100%;
  padding: 0.5rem 2.5rem 0.5rem 1rem;
  font-size: 0.95rem;
  font-weight: 400;
  color: #6b6b6bff;
  background-color: #ffffffff;
  border: 2px solid ${props => props.error ? '#e74c3c' : '#e0e0e0'};
  border-radius: 8px;
  outline: none;
  cursor: pointer;
  transition: all 0.3s ease;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  
  /* Remove a seta padrão do IE */
  &::-ms-expand {
    display: none;
  }

  &:hover {
    border-color: ${props => props.error ? '#ff0000ff' : '#ff0000ff'};
    background-color: #f8f9fa;
  }

  &:focus {
    border-color: ${props => props.error ? '#ff0000ff' : '#ff0000ff'};
    background-color: #ffffff;
    box-shadow: 0 0 0 3px ${props => props.error ? 'rgba(231, 76, 60, 0.1)' : 'rgba(124, 58, 237, 0.1)'};
  }

  &:disabled {
    background-color: #f5f5f5;
    color: #999;
    cursor: not-allowed;
    border-color: #e0e0e0;
  }

  /* Estilização das options */
  option {
    padding: 0.5rem;
    color: #707070ff;
    background-color: #ecececff;
    font-weight: 400;
    
    &:hover {
      background-color: #ff0000ff;
    }
    
    &:disabled {
      color: #999;
    }
  }

  /* Placeholder com cor mais clara */
  option[value=""] {
    color: #999;
  }

  option:focus {
  background-color: #ff4d4d !important;
  color: #fff !important;
}
`;

export const SelectIcon = styled.div`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #9c9c9cff;
  border-left: 2px solid #c9c9c9ff;
  padding-left: 0.5rem;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease;
`;