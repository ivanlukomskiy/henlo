import { ActionIcon, Button, Flex, Textarea } from '@mantine/core';
import { useCallback, useEffect, useState } from 'react';
import { deleteWord, getWord, putWord, updateWord } from '../../storage/storage.ts';
import { useNavigate, useParams } from 'react-router';

export function Add() {
  const [original, setOriginal] = useState('');
  const [translation, setTranslation] = useState('');
  const navigate = useNavigate();

  const { uuid } = useParams<{ uuid?: string }>();

  const add = useCallback(async () => {
    if (!original || !translation) return;
    if (uuid) {
      const word = await getWord(uuid);
      if (!word) throw new Error('updating word not found');
      await updateWord({
        uuid,
        original,
        translation,
        starred: word.starred,
        added: word.added,
        updated: Date.now(),
        deleted: word.deleted,
      });
      navigate(-1);
      return;
    }
    const newUuid = crypto.randomUUID();
    const now = Date.now();

    await putWord({
      uuid: newUuid,
      original,
      translation,
      starred: false,
      added: now,
      updated: now,
      deleted: false,
    });
    setOriginal('');
    setTranslation('');
  }, [navigate, original, translation, uuid]);

  useEffect(() => {
    if (!uuid) return;
    getWord(uuid).then(word => {
      if (word) {
        setOriginal(word.original);
        setTranslation(word.translation);
      }
    });
  }, [uuid]);

  const del = useCallback(async () => {
    if (!uuid) return;
    deleteWord(uuid);
    navigate(-1);
  }, [navigate, uuid]);

  return (
    <Flex direction={'column'} gap={'md'}>
      <Textarea
        size={'lg'}
        value={original}
        onChange={event => setOriginal(event.currentTarget.value)}
        placeholder={'original'}
        autosize
        rightSection={
          original && (
            <ActionIcon variant={'subtle'} size={'xl'} onClick={() => setOriginal('')}>
              ❌
            </ActionIcon>
          )
        }
      />
      <Textarea
        size={'lg'}
        value={translation}
        onChange={event => setTranslation(event.currentTarget.value)}
        placeholder={'translation'}
        autosize
        rightSection={
          translation && (
            <ActionIcon variant={'subtle'} size={'xl'} onClick={() => setTranslation('')}>
              ❌
            </ActionIcon>
          )
        }
      />
      <Flex direction={'row'} gap={'sm'} style={{ width: '100%' }} justify={'stretch'}>
        <Button
          size={'xl'}
          variant="gradient"
          gradient={{ from: 'cyan', to: 'yellow', deg: 90 }}
          onClick={add}
          style={{ flexGrow: 1 }}
        >
          {uuid ? 'Update' : 'Add'}
        </Button>
        {uuid && (
          <Button size={'xl'} variant="light" onClick={del} color={'red'}>
            Delete
          </Button>
        )}
        {uuid && (
          <Button
            size={'xl'}
            variant="light"
            // variant="outline"
            onClick={() => navigate(-1)}
            color={'gray'}
          >
            Cancel
          </Button>
        )}
      </Flex>
    </Flex>
  );
}
