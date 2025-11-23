import { Flex, Text, Title } from '@mantine/core';
import { useStore } from '@nanostores/react';
import { $autoPronounce, $inverse, $learningWordIds, $learningWordIdx, $revealed } from '../../storage/nanostores.ts';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getWord, updateWord } from '../../storage/storage.ts';
import type { Translation } from '../../storage/models.ts';
import { formatDate } from '../../storage/utils.ts';
import { useNavigate } from 'react-router';

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
      navigate('/learn-menu');
      // finished
      return;
    }
    if (!revealed) {
      $revealed.set(true);
      if (pronounce && word) {
        playText(word.original);
      }
      return;
    }
    $learningWordIdx.set(idx + 1);
    $revealed.set(false);
  }, [idx, navigate, playText, pronounce, revealed, word, wordsOrder?.length]);

  const starred = useMemo(() => {
    return word?.starred;
  }, [word?.starred]);

  const toggleStarred = useCallback(
    e => {
      console.log('toggle', word);
      e.stopPropagation();
      if (!word) return;
      updateWord({ ...word, starred: !word.starred }).then(() => {
        console.log('updated');
        setWord({ ...word, starred: !word.starred });
      });
    },
    [word],
  );

  return (
    <Flex direction="column" gap={90} style={{ width: '100%', padding: 32 }} onClick={progress}>
      <Flex
        direction={'row'}
        justify={'center'}
        style={{
          width: 50,
          height: 50,
          // border: '1px solid yellow',
          alignSelf: 'end',
        }}
        onClick={toggleStarred}
      >
        <Title c={starred ? 'var(--mantine-color-yellow-1)' : 'var(--mantine-color-gray-6)'}>
          {starred ? '★' : '☆'}
        </Title>
      </Flex>
      <Flex direction={'column'} gap={'md'}>
        <Text size={'xl'} style={{ fontSize: 28 }}>
          {inverse ? word?.translation : word?.original}
        </Text>
        <Text
          size={'lg'}
          c={'var(--mantine-color-teal-7)'}
          style={{ visibility: revealed ? undefined : 'hidden', minHeight: 52 }}
        >
          {inverse ? word?.original : word?.translation}
        </Text>
      </Flex>
      <Flex direction={'column'} c={'var(--mantine-color-gray-6)'}>
        <Text size={'sm'}>
          {idx + 1}/{wordsOrder?.length}
        </Text>
        {word && <Text size={'sm'}>{formatDate(new Date(word.added).toISOString().slice(0, 10))}</Text>}
        <Flex
          size={'lg'}
          style={{
            width: 50,
            height: 50,
            // border: '1px solid var(--mantine-color-gray-6)',
            alignSelf: 'center',
          }}
          justify={'center'}
          align={'center'}
          onClick={e => {
            if (word) {
              e.stopPropagation();
              playText(word.original);
            }
          }}
        >
          <Text>🔊</Text>
        </Flex>
      </Flex>
    </Flex>
  );
}
