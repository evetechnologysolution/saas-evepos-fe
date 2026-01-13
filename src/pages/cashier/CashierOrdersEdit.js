import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// @mui
import { Container } from "@mui/material";
import axios from "../../utils/axios";
// routes
import { PATH_DASHBOARD } from "../../routes/paths";
// hooks
import useSettings from "../../hooks/useSettings";
// components
import Page from "../../components/Page";
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
// sections
import OrdersForm from "../../sections/@dashboard/cashier/orders/OrdersForm";

// ----------------------------------------------------------------------

export default function CashierOrdersEdit() {
    const { themeStretch } = useSettings();

    const { id = "" } = useParams();

    const [currentData, setCurrentData] = useState({});

    useEffect(() => {
        const getData = async () => {
            try {
                await axios.get(`/orders/${id}`).then((response) => {
                    setCurrentData(response.data);
                });
            } catch (error) {
                console.log(error);
            }
        };
        getData();
    }, [id]);

    return (
        <Page title="Orders: Edit">
            <Container maxWidth={themeStretch ? false : "xl"}>
                <HeaderBreadcrumbs
                    heading="Edit Orders"
                    links={[
                        { name: "Dashboard", href: PATH_DASHBOARD.root },
                        { name: "Cashier", href: PATH_DASHBOARD.cashier.root },
                        { name: "Orders", href: PATH_DASHBOARD.cashier.orders },
                        { name: "Edit" },
                    ]}
                />

                <OrdersForm currentData={currentData} />
            </Container>
        </Page>
    );
}
