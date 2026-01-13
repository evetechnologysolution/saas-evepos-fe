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
import GenerateForm from '../../sections/@dashboard/cashier/qrdata/GenerateQrdata';

// ----------------------------------------------------------------------

export default function CashierQrdataGenerate() {
    const { themeStretch } = useSettings();

    return (
        <Page title="QR Code: Generate">
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <HeaderBreadcrumbs
                    heading='Generate QR'
                    links={[
                        { name: 'Dashboard', href: PATH_DASHBOARD.root },
                        { name: 'Mobile Order', href: PATH_DASHBOARD.cashier.qrdataGenerate },
                        { name: 'Generate QR' },
                    ]}
                />

                <GenerateForm />
            </Container>
        </Page>
    );
}
