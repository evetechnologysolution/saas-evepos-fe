/* eslint-disable import/no-unresolved */
// @mui
import { Container, Box } from "@mui/material";
// routes
import { PATH_DASHBOARD } from "../routes/paths";
import useSettings from "../hooks/useSettings";
// components
import Page from "../components/Page";
import HeaderBreadcrumbs from "../components/HeaderBreadcrumbs";
// sections
import {
  AccountProfile,
} from "../sections/@dashboard/user/account";

// ----------------------------------------------------------------------

export default function UserProfile() {
  const { themeStretch } = useSettings();

  return (
    <Page title="User: Account Settings">
      <Container maxWidth={themeStretch ? false : "lg"}>
        <HeaderBreadcrumbs
          heading="Profile"
          links={[{ name: "Dashboard", href: PATH_DASHBOARD.root }, { name: "Profile Settings" }]}
        />

        <Box sx={{ mb: 5 }} />
        <Box>
          <AccountProfile />
        </Box>

      </Container>
    </Page>
  );
}
