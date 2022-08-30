/*
  Because of a regression in CRA v5, Typescript is wrongly enforced here
  See https://github.com/facebook/create-react-app/pull/11875
*/
// eslint-disable-next-line
// @ts-nocheck
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SnackbarProvider } from 'notistack';

import { UsersService, ApiError } from 'src/services/openapi';

import CreateVoucherForm from './CreateVoucherForm';

describe('CreateVoucherForm', () => {
  const onVoucherCreated = jest.fn();
  const Component = () => (
    <SnackbarProvider>
      <CreateVoucherForm onVoucherCreated={onVoucherCreated} />
    </SnackbarProvider>
  );
  const user = userEvent.setup();

  const getUsernameInput = () => screen.queryByLabelText(/username/i);

  const submitForm = async ({ username }) => {
    const input = getUsernameInput();
    expect(input).toBeTruthy();
    await user.click(input);
    await user.keyboard(username);
    await user.keyboard('{Enter}');
  };

  it('creates a voucher when the form is submitted', async () => {
    const createdVoucher = {
      to: 'someone',
      by: 'current_user',
      value: 1.0,
      is_public: true,
    };
    const createVoucherServiceSpy = jest
      .spyOn(UsersService, 'usersMeVouchersCreate')
      .mockImplementation(async () => createdVoucher);

    render(<Component />);
    await submitForm({ username: 'someone' });

    expect(createVoucherServiceSpy).toHaveBeenCalledWith({
      requestBody: { to: 'someone' },
    });
    expect(onVoucherCreated).toHaveBeenCalledWith(createdVoucher);
    screen.getByText('personalVouchers.voucherCreated');
    expect(getUsernameInput().value).toEqual('');
  });

  it('handles error on submit', async () => {
    jest
      .spyOn(UsersService, 'usersMeVouchersCreate')
      .mockImplementation(async () => {
        const response = {
          url: 'some url',
          status: 400,
          statusText: 'Bad Request',
          body: { to: ['some error'] },
        };
        throw new ApiError(response);
      });
    const onVoucherCreated = jest.fn();

    render(
      <SnackbarProvider>
        <CreateVoucherForm onVoucherCreated={onVoucherCreated} />
      </SnackbarProvider>
    );
    await submitForm({ username: 'someone' });

    expect(onVoucherCreated).not.toHaveBeenCalled();
    screen.getByText('some error');
    expect(getUsernameInput().value).toEqual('someone');
  });
});
