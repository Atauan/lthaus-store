
export const getDateRangeFilter = (dateRange: string) => {
  const now = new Date();
  const pastDate = new Date();
  
  switch (dateRange) {
    case 'hoje':
      pastDate.setHours(0, 0, 0, 0);
      break;
    case '7dias':
      pastDate.setDate(now.getDate() - 7);
      break;
    case '30dias':
      pastDate.setDate(now.getDate() - 30);
      break;
    default:
      pastDate.setFullYear(2000); // Essentially all dates
  }
  
  return pastDate;
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};
