import { TUserRole } from '@/types';
import { getRequestedMovementsForRole } from '@/services/request.service';

// This is now async and uses the real service
export async function getPendingCountForRole(role: TUserRole): Promise<number> {
  const pending = await getRequestedMovementsForRole(role);
  return pending.length;
}
