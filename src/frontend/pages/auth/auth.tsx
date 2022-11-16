import { AuthPageForm } from '#/frontend/pages/auth/form';
import { AuthPageInfo } from '#/frontend/pages/auth/user-info';
import { useAuth } from '#/frontend/state/user.state';

export function AuthPage() {
  const { user } = useAuth();

  return (
    <>
      {user && <AuthPageInfo />}
      {!user && <AuthPageForm />}
    </>
  );
}
