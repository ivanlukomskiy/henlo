import { useStore } from '@nanostores/react';
import { $translations } from '../../storage/nanostores.ts';
import { useCallback, useMemo } from 'react';
import { formatDate, groupByAddedDate } from '../../storage/utils.ts';
import { Flex, Paper, Text, Title } from '@mantine/core';
import { useNavigate } from 'react-router';

export function WordsList({ search }: { search?: string }) {
  const translations = useStore($translations);
  const navigate = useNavigate()

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

  const wordClicked = useCallback((uuid: string) => {
    navigate(`/words/${uuid}/edit`);
  } , [navigate])

  return (
    <Flex direction={'column'}>
      {Object.entries(grouped).map(([date, words]) => (
        <Flex direction={'column'} key={date}>
          {date !== '' &&
            <Title
              size={'xl'}
              c={'var(--mantine-color-cyan-5)'}
              style={{
                padding: '32px 0 28px 0',
                // fontStyle: 'italic',
              }}
            >
              {formatDate(date).toUpperCase()}
            </Title>
          }
          <Flex direction={'row'} wrap={'wrap'} gap={'xs'} style={{}}>
            {words.map(word => (
              <Paper
                key={word.uuid}
                shadow={'lg'}
                onClick={() => wordClicked(word.uuid)}
                style={{
                  flex: `${word.original.length + word.translation.length * 0.8 + 1} 0 120px`,
                  padding: '5px 5px 15px 5px',
                  // maxWidth: 240,
                  // flexGrow: 1,
                  cursor: 'pointer',
                  border: '1px solid var(--mantine-color-gray-6)',
                  borderRadius: 5,
                  // backgroundColor: 'var(--mantine-color-gray-0)',
                  // background: 'linear-gradient(35deg, #eee, cyan)',
                }}
              >
                <Flex direction={'row'} justify={'space-around'}>
                  <Text size={'lg'} c={'var(--mantine-color-yellow-7)'}>
                    {word.original}
                  </Text>
                  {word.starred && <Text style={{color: 'var(--mantine-color-yellow-1)'}}>★</Text>}
                </Flex>
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