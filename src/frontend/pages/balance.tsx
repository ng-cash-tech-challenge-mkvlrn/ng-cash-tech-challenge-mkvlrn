import { Loader, Text, Title } from '@mantine/core';
import { useEffect, useState } from 'react';

import { useAxios } from '#/frontend/utils/axios.util';

export function BalancePage() {
  const { axios } = useAxios();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getBalance = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/account/balance');
        setBalance(response.data.balance);
      } catch (err) {
        //
      } finally {
        setLoading(false);
      }
    };

    getBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {loading && <Loader size='xl' />}
      {!loading && (
        <>
          <Title order={3}>your current balance:</Title>
          <Text style={{ fontSize: '18rem' }}>
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(balance)}
          </Text>
        </>
      )}
    </>
  );
}
