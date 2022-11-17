import {
  Autocomplete,
  Button,
  Loader,
  LoadingOverlay,
  NumberInput,
  Stack,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { IconAt, IconCurrencyDollar } from '@tabler/icons';
import { useState } from 'react';

import { UserState } from '#/frontend/state/user.state';
import { useAxios } from '#/frontend/utils/axios.util';

export function TransferPage() {
  const { axios } = useAxios();
  const [loading, setLoading] = useState(false);
  const [loadingNames, setLoadingNames] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const form = useForm({
    initialValues: {
      username: '',
      value: 1,
    },
  });

  return (
    <>
      <Title order={3}>send money to other users:</Title>
      <div style={{ width: 400, position: 'relative' }}>
        <LoadingOverlay visible={loading} overlayBlur={2} />
        <form
          onSubmit={form.onSubmit(async () => {
            const { username, value } = form.values;
            try {
              setLoading(true);
              const response = await axios.post('/account/cashout', {
                to: username,
                value,
              });
              if (response.status === 201) {
                showNotification({
                  title: response.status,
                  message: 'cash out successful',
                  color: 'green',
                });
              }
            } catch (err) {
              //
            } finally {
              setLoading(false);
            }
          })}
        >
          <Stack>
            <Autocomplete
              required
              data={suggestions}
              icon={<IconAt size={16} />}
              label='recipient username'
              placeholder='username of recipient'
              value={form.values.username}
              rightSection={loadingNames && <Loader size={16} />}
              onChange={async (str) => {
                if (str.trim() === '') {
                  form.setFieldValue('username', '');
                  setSuggestions([]);
                  return;
                }
                form.setFieldValue('username', str);
                await new Promise((r) => {
                  setTimeout(r, 500);
                });
                setLoadingNames(true);
                try {
                  const response = await axios.get<UserState[]>(
                    `/users?username=${str}`,
                  );
                  setSuggestions(response.data.map((u) => u.username));
                } catch (err) {
                  //
                } finally {
                  setLoadingNames(false);
                }
              }}
            />

            <NumberInput
              required
              type='number'
              icon={<IconCurrencyDollar size={16} />}
              label='amount'
              decimalSeparator='.'
              precision={2}
              min={1}
              placeholder='username of recipient'
              value={form.values.value}
              onChange={(val) => form.setFieldValue('value', val ?? 0)}
            />

            <Button
              disabled={form.values.username === '' || form.values.value < 1}
              type='submit'
            >
              cash out
            </Button>
          </Stack>
        </form>
      </div>
    </>
  );
}
