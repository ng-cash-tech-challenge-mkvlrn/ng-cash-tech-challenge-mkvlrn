import { LoadingOverlay } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Layout } from '#/frontend/app/layout';
import { RequireAuth } from '#/frontend/components/require-auth';
import { AuthPage } from '#/frontend/pages/auth/auth';
import { BalancePage } from '#/frontend/pages/balance';
import { AppError } from '#/frontend/pages/error';
import { HomePage } from '#/frontend/pages/home';
import { TransactionsPage } from '#/frontend/pages/transactions';
import { useAuth, UserState } from '#/frontend/state/user.state';
import { useAxios } from '#/frontend/utils/axios.util';

export function App() {
  const { user, setUser, checkingAuth, setCheckingAuth } = useAuth();
  const { axios } = useAxios();

  useEffect(() => {
    const auth = async () => {
      try {
        setCheckingAuth(true);
        const response = await axios.get<UserState>('/auth/whoami');

        if (response.data) setUser(response.data);
      } catch (err) {
        //
      } finally {
        setCheckingAuth(false);
      }
    };

    auth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user)
      showNotification({
        title: 'login',
        message: 'login successful',
        color: 'blue',
      });
  }, [user]);

  return (
    <BrowserRouter>
      <div style={{ width: '100%', position: 'relative' }}>
        <LoadingOverlay visible={checkingAuth} overlayBlur={2} />
        <Layout>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route
              path='/balance'
              element={
                <RequireAuth>
                  <BalancePage />
                </RequireAuth>
              }
            />
            <Route
              path='/transfer'
              element={
                <RequireAuth>
                  <div>transfer</div>
                </RequireAuth>
              }
            />
            <Route
              path='/transactions'
              element={
                <RequireAuth>
                  <TransactionsPage />
                </RequireAuth>
              }
            />
            <Route path='/auth' element={<AuthPage />} />
            <Route path='*' element={<AppError code={404} />} />
          </Routes>
        </Layout>
      </div>
    </BrowserRouter>
  );
}
