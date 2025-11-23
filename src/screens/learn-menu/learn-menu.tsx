import { Button, Flex, SegmentedControl } from '@mantine/core';
import { useNavigate } from 'react-router';
import { useCallback } from 'react';
import {
  $autoPronounce,
  $inverse,
  setupLearningByDays,
  setupLearningRandomOrder,
  setupLearningStarredOnly,
} from '../../storage/nanostores.ts';
import { useStore } from '@nanostores/react';
import { saveSettings } from '../../storage/storage.ts';

export function LearnMenu() {
  const navigate = useNavigate();
  const inverse = useStore($inverse);
  const pronounce = useStore($autoPronounce);

  const onDataByDateClick = useCallback(() => {
    setupLearningByDays();
    navigate('/learn');
  }, [navigate]);

  const onFullRandomClick = useCallback(() => {
    setupLearningRandomOrder();
    navigate('/learn');
  }, [navigate]);

  const onStarredOnlyClick = useCallback(() => {
    setupLearningStarredOnly();
    navigate('/learn');
  }, [navigate]);

  return (
    <Flex direction="column" gap={'md'}>
      <SegmentedControl
        size={'lg'}
        value={inverse ? 'inverse' : 'normal'}
        onChange={value => {
          $inverse.set(value === 'inverse');
          saveSettings();
        }}
        data={[
          { label: 'Normal', value: 'normal' },
          { label: 'Inverse', value: 'inverse' },
        ]}
      />
      <SegmentedControl
        size={'lg'}
        value={pronounce ? 'autoPronounce' : 'silent'}
        onChange={value => {
          $autoPronounce.set(value === 'autoPronounce');
          saveSettings();
        }}
        data={[
          { label: 'Voice', value: 'autoPronounce' },
          { label: 'Silent', value: 'silent' },
        ]}
      />
      <Button
        variant="gradient"
        gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
        size={'xl'}
        onClick={onDataByDateClick}
      >
        Date by date
      </Button>
      <Button
        variant="gradient"
        gradient={{ from: 'cyan', to: 'lightgreen', deg: 90 }}
        size={'xl'}
        onClick={onFullRandomClick}
      >
        Full random
      </Button>
      <Button
        variant="gradient"
        gradient={{ from: 'cyan', to: 'yellow', deg: 90 }}
        size={'xl'}
        onClick={onStarredOnlyClick}
      >
        Starred only
      </Button>
    </Flex>
  );
}
