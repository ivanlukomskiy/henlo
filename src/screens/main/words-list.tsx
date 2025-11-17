import { useStore } from '@nanostores/react';
import { $translations } from '../../storage/nanostores.ts';
import { useMemo } from 'react';
import { formatDate, groupByAddedDate } from '../../storage/utils.ts';
import { Flex, Paper, Text, Title } from '@mantine/core';

export function WordsList({ search }: { search?: string }) {
  const translations = useStore($translations);

  const grouped = useMemo(() => {
    if (!translations) return {};
    if (search && search.trim().length > 0) {
      const lowerSearch = search.toLowerCase();
      const filtered = translations.filter(
        t =>
          t.original.toLowerCase().includes(lowerSearch) ||
          t.translation.toLowerCase().includes(lowerSearch)
      );
      return {'': filtered};
    }
    return groupByAddedDate(translations);
  }, [translations, search]);

  return (
    <Flex direction={'column'}>
      {Object.entries(grouped).map(([date, words]) => (
        <Flex direction={'column'} key={date}>
          {date !== '' &&
            <Title
              size={'xl'}
              c={'var(--mantine-color-gray-4)'}
              style={{
                padding: '32px 0 28px 0',
                fontStyle: 'italic',
              }}
            >
              {formatDate(date).toUpperCase()}
            </Title>
          }
          <Flex direction={'row'} wrap={'wrap'} gap={'xs'} style={{}}>
            {words.map(word => (
              <Paper
                key={word.uuid}
                shadow={'xs'}
                style={{
                  padding: '5px 5px 15px 5px',
                  maxWidth: 240,
                  flexGrow: 1,
                  backgroundColor: 'var(--mantine-color-gray-0)',
                  // background: 'linear-gradient(35deg, #eee, cyan)',
                }}
              >
                <Text size={'lg'}>{word.original}</Text>
                <Text size={'sm'} c={'var(--mantine-color-teal-7)'}>
                  {word.translation}
                </Text>
              </Paper>
            ))}
          </Flex>
        </Flex>
      ))}
    </Flex>
  );
}