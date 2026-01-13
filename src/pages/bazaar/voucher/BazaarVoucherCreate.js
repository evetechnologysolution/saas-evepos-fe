import React from "react";
// @mui
import { Container } from "@mui/material";
// components
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import Page from "../../../components/Page";
// routes
import { PATH_DASHBOARD } from "../../../routes/paths";
// hooks
import useSettings from "../../../hooks/useSettings";
// sections
import BazaarVoucherForm from "./sections/BazaarVoucherForm";

export default function BazaarVoucherCreate() {
  const { themeStretch } = useSettings();

  return (
    <Page title="Voucher Bazaar: New">
      <Container maxWidth={themeStretch ? false : "xl"}>
        <HeaderBreadcrumbs
          heading="New Voucher Bazaar"
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            { name: "Bazaar", href: PATH_DASHBOARD.bazaar.root },
            { name: "Voucher", href: PATH_DASHBOARD.bazaar.voucher },
            { name: "New" },
          ]}
        />

        <BazaarVoucherForm />
      </Container>
    </Page>
  );
}
