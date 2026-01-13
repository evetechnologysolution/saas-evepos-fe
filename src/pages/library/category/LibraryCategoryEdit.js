import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
import axios from '../../../utils/axios';
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

export default function LibraryCategoryEdit() {
    const { themeStretch } = useSettings();

    const { pathname } = useLocation();

    const isEdit = pathname.includes('edit');

    const { id = '' } = useParams();

    const [currentData, setCurrentData] = useState({});

    useEffect(() => {
        const getData = async () => {
            try {
                await axios.get(`/categories/${id}`).then((response) => {
                    setCurrentData(response.data);
                });
            } catch (error) {
                console.log(error);
            }
        };
        getData();
    }, [id]);

    return (
        <Page title="Category: Edit">
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <HeaderBreadcrumbs
                    heading='Edit Category'
                    links={[
                        { name: 'Dashboard', href: PATH_DASHBOARD.root },
                        { name: 'Library', href: PATH_DASHBOARD.library.root },
                        { name: 'Category', href: PATH_DASHBOARD.library.category },
                        { name: 'Edit' },
                    ]}
                />

                <CategoryForm isEdit={isEdit} currentData={currentData} />
            </Container>
        </Page>
    );
}
