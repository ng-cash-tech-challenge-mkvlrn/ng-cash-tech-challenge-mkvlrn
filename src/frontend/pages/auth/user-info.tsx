import { Button, Divider, Text, Title } from '@mantine/core';
import { showNotification } from '@mantine/notifications';

import { useAuth } from '#/frontend/state/user.state';
import { useAxios } from '#/frontend/utils/axios.util';

export function AuthPageInfo() {
  const { axios } = useAxios();
  const { user, setUser, setCheckingAuth } = useAuth();

  return (
    <>
      <Title order={3}>username</Title>
      <Text>@{user?.username}</Text>
      <Divider mt='sm' mb='sm' />
      <Title order={3}>user id</Title>
      <Text>{user?.id}</Text>
      <Divider mt='sm' mb='sm' />
      <Title order={3}>account id</Title>
      <Text>{user?.accountId}</Text>
      <Divider mt='sm' mb='sm' />
      <Button
        color='pink'
        onClick={async () => {
          setCheckingAuth(true);
          await axios.get('/auth/logout');
          setUser(null);
          setCheckingAuth(false);
          showNotification({
            title: 'logout',
            message: 'you have been logged out',
            color: 'blue',
          });
        }}
      >
        logout
      </Button>
    </>
  );
}
