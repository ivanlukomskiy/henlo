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
import { Learn } from './screens/learn/learn.tsx';
import { LearnMenu } from './screens/learn-menu/learn-menu.tsx';

function App() {
  const [opened, { toggle }] = useDisclosure();

  useEffect(() => {
    const version = import.meta.env.VITE_APP_VERSION ?? 'dev';
    console.log('App version: ', version);
  }, []);

  useEffect(() => {
    listWords().then(words => {
      $translations.set(words);
    });
  }, []);

  return (
    <AppShell
      padding="0"
      // header={{ height: 60 }}
      // navbar={{
      //   width: 200,
      //   breakpoint: 'sm',
      //   collapsed: { mobile: !opened },
      // }}
    >
      {/*<AppShell.Header>*/}
      {/*  <Flex direction={'row'} style={{ width: '100%', height: 60 }} justify={'space-between'} align={'center'}>*/}
      {/*    <Burger*/}
      {/*      opened={opened}*/}
      {/*      onClick={toggle}*/}
      {/*      hiddenFrom="sm"*/}
      {/*      size="sm"*/}
      {/*      style={{ flexGrow: 0, width: '24px', padding: 25 }}*/}
      {/*    />*/}
      {/*    <Title style={{ color: 'var(--mantine-color-gray-6)', flexGrow: 1, textAlign: 'center' }}>henlo!</Title>*/}
      {/*    <Space hiddenFrom="sm" style={{ flexGrow: 0, width: '24px', padding: 25 }}></Space>*/}
      {/*  </Flex>*/}
      {/*</AppShell.Header>*/}

      {/*<AppShell.Navbar>*/}
      {/*  <Flex direction={'column'}>*/}
      {/*    <Link to="/" style={{ padding: 16 }} onClick={toggle}>*/}
      {/*      main*/}
      {/*    </Link>*/}
      {/*    <Link to="/add" style={{ padding: 16 }} onClick={toggle}>*/}
      {/*      add*/}
      {/*    </Link>*/}
      {/*    <Link to="/learn-menu" style={{ padding: 16 }} onClick={toggle}>*/}
      {/*      learn*/}
      {/*    </Link>*/}
      {/*    <Link to="/import" style={{ padding: 16 }} onClick={toggle}>*/}
      {/*      import*/}
      {/*    </Link>*/}
      {/*  </Flex>*/}
      {/*</AppShell.Navbar>*/}

      <AppShell.Main
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyItems: 'stretch',
          justifyContent: 'stretch',
          flexGrow: 1,
        }}
      >
        <Flex direction={'column'} style={{
          width:'100%',
          // backgroundColor: 'magenta',
          padding: 20,
          maxWidth: 500,
          // flex: 1,             // Fill the space
          // overflowY: 'auto',   // Enable vertical scrolling
          // minHeight: 0
        }}>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/add" element={<Add />} />
            <Route path="/import" element={<Import />} />
            <Route path="/learn-menu" element={<LearnMenu />} />
            <Route path="/learn" element={<Learn />} />
          </Routes>
        </Flex>
      </AppShell.Main>
      {/*<AppShell.Footer>hehe</AppShell.Footer>*/}
    </AppShell>
  );
}

export default App;
