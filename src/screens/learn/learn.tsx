import { ActionIcon, Text } from '@mantine/core';
import { useStore } from '@nanostores/react';
import { $autoPronounce, $inverse, $learningWordIds, $learningWordIdx, $revealed } from '../../storage/nanostores.ts';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getWord, saveLearningProgress, saveLearningRoadmap, updateWord } from '../../storage/storage.ts';
import type { Translation } from '../../storage/models.ts';
import { formatDate } from '../../storage/utils.ts';
import { useNavigate } from 'react-router';
import { Word } from '../../components/word/Word.tsx';
import { RiCloseLargeLine, RiVolumeUpLine } from '@remixicon/react';

export function Learn() {
  const idx = useStore($learningWordIdx);
  const wordsOrder = useStore($learningWordIds);
  const revealed = useStore($revealed);
  const inverse = useStore($inverse);
  const pronounce = useStore($autoPronounce);
  const [word, setWord] = useState<Translation | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!wordsOrder) return;
    getWord(wordsOrder[idx]).then(word => setWord(word));
  }, [idx, wordsOrder]);

  const playText = useCallback((text: string) => {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  }, []);

  const progress = useCallback(() => {
    if (idx + 1 >= (wordsOrder?.length || 0)) {
      $learningWordIds.set(null);
      saveLearningRoadmap(null)
      navigate('/learn-menu');
      // finished
      return;
    }
    if (!revealed) {
      $revealed.set(true);
      if (pronounce && word) {
        playText(word.original);
      }
      saveLearningProgress(idx, true);
      return;
    }
    $learningWordIdx.set(idx + 1);
    $revealed.set(false);
    saveLearningProgress(idx, false);
  }, [idx, navigate, playText, pronounce, revealed, word, wordsOrder?.length]);

  const starred = useMemo(() => {
    return word?.starred;
  }, [word?.starred]);

  const toggleStarred = useCallback(() => {
    if (!word) return;
    updateWord({ ...word, starred: !word.starred }).then(() => {
      console.log('updated');
      setWord({ ...word, starred: !word.starred });
    });
  }, [word]);

  const buttons = useMemo(() => {
    return [
      <ActionIcon
        size={'xl'}
        variant={'transparent'}
        onClick={e => {
          if (word) {
            e.stopPropagation();
            playText(word.original);
          }
        }}
        c={'var(--henlo-color-dim)'}
      >
        <RiVolumeUpLine />
      </ActionIcon>,
      <ActionIcon
        size={'xl'}
        variant={'transparent'}
        onClick={(e) => {
          e.stopPropagation();
          navigate('/')
        }}
        c={'var(--henlo-color-dim)'}
      >
        <RiCloseLargeLine/>
      </ActionIcon>,
    ];
  }, [navigate, playText, word]);

  const info = useMemo(() => {
    return (
      <>
        <Text>
          {idx + 1}/{wordsOrder?.length}
        </Text>
        {word && <Text>{formatDate(new Date(word.added).toISOString().slice(0, 10))}</Text>}
      </>
    );
  }, [idx, word, wordsOrder?.length]);

  return (
    <Word
      primary={inverse ? word?.translation || '' : word?.original || ''}
      secondary={inverse ? word?.original || '' : word?.translation || ''}
      starred={starred ?? false}
      edit={false}
      onStarredToggled={toggleStarred}
      info={info}
      onClick={progress}
      revealed={revealed}
      buttons={buttons}
    />
  );
}
