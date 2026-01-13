// @mui
import { Card, Container } from "@mui/material";
// routes
import { PATH_DASHBOARD } from "../../routes/paths";
// hooks
import useSettings from "../../hooks/useSettings";
// components
import Page from "../../components/Page";
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import { ChatSidebar, ChatWindow } from "../../sections/@dashboard/chat";

// ----------------------------------------------------------------------

export default function Chat() {
  const { themeStretch } = useSettings();

  return (
    <Page title="Chat">
      <Container maxWidth={themeStretch ? false : "xl"}>
        <HeaderBreadcrumbs
          heading="Chat"
          links={[{ name: "Dashboard", href: PATH_DASHBOARD.root }, { name: "Chat" }]}
        />
        <Card sx={{ height: "72vh", display: "flex" }}>
          <ChatSidebar />
          <ChatWindow />
        </Card>
      </Container>
    </Page>
  );
}
