import { AppError } from '#/frontend/pages/error';
import { useAuth } from '#/frontend/state/user.state';

interface RequireAuthProps {
  children: JSX.Element;
}

export function RequireAuth({ children }: RequireAuthProps) {
  const { user } = useAuth();

  if (!user) {
    return <AppError code={401} />;
  }

  return children;
}
