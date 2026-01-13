import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// @mui
import { Container } from "@mui/material";
import axios from "../../../utils/axios";
// routes
import { PATH_DASHBOARD } from "../../../routes/paths";
// hooks
import useSettings from "../../../hooks/useSettings";
// components
import Page from "../../../components/Page";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
// sections
import MemberDetail from "../../../sections/@dashboard/member/MemberFormView";

// ----------------------------------------------------------------------

export default function MemberView() {
    const { themeStretch } = useSettings();

    const { id = "" } = useParams();

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
        <Page title="Customer: View">
            <Container maxWidth={themeStretch ? false : "xl"}>
                <HeaderBreadcrumbs
                    heading="Detail Member"
                    links={[
                        { name: "Dashboard", href: PATH_DASHBOARD.root },
                        { name: "Member", href: PATH_DASHBOARD.member.list },
                        { name: "Detail" },
                    ]}
                />

                <MemberDetail currentData={currentData} />
            </Container>
        </Page>
    );
}
