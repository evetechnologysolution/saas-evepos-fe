import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
import { useQuery } from 'react-query';
import axios from '../../../utils/axios';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
// sections
import MemberForm from '../../../sections/@dashboard/member/MemberForm';

// ----------------------------------------------------------------------

const fetchMember = async (id) => {
  const { data } = await axios.get(`/member/${id}`);
  return data;
};

export default function MemberEdit() {
  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const { id = '' } = useParams();

  const isEdit = pathname.includes('edit');

  const {
    data: currentData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['member', id],
    queryFn: () => fetchMember(id),
    enabled: !!id,
  });

  return (
    <Page title="Member: Edit">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="Edit Member"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Member', href: PATH_DASHBOARD.member.list },
            { name: 'Edit' },
          ]}
        />

        <MemberForm isEdit={isEdit} currentData={currentData} isLoading={isLoading} isError={isError} />
      </Container>
    </Page>
  );
}
