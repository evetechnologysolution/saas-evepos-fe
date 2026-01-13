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
import SettingForm from '../../../sections/@dashboard/library/table-setting/SettingForm';

// ----------------------------------------------------------------------

export default function TableSettingCreate() {
    const { themeStretch } = useSettings();

    return (
        <Page title="Table Setting: New">
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <HeaderBreadcrumbs
                    heading='New Table Setting'
                    links={[
                        { name: 'Dashboard', href: PATH_DASHBOARD.root },
                        { name: 'Table Setting', href: PATH_DASHBOARD.settings.tableSetting },
                        { name: 'New' },
                    ]}
                />

                <SettingForm />
            </Container>
        </Page>
    );
}
