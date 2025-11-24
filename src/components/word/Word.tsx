import { Flex, Text } from '@mantine/core';
import type { JSX } from 'react';
import { EditableText } from '../editable-text/EditableText.tsx';
import classes from './word.module.css';

interface WordProps {
  primary: string;
  secondary: string;
  starred: boolean;
  revealed?: boolean;
  edit: boolean;

  onPrimaryChanged?: (newPrimary: string) => void;
  onSecondaryChanged?: (newSecondary: string) => void;
  onStarredToggled?: () => void;
  onClick?: () => void;
  info?: JSX.Element;
  buttons?: JSX.Element[];
}

export function Word({
  primary,
  secondary,
  starred,
  onPrimaryChanged,
  onSecondaryChanged,
  onStarredToggled,
  onClick,
  edit,
  revealed = true,
  info,
  buttons,
}: WordProps) {
  const onStarredClicked = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onStarredToggled) {
      onStarredToggled();
    }
  };

  return (
    <Flex
      direction="column"
      gap={'xl'}
      style={{ width: '100%', padding: '64px 0 0px 0', fontSize: 18, userSelect: 'none' }}
      onClick={onClick}
    >
      <Flex
        direction={'row'}
        justify={'center'}
        style={{
          width: 50,
          height: 50,
          alignSelf: 'end',
          fontSize: 32,
          padding: '0 32px',
        }}
        onClick={onStarredClicked}
      >
        {starred && <Text className={'word-star-selected'}>★</Text>}
        {!starred && <Text className={'word-star-unselected'}>☆</Text>}
      </Flex>
      <Flex
        direction={'column'}
        gap={'md'}
        style={{
          minHeight: 220,
        }}
      >
        <EditableText
          text={primary}
          edit={edit}
          onTextChanged={onPrimaryChanged}
          className={'word-original'}
          placeholder={'> original'}
          inputClassName={classes.originalInput}
        />
        <EditableText
          text={secondary}
          edit={edit}
          onTextChanged={onSecondaryChanged}
          className={'word-translation'}
          style={{ visibility: revealed ? undefined : 'hidden' }}
          placeholder={'> translation'}
          inputClassName={classes.translationInput}
        />
      </Flex>
      <Flex direction={'column'} className={'text-secondary'}>
        {info}
        <Flex direction={'row'} justify={'center'} gap={'sm'}>
          {buttons}
        </Flex>
      </Flex>
    </Flex>
  );
}
