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
import VoucherForm from "../../../sections/@dashboard/library/voucher/VoucherForm";

export default function LibraryVoucherCreate() {
  const { themeStretch } = useSettings();

  return (
    <Page title="Voucher: New">
      <Container maxWidth={themeStretch ? false : "xl"}>
        <HeaderBreadcrumbs
          heading="New Voucher"
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            { name: "Library", href: PATH_DASHBOARD.library.root },
            { name: "Voucher", href: PATH_DASHBOARD.library.voucher },
            { name: "New" },
          ]}
        />

        <VoucherForm />
      </Container>
    </Page>
  );
}
