import { Button, Flex } from '@mantine/core';
import { useNavigate } from 'react-router';
import { WordsList } from './words-list.tsx';

export function Main() {
  const navigate = useNavigate();

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
      <WordsList/>
    </Flex>
  );
}
