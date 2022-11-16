import { ActionIcon, Divider, Group, Text } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconLogout } from '@tabler/icons';

import { useAuth } from '#/frontend/state/user.state';
import { useAxios } from '#/frontend/utils/axios.util';

export function UserFooter() {
  const { axios } = useAxios();
  const { user, setUser, setCheckingAuth } = useAuth();

  return (
    <>
      {!user && <Text>not logged in</Text>}
      {user && (
        <Group>
          <Text>
            logged in as{' '}
            <Text span italic weight='bold'>
              @{user.username}
            </Text>
          </Text>
          <Divider orientation='vertical' />
          <ActionIcon
            title='logout'
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
            <IconLogout size={24} />
          </ActionIcon>
        </Group>
      )}
    </>
  );
}
