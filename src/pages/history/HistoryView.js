// @mui
import { Container } from "@mui/material";
// routes
import { PATH_DASHBOARD } from "../../routes/paths";
// hooks
import useSettings from "../../hooks/useSettings";
// components
import Page from "../../components/Page";
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
// sections
import HistoryForm from "../../sections/@dashboard/history/HistoryForm";

// ----------------------------------------------------------------------

export default function HistoryView() {
    const { themeStretch } = useSettings();

    return (
        <Page title="Track History">
            <Container maxWidth={themeStretch ? false : "xl"}>
                <HeaderBreadcrumbs
                    heading="Track History"
                    links={[
                        { name: "Dashboard", href: PATH_DASHBOARD.root },
                        { name: "Track History", href: PATH_DASHBOARD.history.root },
                        { name: "Detail" },
                    ]}
                />

                <HistoryForm />
            </Container>
        </Page>
    );
}
