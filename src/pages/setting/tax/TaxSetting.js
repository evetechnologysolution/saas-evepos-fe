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
import TaxSettingForm from '../../../sections/@dashboard/library/tax-setting/TaxSettingForm';

// ----------------------------------------------------------------------

export default function TaxSetting() {
    const { themeStretch } = useSettings();

    return (
        <Page title="Receipt Setting">
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <HeaderBreadcrumbs
                    heading='Tax Setting'
                    links={[
                        { name: 'Dashboard', href: PATH_DASHBOARD.root },
                        { name: 'Tax Setting', href: PATH_DASHBOARD.settings.tax }
                    ]}
                />

                <TaxSettingForm />
            </Container>
        </Page>
    );
}
