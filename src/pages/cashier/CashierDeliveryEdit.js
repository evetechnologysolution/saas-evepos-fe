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
import OrdersForm from '../../sections/@dashboard/cashier/delivery/OrdersForm';

// ----------------------------------------------------------------------

export default function CashierDeliveryEdit() {
    const { themeStretch } = useSettings();

    const { id = '' } = useParams();

    const [currentData, setCurrentData] = useState({});

    useEffect(() => {
        const getData = async () => {
            try {
                await axios.get(`/orders/${id}`).then((response) => {
                    setCurrentData(response.data);
                });
            } catch (error) {
                console.log(error);
            }
        };
        getData();
    }, [id]);

    return (
        <Page title="Delivery: Edit">
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <HeaderBreadcrumbs
                    heading='Edit Delivery'
                    links={[
                        { name: 'Dashboard', href: PATH_DASHBOARD.root },
                        { name: 'Cashier', href: PATH_DASHBOARD.cashier.root },
                        { name: 'Delivery', href: PATH_DASHBOARD.cashier.delivery },
                        { name: 'Edit' },
                    ]}
                />

                <OrdersForm currentData={currentData} />
            </Container>
        </Page>
    );
}
