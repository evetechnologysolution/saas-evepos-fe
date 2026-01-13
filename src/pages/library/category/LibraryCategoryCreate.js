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
import CategoryForm from '../../../sections/@dashboard/library/category/CategoryForm';

// ----------------------------------------------------------------------

export default function LibraryCategoryCreate() {
    const { themeStretch } = useSettings();
    
    return (
        <Page title="Category: New">
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <HeaderBreadcrumbs
                    heading='New Category'
                    links={[
                        { name: 'Dashboard', href: PATH_DASHBOARD.root },
                        { name: 'Library', href: PATH_DASHBOARD.library.root },
                        { name: 'Category', href: PATH_DASHBOARD.library.category },
                        { name: 'New' },
                    ]}
                />

                <CategoryForm />
            </Container>
        </Page>
    );
}
