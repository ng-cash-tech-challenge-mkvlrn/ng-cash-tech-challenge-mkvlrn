import {
  Anchor,
  Button,
  Group,
  Paper,
  PaperProps,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useToggle } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { AxiosError } from 'axios';

import { AppError } from '#/frontend/interfaces/AppError';
import { useAuth, UserState } from '#/frontend/state/user.state';
import { useAxios } from '#/frontend/utils/axios.util';

export function AuthPageForm(props: PaperProps) {
  const { setUser, setCheckingAuth } = useAuth();
  const { axios } = useAxios();
  const [type, toggle] = useToggle(['login', 'register']);
  const form = useForm({
    initialValues: {
      username: '',
      password: '',
    },
  });

  return (
    <Paper radius='md' p='xl' withBorder {...props} m='auto'>
      <form
        onSubmit={form.onSubmit(async () => {
          const { username, password } = form.values;
          try {
            setCheckingAuth(true);
            const response = await axios.post(`/auth/${type}`, {
              username,
              password,
            });
            if (response.status === 200 || response.status === 201) {
              const userResponse = await axios.get<UserState>('/auth/whoami');
              setUser(userResponse.data);
            }
          } catch (err) {
            const error = err as AxiosError<AppError>;

            if (error.response?.data.details) {
              error.response?.data.details.forEach((m) => {
                if (m.includes('username')) form.setFieldError('username', m);
                if (m.includes('password')) form.setFieldError('password', m);
              });
            }
            showNotification({
              title: error.response?.data.statusCode,
              message: error.response?.data.message,
              color: 'red',
            });
          } finally {
            setCheckingAuth(false);
          }
        })}
      >
        <Stack>
          <Title>
            {type === 'login' ? 'user ' : ''}
            {type}
            {type === 'register' ? ' account' : ''}
          </Title>
          <TextInput
            required
            label='username'
            placeholder='your username'
            value={form.values.username}
            onChange={(event) =>
              form.setFieldValue('username', event.currentTarget.value)
            }
            error={form.errors.username}
          />

          <PasswordInput
            required
            label='password'
            placeholder='your password'
            value={form.values.password}
            onChange={(event) =>
              form.setFieldValue('password', event.currentTarget.value)
            }
            error={form.errors.password}
          />
        </Stack>

        <Group position='apart' mt='xl'>
          <Anchor
            component='button'
            type='button'
            color='dimmed'
            onClick={() => toggle()}
            size='xs'
          >
            {type === 'register'
              ? 'already have an account? login'
              : "don't have an account? register"}
          </Anchor>
          <Button type='submit'>{type}</Button>
        </Group>
      </form>
    </Paper>
  );
}
