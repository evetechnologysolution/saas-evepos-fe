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
import MemberDetail from "./sections/MemberPointFormView";

// ----------------------------------------------------------------------

export default function MemberPointView() {
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
        <Page title="Member Point: View">
            <Container maxWidth={themeStretch ? false : "xl"}>
                <HeaderBreadcrumbs
                    heading="Detail Member Point"
                    links={[
                        { name: "Dashboard", href: PATH_DASHBOARD.root },
                        { name: "Report", href: PATH_DASHBOARD.report.root },
                        { name: "Member Point", href: PATH_DASHBOARD.report.memberPoint },
                        { name: "Detail" },
                    ]}
                />

                <MemberDetail currentData={currentData} />
            </Container>
        </Page>
    );
}
