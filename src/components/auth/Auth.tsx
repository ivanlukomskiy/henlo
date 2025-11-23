import { useEffect } from 'react';
import { syncWords } from '../../storage/sync.ts';
import { useStore } from '@nanostores/react';
import { $loading, $user } from '../../storage/nanostores.ts';
import { Button, Flex, Text } from '@mantine/core';
import { henloSignIn, henloSignOut } from '../../hooks/use-firebase-app.ts';

export function Auth() {
  const user = useStore($user);
  const loading = useStore($loading);

  useEffect(() => {
    if (!user) return;
    syncWords(user)
      .then(() => {
        console.log('sync done');
      })
      .catch(err => {
        console.error('sync error', err);
      });
  }, [user]);

  return (
    <Flex direction={'column'}>
      {user && <Text>{user.displayName}</Text>}
      {loading && <Text>Loading...</Text>}
      {!user && !loading && <Button onClick={henloSignIn}>Sign in</Button>}
      {user && !loading && <Button onClick={henloSignOut}>Sign out</Button>}
    </Flex>
  );
}
