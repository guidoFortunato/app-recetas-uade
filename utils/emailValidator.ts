// utils/validators.ts

/**
 * Valida si un string tiene formato de correo electrónico válido.
 * @param email - El correo a validar.
 * @returns `true` si el correo es válido, de lo contrario `false`.
 */

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
