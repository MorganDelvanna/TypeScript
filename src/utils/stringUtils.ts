export const formatDateISO = (dateInput: Date | string | number): string => {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return ''; // Handles invalid dates gracefully
  return date.toISOString().split('T')[0];
};