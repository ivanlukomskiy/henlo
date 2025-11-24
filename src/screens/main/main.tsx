import { ActionIcon, Button, Flex, Group, TextInput } from '@mantine/core';
import { useNavigate } from 'react-router';
import { WordsList } from './words-list.tsx';
import { useState } from 'react';

export function Main() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  return (
    <Flex direction="column" gap={'md'} style={{}}>
      <Group gap={'sm'}>
      <Button
        variant="dim"
        size={'xl'}
        onClick={() => navigate('/add')}
      >
        +add
      </Button>
      <Button
        variant="dim"
        size={'xl'}
        onClick={() => navigate('/learn-menu')}
      >
        learn
      </Button>
      <Button
        variant="dim" gradient={{ from: 'cyan', to: 'yellow', deg: 90 }} size={'xl'}
        onClick={() => navigate('/stats')}>
        stats
      </Button>
      </Group>
      <TextInput
        size={'lg'}
        leftSectionPointerEvents="none"
        variant={'henlo'}
        rightSection={
          search && (
            <ActionIcon variant={'subtle'} size={'xl'} onClick={() => setSearch('')}>
              ❌
            </ActionIcon>
          )
        }
        placeholder="> search"
        value={search}
        onChange={event => setSearch(event.currentTarget.value)}
      />
      <WordsList search={search} />
      {/*<Flex justify={'center'} align={'center'} style={{position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 99, height: 40}} className={'glass'}>*/}
      {/*  ↑ UP ↑*/}
      {/*</Flex>*/}
    </Flex>
  );
}
