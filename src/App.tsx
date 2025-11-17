import { useEffect } from 'react';
import './App.css';
import { useDisclosure } from '@mantine/hooks';
import { AppShell, Burger, Flex, Title } from '@mantine/core';
import { Main } from './screens/main/main.tsx';
import { Add } from './screens/add/add.tsx';
import { Link, Route, Routes } from 'react-router';
import { Import } from './screens/import/import.tsx';

function App() {
  const [opened, { toggle }] = useDisclosure();

  useEffect(() => {
    const version = import.meta.env.VITE_APP_VERSION ?? 'dev';
    console.log('App version: ', version);
  }, []);

  return (
    <AppShell
      padding="md"
      header={{ height: 60 }}
      navbar={{
        width: 200,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
    >
      <AppShell.Header>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />

        <Title style={{color: '#5c5c5c'}}>Henlo!</Title>
      </AppShell.Header>

      <AppShell.Navbar>
        <Flex direction={'column'}>
          <Link to="/" style={{ padding: 16 }} onClick={toggle}>
            main
          </Link>
          <Link to="/add" style={{ padding: 16 }} onClick={toggle}>
            add
          </Link>
          <Link to="/import" style={{ padding: 16 }} onClick={toggle}>
            import
          </Link>
        </Flex>
      </AppShell.Navbar>

      <AppShell.Main>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/add" element={<Add />} />
          <Route path="/import" element={<Import />} />
        </Routes>
      </AppShell.Main>
      <AppShell.Footer>hehe</AppShell.Footer>
    </AppShell>
  );
}

export default App;
