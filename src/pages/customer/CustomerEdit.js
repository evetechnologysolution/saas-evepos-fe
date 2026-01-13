import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
import axios from '../../utils/axios';
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

export default function CustomerEdit() {
    const { themeStretch } = useSettings();

    const { pathname } = useLocation();

    const isEdit = pathname.includes('edit');

    const { id = '' } = useParams();

    const [currentData, setCurrentData] = useState({});

    useEffect(() => {
        const getData = async () => {
            try {
                await axios.get(`/customers/${id}`).then((response) => {
                    setCurrentData(response.data);
                });
            } catch (error) {
                console.log(error);
            }
        };
        getData();
    }, [id]);

    return (
        <Page title="Customer: Edit">
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <HeaderBreadcrumbs
                    heading='Edit Customer'
                    links={[
                        { name: 'Dashboard', href: PATH_DASHBOARD.root },
                        { name: 'Customer', href: PATH_DASHBOARD.customer.root },
                        { name: 'Edit' },
                    ]}
                />

                <CustomerForm isEdit={isEdit} currentData={currentData} />
            </Container>
        </Page>
    );
}
