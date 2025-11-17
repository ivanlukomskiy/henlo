import { Button, Flex } from '@mantine/core';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import { listWords } from '../../storage/storage.ts';

export function Main() {
  const navigate = useNavigate();

  useEffect(() => {
    listWords().then((words) => {
      console.log('Words in storage: ', words);
    })
  }, [])

  return (
    <Flex direction="column" gap={'md'}>
      <Button variant="gradient" gradient={{ from: 'blue', to: 'cyan', deg: 90 }} size={'xl'}
              onClick={() => navigate('/add')}>
        Add words
      </Button>
      <Button variant="gradient" gradient={{ from: 'cyan', to: 'lightgreen', deg: 90 }} size={'xl'}>
        Learn
      </Button>
      <Button variant="gradient" gradient={{ from: 'cyan', to: 'yellow', deg: 90 }} size={'xl'}>
        Settings
      </Button>
    </Flex>
  );
}
