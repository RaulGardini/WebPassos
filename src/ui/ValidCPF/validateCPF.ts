/**
 * Valida se o CPF é válido
 * @param cpf - CPF com ou sem formatação
 * @returns true se válido, false se inválido
 */
export const validateCPF = (cpf: string): boolean => {
  // Remove formatação
  const limpo = cpf.replace(/\D/g, '');

  // Verifica se tem 11 dígitos
  if (limpo.length !== 11) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(limpo)) return false;

  // Valida primeiro dígito
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(limpo[i]) * (10 - i);
  }
  const digito1 = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (digito1 !== parseInt(limpo[9])) return false;

  // Valida segundo dígito
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(limpo[i]) * (11 - i);
  }
  const digito2 = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (digito2 !== parseInt(limpo[10])) return false;

  return true;
};