import { useEffect } from 'react';
import './App.css';
import { useDisclosure } from '@mantine/hooks';
import { AppShell, Burger, createTheme, Flex, MantineProvider, Space, Title, Button } from '@mantine/core';
import { Main } from './screens/main/main.tsx';
import { Add } from './screens/add/add.tsx';
import { Link, Route, Routes } from 'react-router';
import { Import } from './screens/import/import.tsx';
import { listWords, loadSettings } from './storage/storage.ts';
import { $autoPronounce, $colorScheme, $inverse, $translations } from './storage/nanostores.ts';
import { Learn } from './screens/learn/learn.tsx';
import { LearnMenu } from './screens/learn-menu/learn-menu.tsx';
import { useFirebaseAuth } from './hooks/use-firebase-app.ts';
import { Auth } from './components/auth/Auth.tsx';
import { useStore } from '@nanostores/react';
import classes from './styles_ext.module.css';
import { Stats } from './screens/stats/stats.tsx';

const theme = createTheme({
  fontFamily:
    'Fira Code, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  components: {
    Button: Button.extend({
      classNames: classes,
    }),
  },
});

function App() {
  const [opened, { toggle }] = useDisclosure();
  const colorScheme = useStore($colorScheme);
  useFirebaseAuth();

  useEffect(() => {
    const version = import.meta.env.VITE_APP_VERSION ?? 'dev';
    console.log('App version: ', version);
  }, []);

  useEffect(() => {
    listWords().then(words => {
      $translations.set(words);
    });
  }, []);

  useEffect(() => {
    const settings = loadSettings();
    if (settings != null) {
      $autoPronounce.set(settings.autoPronounce);
      $inverse.set(settings.learnInverse);
    }
  }, [])

  return (
    <MantineProvider theme={theme} forceColorScheme={colorScheme}>
      <AppShell
        padding="0"
        header={{ height: 60 }}
        navbar={{
          width: 200,
          breakpoint: 'sm',
          collapsed: { mobile: !opened },
        }}
      >
        <AppShell.Header>
          <Flex direction={'row'} style={{ width: '100%', height: 60 }} justify={'space-between'} align={'center'}>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
              style={{ flexGrow: 0, width: '24px', padding: 25 }}
            />
            <Title style={{
              color: 'var(--mantine-color-gray-6)',
              flexGrow: 1,
              textAlign: 'center',
              textShadow: '0px 0px 50px lightblue',
            }}>henlo!</Title>
            <Space hiddenFrom="sm" style={{ flexGrow: 0, width: '24px', padding: 25 }}></Space>
          </Flex>
        </AppShell.Header>

        <AppShell.Navbar>
          <Flex direction={'column'} style={{ padding: 12 }}>
            <Link to="/" style={{ padding: 16 }} onClick={toggle}>
              main
            </Link>
            <Link to="/add" style={{ padding: 16 }} onClick={toggle}>
              add
            </Link>
            <Link to="/learn-menu" style={{ padding: 16 }} onClick={toggle}>
              learn
            </Link>
            <Link to="/import" style={{ padding: 16 }} onClick={toggle}>
              import
            </Link>
            <Link to="/stats" style={{ padding: 16 }} onClick={toggle}>
              stats
            </Link>
            <Auth />
          </Flex>
        </AppShell.Navbar>

        <AppShell.Main
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyItems: 'stretch',
            justifyContent: 'stretch',
            flexGrow: 1,
          }}
        >
          <Flex
            direction={'column'}
            style={{
              width: '100%',
              padding: 20,
              maxWidth: 500,
            }}
          >
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/add" element={<Add />} />
              <Route path="/words/:uuid/edit" element={<Add />} />
              <Route path="/import" element={<Import />} />
              <Route path="/learn-menu" element={<LearnMenu />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/stats" element={<Stats />} />
            </Routes>
          </Flex>
        </AppShell.Main>
        {/*<AppShell.Footer>hehe</AppShell.Footer>*/}
      </AppShell>
    </MantineProvider>
  );
}

export default App;
