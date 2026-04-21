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
import DiscountForm from "../../../sections/@dashboard/library/discount/DeliveryDiscountForm";

// ----------------------------------------------------------------------

export default function DeliveryDiscount() {
    const { themeStretch } = useSettings();

    return (
        <Page title="Delivery Discount">
            <Container maxWidth={themeStretch ? false : "xl"}>
                <HeaderBreadcrumbs
                    heading="Delivery Discount"
                    links={[
                        { name: "Dashboard", href: PATH_DASHBOARD.root },
                        { name: "Library", href: PATH_DASHBOARD.library.root },
                        { name: "Delivery Discount", href: PATH_DASHBOARD.library.deliveryDiscount },
                    ]}
                />

                <DiscountForm />
            </Container>
        </Page>
    );
}
