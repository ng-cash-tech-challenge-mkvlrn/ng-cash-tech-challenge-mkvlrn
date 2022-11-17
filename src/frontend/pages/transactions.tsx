import {
  Group,
  Loader,
  SegmentedControl,
  Table,
  Text,
  Title,
} from '@mantine/core';
import { IconArrowDown, IconArrowUp } from '@tabler/icons';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { useEffect, useState } from 'react';

import { Transaction } from '#/frontend/interfaces/Transaction';
import { useAxios } from '#/frontend/utils/axios.util';

dayjs.extend(localizedFormat);

export function TransactionsPage() {
  const { axios } = useAxios();
  const [tx, setTx] = useState<Transaction[]>([]);
  const [flowFilter, setFlowFilter] = useState('ALL');
  const [lastFilter, setLastFilter] = useState('D_30');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getTx = async () => {
      setLoading(true);
      try {
        const endpoint = `/account/transactions?flow=${flowFilter}&last=${lastFilter}`;
        const response = await axios.get<Transaction[]>(endpoint);
        setTx(response.data);
      } catch (err) {
        //
      } finally {
        setLoading(false);
      }
    };

    getTx();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flowFilter, lastFilter]);

  return (
    <>
      <Title order={3} mb='md'>
        your latest transactions:
      </Title>
      <Group mb='sm'>
        <Text>filter by flow:</Text>
        <SegmentedControl
          value={flowFilter}
          onChange={setFlowFilter}
          data={[
            { label: 'all', value: 'ALL' },
            { label: 'out', value: 'OUT' },
            { label: 'in', value: 'IN' },
          ]}
        />
      </Group>
      <Group mb='sm'>
        <Text>filter by date range:</Text>
        <SegmentedControl
          value={lastFilter}
          onChange={setLastFilter}
          data={[
            { label: '30 mins', value: 'M_30' },
            { label: '1 hour', value: 'H_01' },
            { label: '1 day', value: 'D_01' },
            { label: '7 days', value: 'D_07' },
            { label: '15 days', value: 'D_15' },
            { label: '30 days', value: 'D_30' },
            { label: '60 days', value: 'D_60' },
            { label: '90 days', value: 'D_90' },
          ]}
        />
      </Group>
      {loading && <Loader />}
      {!loading && tx.length === 0 && (
        <Title order={4}>no transaction data</Title>
      )}
      {!loading && tx.length > 0 && (
        <Table
          verticalSpacing='sm'
          withBorder
          withColumnBorders
          striped
          fontSize='lg'
        >
          <thead>
            <tr>
              <th>flow</th>
              <th>to/from</th>
              <th>value</th>
              <th>date</th>
            </tr>
          </thead>
          <tbody>
            {tx.map((t) => (
              <tr key={t.id}>
                <td
                  title={t.cashFlow === 'OUT' ? 'money sent' : 'money received'}
                >
                  {t.cashFlow === 'OUT' && (
                    <IconArrowDown size={36} color='red' />
                  )}
                  {t.cashFlow === 'IN' && (
                    <IconArrowUp size={36} color='green' />
                  )}
                </td>
                <td>
                  {t.cashFlow === 'OUT' ? 'to' : 'from'} @
                  {t.cashFlow === 'OUT' ? t.to : t.from}
                </td>
                <td>
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(t.value)}
                </td>
                <td>{dayjs(t.date).format('llll')}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}
