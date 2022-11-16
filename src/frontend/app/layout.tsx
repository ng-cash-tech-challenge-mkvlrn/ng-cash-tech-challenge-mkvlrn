import {
  AppShell,
  Burger,
  Container,
  Footer,
  Header,
  Image,
  MediaQuery,
  Navbar,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

import logo from '#/frontend/assets/logo.png';
import { NavButtons } from '#/frontend/components/navbuttons';
import { UserFooter } from '#/frontend/components/user-footer';

interface LayoutProps {
  children: JSX.Element | JSX.Element[];
}

export function Layout({ children }: LayoutProps) {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const location = useLocation();

  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint='sm'
      asideOffsetBreakpoint='sm'
      navbar={
        <Navbar
          p='md'
          hiddenBreakpoint='sm'
          hidden={!opened}
          width={{ sm: 200, lg: 300 }}
        >
          <NavButtons />
        </Navbar>
      }
      footer={
        <Footer height={60} p='md'>
          <UserFooter />
        </Footer>
      }
      header={
        <Header height={{ base: 50, md: 70 }} p='md'>
          <div
            style={{ display: 'flex', alignItems: 'center', height: '100%' }}
          >
            <MediaQuery largerThan='sm' styles={{ display: 'none' }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size='sm'
                color={theme.colors.gray[6]}
                mr='xl'
              />
            </MediaQuery>

            <Image src={logo} width={40} mr='sm' />
            <Text weight='bolder' size='lg'>
              ng.cash tech challenge - mkvlrn@gmail.com
            </Text>
          </div>
        </Header>
      }
    >
      <Title mb='md'>{location.pathname}</Title>
      <Container>{children}</Container>
    </AppShell>
  );
}
