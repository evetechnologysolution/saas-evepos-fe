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
import VariantForm from '../../../sections/@dashboard/library/variant/VariantForm';

// ----------------------------------------------------------------------

export default function LibraryVariantCreate() {
    const { themeStretch } = useSettings();

    return (
        <Page title="Variant: New">
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <HeaderBreadcrumbs
                    heading='New Variant'
                    links={[
                        { name: 'Dashboard', href: PATH_DASHBOARD.root },
                        { name: 'Library', href: PATH_DASHBOARD.library.root },
                        { name: 'Variant', href: PATH_DASHBOARD.library.variant },
                        { name: 'New' },
                    ]}
                />

                <VariantForm />
            </Container>
        </Page>
    );
}
