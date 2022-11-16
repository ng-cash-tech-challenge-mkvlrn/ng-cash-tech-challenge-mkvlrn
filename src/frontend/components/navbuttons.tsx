import { Group, Text, ThemeIcon, UnstyledButton } from '@mantine/core';
import {
  IconExchange,
  IconHome,
  IconLogin,
  IconMoneybag,
  IconReportAnalytics,
} from '@tabler/icons';
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

interface ButtonProps {
  to: string;
  icon: React.ReactNode;
  color: string;
  label: string;
}

function NavButton({ to, icon, color, label }: ButtonProps) {
  const location = useLocation();

  return (
    <NavLink to={to} style={{ textDecoration: 'none' }}>
      <UnstyledButton
        sx={(theme) => ({
          display: 'block',
          width: '100%',
          padding: theme.spacing.xs,
          borderRadius: theme.radius.sm,
          color:
            theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

          backgroundColor:
            theme.colorScheme === 'dark'
              ? location.pathname === to
                ? theme.colors.dark[8]
                : undefined
              : location.pathname === to
              ? theme.colors.gray[2]
              : undefined,

          '&:hover': {
            backgroundColor:
              theme.colorScheme === 'dark'
                ? theme.colors.dark[6]
                : theme.colors.gray[0],
          },
        })}
      >
        <Group>
          <ThemeIcon color={color} variant='light'>
            {icon}
          </ThemeIcon>

          <Text size='md' weight='bold'>
            {label}
          </Text>
        </Group>
      </UnstyledButton>
    </NavLink>
  );
}

const data: ButtonProps[] = [
  { to: '/', icon: <IconHome size={16} />, color: 'orange', label: 'home' },
  {
    to: '/balance',
    icon: <IconMoneybag size={16} />,
    color: 'green',
    label: 'balance',
  },
  {
    to: '/transfer',
    icon: <IconExchange size={16} />,
    color: 'yellow',
    label: 'transfer',
  },
  {
    to: '/transactions',
    icon: <IconReportAnalytics size={16} />,
    color: 'blue',
    label: 'transactions',
  },
  { to: '/auth', icon: <IconLogin size={16} />, color: 'pink', label: 'auth' },
];

export function NavButtons() {
  const links = data.map((link) => <NavButton {...link} key={link.label} />);
  return <div>{links}</div>;
}
