import { useContext } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import CustomerForm from '../../sections/@dashboard/pos/customer/CustomerForm';
// context
import { cashierContext } from "../../contexts/CashierContext";

// ----------------------------------------------------------------------

export default function PosCustomerCreate() {
    const { themeStretch } = useSettings();

    const { pathname } = useLocation();

    const isEdit = pathname.includes('edit');

    const { id = '' } = useParams();

    const ctx = useContext(cashierContext);

    const currentData = ctx.customer.find((item) => paramCase(item._id) === id);

    return (
        <Page title="Customer: New">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <HeaderBreadcrumbs
                    heading='New Customer'
                    links={[
                        { name: 'Dashboard', href: PATH_DASHBOARD.root },
                        { name: 'Pos', href: PATH_DASHBOARD.pos.root },
                        { name: 'Customer', href: PATH_DASHBOARD.pos.customer },
                        { name: 'New' },
                    ]}
                />

                <CustomerForm isEdit={isEdit} currentData={currentData} />
            </Container>
        </Page>
    );
}
