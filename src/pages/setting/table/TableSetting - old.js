import React, { useEffect, useContext } from 'react';
// @mui
import {
    Card,
    Container,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import TableView from '../../../components/tableView/TableView';
// context
import { tableContext } from '../../../contexts/TableContext';

// ----------------------------------------------------------------------

export default function TableSetting() {
    const { themeStretch } = useSettings();

    const ctt = useContext(tableContext);

    useEffect(() => {
        ctt.getTableData();
    }, []);


    return (
        <Page title="Table Setting">
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <HeaderBreadcrumbs
                    heading="Table Setting"
                    links={[
                        { name: 'Dashboard', href: PATH_DASHBOARD.root },
                        { name: 'Table Setting' },
                    ]}
                />

                <Card>
                    <TableView />
                </Card>
            </Container>
        </Page>
    );
}
