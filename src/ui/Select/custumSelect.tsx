// CustomSelect/CustomSelect.tsx
import React from 'react';
import { SelectWrapper, StyledSelect, SelectIcon } from './style';
import { FiChevronDown } from 'react-icons/fi';

interface Option {
  value: string | number;
  label: string;
}

interface CustomSelectProps {
  value: string | number;
  onChange: (value: string | number) => void;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  fullWidth?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Selecione...',
  disabled = false,
  error = false,
  fullWidth = true
}) => {
  return (
    <SelectWrapper fullWidth={fullWidth}>
      <StyledSelect
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        error={error}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </StyledSelect>
      <SelectIcon>
        <FiChevronDown />
      </SelectIcon>
    </SelectWrapper>
  );
};

export default CustomSelect;