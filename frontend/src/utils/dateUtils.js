import { format, parseISO } from 'date-fns';

export const formatDate = (date, formatString = 'dd/MM/yyyy') => {
  if (!date) return '';
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatString);
  } catch (error) {
    return '';
  }
};

export const formatDateTime = (date) => {
  return formatDate(date, 'dd/MM/yyyy, hh:mm a');
};

export const formatTime = (date) => {
  return formatDate(date, 'hh:mm a');
};

export const getISODateString = (date) => {
  if (!date) return '';
  return date.toISOString();
};
