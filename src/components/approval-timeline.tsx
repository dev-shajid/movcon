import { Check, X, Clock } from 'lucide-react';
import { ApprovalRecord, ROLE_LABELS, UserRole } from '@/types';
import { cn, formatDate } from '@/lib/utils';

interface ApprovalTimelineProps {
  history: ApprovalRecord[];
  currentStatus: string;
}

const APPROVAL_ORDER: UserRole[] = ['adjutant', 'co', 'gso1', 'col_staff'];

export function ApprovalTimeline({ history, currentStatus }: ApprovalTimelineProps) {
  const getStepStatus = (role: UserRole) => {
    const record = history.find(h => h.role === role);
    if (record) {
      return record.action;
    }
    
    const currentPendingRole = currentStatus.replace('pending_', '') as UserRole;
    const currentIndex = APPROVAL_ORDER.indexOf(currentPendingRole);
    const roleIndex = APPROVAL_ORDER.indexOf(role);
    
    if (roleIndex === currentIndex) {
      return 'pending';
    }
    
    return 'waiting';
  };

  const getStepRecord = (role: UserRole) => {
    return history.find(h => h.role === role);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground">Approval Timeline</h3>
      <div className="relative">
        {APPROVAL_ORDER.map((role, index) => {
          const status = getStepStatus(role);
          const record = getStepRecord(role);
          const isLast = index === APPROVAL_ORDER.length - 1;

          return (
            <div key={role} className="flex gap-4">
              {/* Timeline line */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full border-2',
                    status === 'approved' && 'border-success bg-success/10',
                    status === 'rejected' && 'border-destructive bg-destructive/10',
                    status === 'pending' && 'border-warning bg-warning/10 animate-pulse',
                    status === 'waiting' && 'border-muted bg-muted'
                  )}
                >
                  {status === 'approved' && <Check className="h-4 w-4 text-success" />}
                  {status === 'rejected' && <X className="h-4 w-4 text-destructive" />}
                  {status === 'pending' && <Clock className="h-4 w-4 text-warning" />}
                  {status === 'waiting' && <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />}
                </div>
                {!isLast && (
                  <div
                    className={cn(
                      'w-0.5 flex-1 min-h-[40px]',
                      status === 'approved' ? 'bg-success' : 'bg-border'
                    )}
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-6">
                <div className="flex items-center justify-between">
                  <p className={cn(
                    'font-medium',
                    status === 'waiting' && 'text-muted-foreground'
                  )}>
                    {ROLE_LABELS[role]}
                  </p>
                  {record && (
                    <span className="text-xs text-muted-foreground">
                      {formatDate(new Date(record.timestamp))}
                    </span>
                  )}
                </div>
                {record && (
                  <div className="mt-1">
                    <p className="text-sm text-muted-foreground">
                      {record.action === 'approved' ? 'Approved by' : 'Rejected by'} {record.userName}
                    </p>
                    {record.remarks && (
                      <p className="mt-1 text-sm italic text-muted-foreground">
                        "{record.remarks}"
                      </p>
                    )}
                  </div>
                )}
                {status === 'pending' && (
                  <p className="mt-1 text-sm text-warning">Awaiting approval...</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
