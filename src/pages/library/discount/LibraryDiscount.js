// @mui
import { Container } from "@mui/material";
// routes
import { PATH_DASHBOARD } from "../../../routes/paths";
// hooks
import useSettings from "../../../hooks/useSettings";
// components
import Page from "../../../components/Page";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
// sections
import DiscountForm from "../../../sections/@dashboard/library/discount/DiscountForm";

// ----------------------------------------------------------------------

export default function Discount() {
    const { themeStretch } = useSettings();

    return (
        <Page title="Discount">
            <Container maxWidth={themeStretch ? false : "xl"}>
                <HeaderBreadcrumbs
                    heading="Discount"
                    links={[
                        { name: "Dashboard", href: PATH_DASHBOARD.root },
                        { name: "Library", href: PATH_DASHBOARD.library.root },
                        { name: "Discount", href: PATH_DASHBOARD.library.discount },
                    ]}
                />

                <DiscountForm />
            </Container>
        </Page>
    );
}
