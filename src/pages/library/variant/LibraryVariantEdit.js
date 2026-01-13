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
import VariantForm from '../../../sections/@dashboard/library/variant/VariantForm';

// ----------------------------------------------------------------------

export default function LibraryVariantEdit() {
    const { themeStretch } = useSettings();

    const { pathname } = useLocation();

    const isEdit = pathname.includes('edit');

    const { id = '' } = useParams();

    const [currentData, setCurrentData] = useState({});

    useEffect(() => {
        const getData = async () => {
            try {
                await axios.get(`/variants/${id}`).then((response) => {
                    setCurrentData(response.data);
                });
            } catch (error) {
                console.log(error);
            }
        };
        getData();
    }, [id]);

    return (
        <Page title="Variant: Edit">
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <HeaderBreadcrumbs
                    heading='Edit Variant'
                    links={[
                        { name: 'Dashboard', href: PATH_DASHBOARD.root },
                        { name: 'Library', href: PATH_DASHBOARD.library.root },
                        { name: 'Variant', href: PATH_DASHBOARD.library.variant },
                        { name: 'Edit' },
                    ]}
                />

                <VariantForm isEdit={isEdit} currentData={currentData} />
            </Container>
        </Page>
    );
}
