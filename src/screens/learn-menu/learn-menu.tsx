import { Button, Flex, SegmentedControl } from '@mantine/core';
import { useNavigate } from 'react-router';
import { useCallback } from 'react';
import {
  $autoPronounce,
  $inverse,
  $learningWordIds,
  setupLearningByDays,
  setupLearningRandomOrder,
  setupLearningStarredOnly,
} from '../../storage/nanostores.ts';
import { useStore } from '@nanostores/react';
import { saveLearningProgress, saveLearningRoadmap, saveSettings } from '../../storage/storage.ts';

export function LearnMenu() {
  const navigate = useNavigate();
  const inverse = useStore($inverse);
  const pronounce = useStore($autoPronounce);
  const learningWordIds = useStore($learningWordIds);
  const hasRoadmap = learningWordIds && learningWordIds.length > 0;

  const onDataByDateClick = useCallback(() => {
    setupLearningByDays();
    saveLearningRoadmap($learningWordIds.get());
    saveLearningProgress(0, false);
    navigate('/learn');
  }, [navigate]);

  const onFullRandomClick = useCallback(() => {
    setupLearningRandomOrder();
    saveLearningRoadmap($learningWordIds.get());
    saveLearningProgress(0, false);
    navigate('/learn');
  }, [navigate]);

  const onStarredOnlyClick = useCallback(() => {
    setupLearningStarredOnly();
    saveLearningRoadmap($learningWordIds.get());
    saveLearningProgress(0, false);
    navigate('/learn');
  }, [navigate]);

  const onContinue = useCallback(() => {
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
      {hasRoadmap && (
        <Button variant="dim" size={'xl'} onClick={onContinue}>
          Continue
        </Button>
      )}
      <Button variant="dim" size={'xl'} onClick={onDataByDateClick}>
        Date by date
      </Button>
      <Button variant="dim" size={'xl'} onClick={onFullRandomClick}>
        Full random
      </Button>
      <Button variant="dim" gradient={{ from: 'cyan', to: 'yellow', deg: 90 }} size={'xl'} onClick={onStarredOnlyClick}>
        Starred only
      </Button>
    </Flex>
  );
}
