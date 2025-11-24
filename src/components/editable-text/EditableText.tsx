import { ActionIcon, Space, Text, Textarea } from '@mantine/core';
import { RiCloseLine } from '@remixicon/react';

interface Props {
  text: string;
  edit: boolean;
  placeholder?: string;
  onTextChanged?: (newText: string) => void;
  className?: string;
  style?: React.CSSProperties;
  inputClassName?: string;
}

export function EditableText({ text, placeholder, edit, onTextChanged, className, inputClassName, style }: Props) {
  if (!edit) {
    return (
      <Text className={className} style={style}>
        {text}
      </Text>
    );
  }
  return (
    <Textarea
      size={'lg'}
      value={text}
      variant={'henlo'}
      classNames={{ input: inputClassName }}
      onChange={event => onTextChanged?.(event.currentTarget.value)}
      placeholder={placeholder}
      autosize
      rightSection={
        text && (
          <ActionIcon variant={'subtle'} size={'xl'} onClick={() => onTextChanged?.('')} c={'var(--henlo-color-dim)'}>
            <RiCloseLine />
          </ActionIcon>
        )
      }
      leftSection={
         text && <Space w={'xl'} />
      }
    />
  );
}
