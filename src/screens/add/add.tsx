import { Button, Flex, Textarea } from '@mantine/core';
import { useCallback, useState } from 'react';
import { putWord } from '../../storage/storage.ts';

/*
export interface Translation {
  uuid: string
  original: string
  translation: string
  starred: boolean
  added: number
  updated: number
  deleted: boolean
}
 */
export function Add() {
  const [original, setOriginal] = useState('');
  const [translation, setTranslation] = useState('');
  const [saving, setSaving] = useState(false);

  const add = useCallback(async () => {
    if (!original || !translation) return;
    const uuid = crypto.randomUUID();
    const now = Date.now();

    setSaving(true);
    await putWord({
      uuid,
      original,
      translation,
      starred: false,
      added: now,
      updated: now,
      deleted: false
    });
    setSaving(false);
    setOriginal('');
    setTranslation('');
  }, [original, translation])

  return (
    <Flex direction={'column'} gap={'md'}>
      <Textarea value={original} onChange={(event) => setOriginal(event.currentTarget.value)} placeholder={'original'} autosize />
      <Textarea value={translation} onChange={(event) => setTranslation(event.currentTarget.value)} placeholder={'translation'} autosize/>
      <Button onClick={add} loading={saving}>Add</Button>
    </Flex>
  )
}
