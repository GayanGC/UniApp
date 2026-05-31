import { ProtectedRoute } from '@/components/ProtectedRoute';
import FinanceDashboard from '@/components/FinanceDashboard';
import { UserRole } from '@/types';

export default function StudentFinanceDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
      <FinanceDashboard />
    </ProtectedRoute>
  );
}