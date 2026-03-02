import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { CircularProgress, Container } from '@mui/material';
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
import MemberDetail from '../../../sections/@dashboard/member/MemberFormView';

// ----------------------------------------------------------------------

export default function MemberView() {
  const { themeStretch } = useSettings();

  const { id = '' } = useParams();

  const getData = async (id) => {
    try {
      const res = await axios.get(`/member/${id}`);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const { data: currentData, isLoading } = useQuery({
    queryKey: ['member', id],
    queryFn: () => getData(id),
    enabled: !!id,
  });

  return (
    <Page title="Customer: View">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="Detail Member"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Member', href: PATH_DASHBOARD.member.list },
            { name: 'Detail' },
          ]}
        />

        {isLoading ? <CircularProgress /> : <MemberDetail currentData={currentData} />}
      </Container>
    </Page>
  );
}
