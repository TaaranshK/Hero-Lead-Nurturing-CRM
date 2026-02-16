export const getStatusColor = (status) => {
  const statusColors = {
    NEW: 'bg-blue-100 text-blue-800',
    QUALIFIED: 'bg-green-100 text-green-800',
    UNQUALIFIED: 'bg-orange-100 text-orange-800',
    LOST: 'bg-red-100 text-red-800',
  };
  return statusColors[status] || 'bg-gray-100 text-gray-800';
};

export const getStatusBadgeColor = (status) => {
  const statusColors = {
    NEW: 'bg-blue-500',
    QUALIFIED: 'bg-green-500',
    UNQUALIFIED: 'bg-orange-500',
    LOST: 'bg-red-500',
  };
  return statusColors[status] || 'bg-gray-500';
};
