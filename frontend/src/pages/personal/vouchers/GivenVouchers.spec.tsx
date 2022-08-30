/*
  Because of a regression in CRA v5, Typescript is wrongly enforced here
  See https://github.com/facebook/create-react-app/pull/11875
*/
// eslint-disable-next-line
// @ts-nocheck
import React from 'react';
import { render } from '@testing-library/react';
import { waitFor } from '@testing-library/dom';

import { UsersService } from 'src/services/openapi';

import GivenVouchers from './GivenVouchers';

describe('GivenVouchers', () => {
  it('lists given vouchers', async () => {
    jest
      .spyOn(UsersService, 'usersMeVouchersGivenList')
      .mockImplementation(async () => [
        {
          to: 'to_username1',
          by: 'by_username',
          value: 1.0,
          is_public: true,
        },
        {
          to: 'to_username2',
          by: 'by_username',
          value: 1.0,
          is_public: true,
        },
      ]);
    const { getByText } = render(<GivenVouchers />);
    await waitFor(() => getByText('to_username1'));
    await waitFor(() => getByText('to_username2'));
  });
});
