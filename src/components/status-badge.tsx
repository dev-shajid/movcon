import { Badge } from '@/components/ui/badge';
import { RequestStatus, STATUS_LABELS } from '@/types';

interface StatusBadgeProps {
  status: RequestStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getVariant = () => {
    if (status === 'approved') return 'approved';
    if (status === 'rejected') return 'rejected';
    return 'pending';
  };

  return (
    <Badge variant={getVariant()}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}
