// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
// sections
import ReceiptSettingForm from '../../../sections/@dashboard/library/receipt-setting/ReceiptSettingForm';

// ----------------------------------------------------------------------

export default function ReceiptSetting() {
    const { themeStretch } = useSettings();

    return (
        <Page title="Receipt Setting">
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <HeaderBreadcrumbs
                    heading='Receipt Setting'
                    links={[
                        { name: 'Dashboard', href: PATH_DASHBOARD.root },
                        { name: 'Receipt Setting', href: PATH_DASHBOARD.settings.receiptSetting }
                    ]}
                />

                <ReceiptSettingForm />
            </Container>
        </Page>
    );
}
