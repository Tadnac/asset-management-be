import { throwError } from './responseHelper';

export interface Context {
  user?: { id: number; role: string } | null;
}

export const requireAuth = (context: Context) => {
  if (!context.user) {
    throwError('Authentication required', 'UNAUTHENTICATED');
  }
  return context.user!;
};

export const requireRole = (context: Context, role: string) => {
  const user = requireAuth(context);
  if (user.role !== role) {
    throwError('Insufficient permissions', 'FORBIDDEN');
  }
  return user;
};


