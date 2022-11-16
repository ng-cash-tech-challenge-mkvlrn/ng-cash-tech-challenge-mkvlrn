import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Layout } from '#/frontend/app/layout';
import { RequireAuth } from '#/frontend/components/require-auth';
import { AppError } from '#/frontend/pages/error';
import { useAuth, UserState } from '#/frontend/state/user.state';
import { useAxios } from '#/frontend/utils/axios.util';

export function App() {
  const { setUser } = useAuth();
  const { axios } = useAxios();

  useEffect(() => {
    const auth = async () => {
      try {
        const response = await axios.get<UserState>('/auth/whoami');

        if (response.data) setUser(response.data);
      } catch (err) {
        //
      }
    };

    auth();
  }, [axios, setUser]);

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path='/' element={<div>home</div>} />
          <Route
            path='/balance'
            element={
              <RequireAuth>
                <div>balance</div>
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
                <div>transactions</div>
              </RequireAuth>
            }
          />
          <Route path='/auth' element={<div>auth</div>} />
          <Route path='*' element={<AppError code={404} />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
