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
import HistoryForm from "../../sections/@dashboard/history/order/HistoryForm";

// ----------------------------------------------------------------------

export default function HistoryOrderView() {
    const { themeStretch } = useSettings();

    return (
        <Page title="Track Order History">
            <Container maxWidth={themeStretch ? false : "xl"}>
                <HeaderBreadcrumbs
                    heading="Track Order History"
                    links={[
                        { name: "Dashboard", href: PATH_DASHBOARD.root },
                        { name: "Track Order History", href: PATH_DASHBOARD.history.order },
                        { name: "Detail" },
                    ]}
                />

                <HistoryForm />
            </Container>
        </Page>
    );
}
