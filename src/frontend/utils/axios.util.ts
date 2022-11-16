import Axios, { AxiosError } from 'axios';

import { useAuth } from '#/frontend/state/user.state';

export const useAxios = () => {
  const { setUser } = useAuth();
  const axios = Axios.create({
    baseURL: `http://localhost:${process.env.PORT}/api`,
    withCredentials: true,
  });

  axios.interceptors.response.use(
    (res) => res,
    (err) => {
      const error = err as AxiosError;
      if (error.response?.status === 401) setUser(null);
      throw err;
    },
  );

  return { axios };
};
