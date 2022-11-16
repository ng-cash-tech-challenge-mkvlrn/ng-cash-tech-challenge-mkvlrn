import { showNotification } from '@mantine/notifications';
import Axios, { AxiosError } from 'axios';

import { AppError } from '#/frontend/interfaces/AppError';
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
      const error = err as AxiosError<AppError>;
      if (error.response?.status === 401) setUser(null);
      showNotification({
        title: error.response?.data.statusCode,
        message: error.response?.data.message,
        color: 'red',
      });
      throw err;
    },
  );

  return { axios };
};
