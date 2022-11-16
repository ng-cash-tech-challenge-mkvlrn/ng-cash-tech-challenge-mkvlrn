import { Paper, Text, Title } from '@mantine/core';
import { Link } from 'react-router-dom';

interface AppErrorProps {
  code: 401 | 404;
}

const errorMessages = {
  401: {
    heading: 'unauthorized',
    message: 'you need to be authenticated to view this page',
    icon: 'fa-solid fa-ban',
    more: (
      <>
        you can login or register <Link to='/auth'>here</Link>
      </>
    ),
  },
  404: {
    heading: 'not found',
    message: "the page you're trying to access does not exist",
    icon: 'fa-solid fa-circle-xmark',
    more: 'use the navbar to browse',
  },
};

export function AppError({ code }: AppErrorProps) {
  const error = errorMessages[code];
  return (
    <Paper shadow='xs' p='md'>
      <Title>
        <i className={error.icon} style={{ fontSize: '1.5rem' }} />{' '}
        {error.heading}
      </Title>
      <Text color='dimmed'>{error.message}</Text>
      <Text size='sm' mt='sm'>
        {error.more}
      </Text>
    </Paper>
  );
}
