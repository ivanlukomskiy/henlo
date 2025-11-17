import { ActionIcon, Button, Flex, TextInput } from '@mantine/core';
import { useNavigate } from 'react-router';
import { WordsList } from './words-list.tsx';
import { useState } from 'react';

export function Main() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  return (
    <Flex direction="column" gap={'md'}>
      <Button
        variant="gradient"
        gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
        size={'xl'}
        onClick={() => navigate('/add')}
      >
        Add words
      </Button>
      <Button
        variant="gradient"
        gradient={{ from: 'cyan', to: 'lightgreen', deg: 90 }}
        size={'xl'}
        onClick={() => navigate('/learn-menu')}
      >
        Learn
      </Button>
      <Button variant="gradient" gradient={{ from: 'cyan', to: 'yellow', deg: 90 }} size={'xl'}>
        Settings
      </Button>
      <TextInput
        size={'lg'}
        leftSectionPointerEvents="none"
        leftSection={'🔍'}
        rightSection={
          search && (
            <ActionIcon variant={'subtle'} size={'xl'} onClick={() => setSearch('')}>
              ❌
            </ActionIcon>
          )
        }
        placeholder="Search..."
        value={search}
        onChange={event => setSearch(event.currentTarget.value)}
      />
      <WordsList search={search} />
    </Flex>
  );
}
