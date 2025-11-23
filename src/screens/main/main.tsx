import { ActionIcon, Button, Flex, Group, TextInput } from '@mantine/core';
import { useNavigate } from 'react-router';
import { WordsList } from './words-list.tsx';
import { useState } from 'react';

export function Main() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  return (
    <Flex direction="column" gap={'md'}>
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
        // leftSection={'🔍'}
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
    </Flex>
  );
}
