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
import SettingForm from '../../../sections/@dashboard/library/table-setting/SettingForm';

// ----------------------------------------------------------------------

export default function TableSettingCreate() {
    const { themeStretch } = useSettings();

    const { pathname } = useLocation();

    const isEdit = pathname.includes('edit');

    const { id = '' } = useParams();

    const [currentData, setCurrentData] = useState({});

    useEffect(() => {
        const getData = async () => {
            try {
                await axios.get(`/table-setting/${id}`).then((response) => {
                    setCurrentData(response.data);
                });
            } catch (error) {
                console.log(error);
            }
        };
        getData();
    }, [id]);

    return (
        <Page title="Table Setting: Edit">
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <HeaderBreadcrumbs
                    heading='Edit Table Setting'
                    links={[
                        { name: 'Dashboard', href: PATH_DASHBOARD.root },
                        { name: 'Table Setting', href: PATH_DASHBOARD.settings.tableSetting },
                        { name: 'Edit' },
                    ]}
                />

                <SettingForm isEdit={isEdit} currentData={currentData} />
            </Container>
        </Page>
    );
}
