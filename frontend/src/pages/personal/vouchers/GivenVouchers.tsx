import React from 'react';
import { Box, Chip, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { UsersService, GivenVoucher } from 'src/services/openapi';

const VoucherChip = ({ username }: { username: string }) => (
  <Chip label={username} />
);

const GivenVoucherList = ({ vouchers }: { vouchers?: GivenVoucher[] }) => {
  const { t } = useTranslation();

  if (vouchers === undefined) return null;

  if (vouchers.length === 0)
    return (
      <Typography paragraph>{t('personalVouchers.noVoucherGiven')}</Typography>
    );

  return (
    <Stack spacing={1} direction="row" sx={{ py: 2 }}>
      {vouchers.map(({ to }) => (
        <VoucherChip key={to} username={to} />
      ))}
    </Stack>
  );
};

const GivenVouchers = () => {
  const { t } = useTranslation();
  const [vouchers, setVouchers] = React.useState<GivenVoucher[] | undefined>();

  React.useEffect(() => {
    const load = async () => {
      const response = await UsersService.usersMeVouchersGivenList();
      setVouchers(response);
    };
    load();
  }, []);

  return (
    <Box py={2}>
      <Typography variant="h6">
        {t('personalVouchers.givenVouchersTitle')}
      </Typography>
      <GivenVoucherList vouchers={vouchers} />
    </Box>
  );
};

export default GivenVouchers;
