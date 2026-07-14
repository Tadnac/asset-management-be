import { throwError } from './responseHelper';

export interface Context {
  user?: { id: number; role: string } | null;
}

export const requireAuth = (context:Context) => {
  if (!context.user) {
    throwError('Authentication required', 'UNAUTHENTICATED');
  }
  return context.user!;
};


