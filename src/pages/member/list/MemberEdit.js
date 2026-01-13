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
import MemberForm from '../../../sections/@dashboard/member/MemberForm';

// ----------------------------------------------------------------------

export default function MemberEdit() {
    const { themeStretch } = useSettings();

    const { pathname } = useLocation();

    const isEdit = pathname.includes('edit');

    const { id = '' } = useParams();

    const [currentData, setCurrentData] = useState({});

    useEffect(() => {
        const getData = async () => {
            try {
                await axios.get(`/members/${id}`).then((response) => {
                    setCurrentData(response.data);
                });
            } catch (error) {
                console.log(error);
            }
        };
        getData();
    }, [id]);

    return (
        <Page title="Member: Edit">
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <HeaderBreadcrumbs
                    heading='Edit Member'
                    links={[
                        { name: 'Dashboard', href: PATH_DASHBOARD.root },
                        { name: 'Member', href: PATH_DASHBOARD.member.list },
                        { name: 'Edit' },
                    ]}
                />

                <MemberForm isEdit={isEdit} currentData={currentData} />
            </Container>
        </Page>
    );
}
