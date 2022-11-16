import { Group, Paper, Text, Title } from '@mantine/core';
import { IconError404, IconForbid } from '@tabler/icons';
import { Link } from 'react-router-dom';

interface AppErrorProps {
  code: 401 | 404;
}

const iconSize = 36;

const errorMessages = {
  401: {
    heading: 'unauthorized',
    message: 'you need to be authenticated to view this page',
    icon: <IconForbid size={iconSize} />,
    more: (
      <>
        you can login or register <Link to='/auth'>here</Link>
      </>
    ),
  },
  404: {
    heading: 'not found',
    message: "the page you're trying to access does not exist",
    icon: <IconError404 size={iconSize} />,
    more: 'use the navbar to browse',
  },
};

export function AppError({ code }: AppErrorProps) {
  const error = errorMessages[code];
  return (
    <Paper shadow='xs' radius='md' p='xl' withBorder>
      <Group align='flex-end' spacing='sm'>
        {error.icon}
        <Title>{error.heading}</Title>
      </Group>
      <Text color='dimmed'>{error.message}</Text>
      <Text size='sm' mt='sm'>
        {error.more}
      </Text>
    </Paper>
  );
}
