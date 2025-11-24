import { Flex, Text } from '@mantine/core';
import { useCallback, useMemo } from 'react';
import { $translations, getMonthlyStats, type MonthStats } from '../../storage/nanostores.ts';
import { useStore } from '@nanostores/react';

export function Stats() {
  // const navigate = useNavigate();
  const translations = useStore($translations);
  const stats = useMemo(() => {
    return getMonthlyStats(translations ?? []);
  }, [translations]);
  const maxWords = useMemo(() => {
    let max = 0;
    for (const item of stats) {
      if (item.words > max) {
        max = item.words;
      }
    }
    return max == 0 ? 1 : max;
  }, [stats]);

  const renderYear = useCallback((stats: MonthStats[]) => {
    // const maxWords = stats.reduce((max, item) => (item.words > max ? item.words : max), 0);
    const totalWords = stats.reduce((sum, item) => sum + item.words, 0);
    return (
      <Flex direction="column" gap={'sm'} style={{ width: '100%' }}>
        <Flex direction="row" justify={'start'} gap={'sm'}>
          <Text>{stats[0].year}:</Text>
          <Text className={'highlightSecondary'}>{totalWords}</Text>
        </Flex>
        {stats.map((item, i) => (
          <Flex
            key={i}
            direction="row"
            justify="space-between"
            align="center"
            pb="xs"
            gap={'sm'}
            style={{ marginBottom: item.month === 'Jan' ? 20 : 0 }}
          >
            <Text style={{ textTransform: 'uppercase',
              color: item.words > 0 ? 'inherit' : 'var(--mantine-color-gray-7)', }}>
              {item.month.substring(0, 3)}
            </Text>
            <div
              style={{
                backgroundColor: 'var(--mantine-color-gray-9)',
                flexGrow: 1,
                position: 'relative',
                minHeight: 25,
              }}
            >
              <div
                style={{
                  backgroundColor: 'var(--mantine-color-blue-6)',
                  width: `${(item.words * 100) / maxWords}%`,
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: 0,
                  zIndex: 1,
                  color: item.words > 0 ? 'inherit' : 'var(--mantine-color-gray-7)',
                }}
              >
                <Text style={{paddingLeft: '.2em'}}>{item.words}</Text>
              </div>
            </div>
          </Flex>
        ))}
      </Flex>
    );
  }, [maxWords]);

  const monthStatsRendered = useMemo(() => {
    const years: Record<number, MonthStats[]> = {};
    for (const item of stats) {
      if (!years[item.year]) {
        years[item.year] = [];
      }
      years[item.year].push(item);
    }

    return Object.keys(years)
      .sort((a, b) => parseInt(b) - parseInt(a))
      .map((year) => renderYear(years[parseInt(year)]));
  }, [renderYear, stats]);

  return (
    <Flex direction="column" gap={'xl'} align={'stretch'} style={{ textAlign: 'left' }}>
      <Flex direction="row" justify={'space-between'} style={{ maxWidth: 200 }}>
        <Text>total words:</Text>
        <Text className={'highlight'}>{translations?.length}</Text>
      </Flex>

      <Flex direction="column" gap={'sm'} style={{ width: '100%' }}>
        {monthStatsRendered}
      </Flex>
    </Flex>
  );
}
