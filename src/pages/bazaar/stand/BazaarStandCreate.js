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
import Form from "./sections/StandForm";

export default function StandCreate() {
  const { themeStretch } = useSettings();

  return (
    <Page title="Stand: New">
      <Container maxWidth={themeStretch ? false : "xl"}>
        <HeaderBreadcrumbs
          heading="New Stand"
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            { name: "Bazaar", href: PATH_DASHBOARD.bazaar.root },
            { name: "Stand", href: PATH_DASHBOARD.bazaar.stand },
            { name: "New" },
          ]}
        />

        <Form />
      </Container>
    </Page>
  );
}
