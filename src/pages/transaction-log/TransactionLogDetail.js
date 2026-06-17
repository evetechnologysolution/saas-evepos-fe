import { useParams } from 'react-router-dom';
// @mui
import { Box, CircularProgress, Container } from '@mui/material';
import TransactionForm from 'src/sections/@dashboard/transaction-log/TransactionForm';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import useOrder from './service/useTransaction';

// ----------------------------------------------------------------------

export default function TransactionLogDetail() {
  const { themeStretch } = useSettings();
  const { getById } = useOrder();

  const { id = '' } = useParams();

  const { data: currentData, isLoading } = getById(id);

  return (
    <Page title="Transaction: Detail">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="Transaction Detail"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Transaction Log', href: PATH_DASHBOARD.transactionLog.root },
            { name: 'Detail' },
          ]}
        />

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <TransactionForm currentData={currentData} />
        )}
      </Container>
    </Page>
  );
}
