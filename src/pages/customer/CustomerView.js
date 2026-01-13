import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
import CustomerDetail from '../../sections/@dashboard/customer/CustomerFormView';

// ----------------------------------------------------------------------

export default function CustomerView() {
    const { themeStretch } = useSettings();

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
        <Page title="Customer: View">
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <HeaderBreadcrumbs
                    heading='Detail Customer'
                    links={[
                        { name: 'Dashboard', href: PATH_DASHBOARD.root },
                        { name: 'Customer', href: PATH_DASHBOARD.customer.root },
                        { name: 'Detail' },
                    ]}
                />

                <CustomerDetail currentData={currentData} />
            </Container>
        </Page>
    );
}
