// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import CustomerForm from '../../sections/@dashboard/customer/CustomerForm';

// ----------------------------------------------------------------------

export default function CustomerCreate() {
    const { themeStretch } = useSettings();

    return (
        <Page title="Customer: New">
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <HeaderBreadcrumbs
                    heading='New Customer'
                    links={[
                        { name: 'Dashboard', href: PATH_DASHBOARD.root },
                        { name: 'Customer', href: PATH_DASHBOARD.customer.root },
                        { name: 'New' },
                    ]}
                />

                <CustomerForm />
            </Container>
        </Page>
    );
}
