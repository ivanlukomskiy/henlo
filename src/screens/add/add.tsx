import { ActionIcon } from '@mantine/core';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getWord, putWord, updateWord } from '../../storage/storage.ts';
import { useNavigate, useParams } from 'react-router';
import { Word } from '../../components/word/Word.tsx';
import { RiCloseLargeLine, RiDeleteBin2Line, RiSaveLine } from '@remixicon/react';

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

  const buttons = useMemo(() => {
    return [
      <ActionIcon size={'xl'} variant={'transparent'} onClick={add} c={'var(--henlo-color-dim)'}>
        <RiSaveLine className="my-icon" />
      </ActionIcon>,
      <ActionIcon size={'xl'} variant={'transparent'} onClick={del} c={'var(--henlo-color-dim)'}>
        <RiDeleteBin2Line />
      </ActionIcon>,
      <ActionIcon
        size={'xl'}
        variant={'transparent'}
        onClick={() => {
          navigate('/');
        }}
        c={'var(--henlo-color-dim)'}
      >
        <RiCloseLargeLine />
      </ActionIcon>,
    ];
  }, [add, del, navigate]);

  return (
    <Word
      primary={original}
      onPrimaryChanged={setOriginal}
      secondary={translation}
      onSecondaryChanged={setTranslation}
      starred={starred ?? false}
      edit={true}
      onStarredToggled={() => setStarred(!starred)}
      buttons={buttons}
    />
  );
}
