import React from 'react';
import { useTranslation } from 'react-i18next';

import { ContentBox, ContentHeader } from 'src/components';

import CreateVoucherForm from './CreateVoucherForm';
import GivenVouchers from './GivenVouchers';

const PersonalVouchersPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <ContentHeader title={t('personalMenu.vouchers')} />
      <ContentBox noMinPaddingX maxWidth="lg">
        <CreateVoucherForm />
        <GivenVouchers />
      </ContentBox>
    </>
  );
};

export default PersonalVouchersPage;
