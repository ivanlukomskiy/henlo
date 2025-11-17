import { Button, Flex, Textarea } from '@mantine/core';
import { useCallback, useState } from 'react';
import type { Translation } from '../../storage/models.ts';
import { putWord } from '../../storage/storage.ts';

export function Import() {
  const [json, setJson] = useState('');
  const importJson = useCallback(async () => {
    try {
      const data = JSON.parse(json) as Translation[];
      data.forEach((item) => {
        putWord(item)
      })
    } catch (error) {
      console.error('Invalid JSON: ', error);
      return
    }

  }, [json])
  return (
    <Flex direction="column" gap={'md'}>
      <Textarea value={json} onChange={(event) => setJson(event.currentTarget.value)} placeholder={'json'} autosize />
      <Button onClick={importJson}>Import</Button>
    </Flex>
  );
}
