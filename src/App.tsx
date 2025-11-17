import { useEffect } from 'react';
import './App.css';
import { useDisclosure } from '@mantine/hooks';
import { AppShell, Burger, Flex, Space, Title } from '@mantine/core';
import { Main } from './screens/main/main.tsx';
import { Add } from './screens/add/add.tsx';
import { Link, Route, Routes } from 'react-router';
import { Import } from './screens/import/import.tsx';
import { listWords } from './storage/storage.ts';
import { $translations } from './storage/nanostores.ts';

function App() {
  const [opened, { toggle }] = useDisclosure();

  useEffect(() => {
    const version = import.meta.env.VITE_APP_VERSION ?? 'dev';
    console.log('App version: ', version);
  }, []);

  useEffect(() => {
    listWords().then((words) => {
      $translations.set(words);
    })
  }, [])

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
        <Flex direction={'row'} style={{width:'100%'}} justify={'space-between'} align={'center'}>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" style={{flexGrow: 0, width: '24px', padding: 25}} />
        <Title style={{color: 'var(--mantine-color-gray-6)', flexGrow: 1, textAlign: 'center'}}>henlo!</Title>
          <Space hiddenFrom="sm" style={{flexGrow: 0, width: '24px', padding: 25}}></Space>
        </Flex>

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
