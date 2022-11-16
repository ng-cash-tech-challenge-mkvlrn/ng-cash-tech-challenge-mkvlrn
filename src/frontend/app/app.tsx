import { useEffect } from 'react';

import { Layout } from '#/frontend/app/layout';
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
    <Layout>
      <div>test</div>
    </Layout>
  );
}
