import { ActionIcon, Button, Flex, Text, Textarea } from '@mantine/core';
import { useCallback, useEffect, useState } from 'react';
import { getWord, putWord, updateWord } from '../../storage/storage.ts';
import { useNavigate, useParams } from 'react-router';
import classes from './add.module.css'

export function Add() {
  const [original, setOriginal] = useState('');
  const [translation, setTranslation] = useState('');
  const [starred, setStarred] = useState(false);
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
        starred,
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
      starred,
      added: now,
      updated: now,
      deleted: false,
    });
    setOriginal('');
    setTranslation('');
    setStarred(false);
  }, [navigate, original, starred, translation, uuid]);

  useEffect(() => {
    if (!uuid) return;
    getWord(uuid).then(word => {
      if (word) {
        setOriginal(word.original);
        setTranslation(word.translation);
        setStarred(word.starred);
      }
    });
  }, [uuid]);

  const del = useCallback(async () => {
    if (!uuid) return;
    const word = await getWord(uuid);
    if (!word) throw new Error('updating word not found');
    await updateWord({
      uuid,
      original: word.original,
      translation: word.translation,
      starred: word.starred,
      added: word.added,
      updated: Date.now(),
      deleted: true,
    });
    navigate(-1);
  }, [navigate, uuid]);

  return (
    <Flex direction={'column'} gap={'md'}>
      <Flex
        direction={'row'}
        justify={'center'}
        style={{
          width: 50,
          height: 50,
          // border: '1px solid yellow',
          alignSelf: 'end',
          fontSize: 32,
        }}
        onClick={() => setStarred(!starred)}
      >
        {starred && <Text className={'word-star-selected'}>★</Text>}
        {!starred && <Text className={'word-star-unselected'}>☆</Text>}
      </Flex>
      <Textarea
        size={'lg'}
        value={original}
        variant={'henlo'}
        classNames={{input: classes.originalInput}}
        onChange={event => setOriginal(event.currentTarget.value)}
        placeholder={'> original'}
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
        variant={'henlo'}
        classNames={{input: classes.translationInput}}
        onChange={event => setTranslation(event.currentTarget.value)}
        placeholder={'> translation'}
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
        <Button size={'xl'} variant="dim" onClick={add} style={{ flexGrow: 1 }}>
          ok
        </Button>
        {uuid && (
          <Button size={'xl'} variant="light" onClick={del} color={'red'}>
            del
          </Button>
        )}
        {uuid && (
          <Button size={'xl'} variant="light" onClick={() => navigate(-1)} color={'gray'}>
            cancel
          </Button>
        )}
      </Flex>
    </Flex>
  );
}
