import React, { useState, useCallback } from 'react';
import { TextField, Button, FormGroup, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { UsersService, GivenVoucher } from 'src/services/openapi';
import { useNotifications } from 'src/hooks';

const inputProps = {
  // If not set some browsers may auto fill the input with a saved username, because the input label in English is "Username"
  autoComplete: 'new-password',
};

const CreateVoucherForm = ({
  onVoucherCreated = () => undefined,
}: {
  onVoucherCreated?: (voucher: GivenVoucher) => void;
}) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState<string>('');
  const { displayErrorsFrom, showSuccessAlert } = useNotifications();

  const handleUsernameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setUsername(event.target.value);
    },
    []
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      try {
        const response = await UsersService.usersMeVouchersCreate({
          requestBody: { to: username },
        });
        showSuccessAlert(t('personalVouchers.voucherCreated', { username }));
        onVoucherCreated(response);
        setUsername('');
      } catch (error) {
        displayErrorsFrom(error);
      }
    },
    [username, onVoucherCreated, t, showSuccessAlert, displayErrorsFrom]
  );

  return (
    <form onSubmit={handleSubmit}>
      <Typography paragraph>{t('personalVouchers.introduction')}</Typography>
      <FormGroup row>
        <TextField
          label={t('personalVouchers.usernameLabel')}
          value={username}
          onChange={handleUsernameChange}
          inputProps={inputProps}
          variant="outlined"
        />
        <Button type="submit" variant="contained" disableElevation>
          {t('personalVouchers.submitButton')}
        </Button>
      </FormGroup>
    </form>
  );
};

export default CreateVoucherForm;
