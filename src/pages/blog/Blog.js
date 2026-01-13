// @mui
import { Container } from "@mui/material";
// routes
import { PATH_DASHBOARD } from "src/routes/paths";
// hooks
import useSettings from "src/hooks/useSettings";
// components
import Page from "src/components/Page";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
// sections
import BlogForm from "src/sections/@dashboard/library/blog/BlogForm";

// ----------------------------------------------------------------------

export default function BlogCreate() {
  const { themeStretch } = useSettings();

  return (
    <Page title="Create new post">
      <Container maxWidth={themeStretch ? false : "xl"}>
        <HeaderBreadcrumbs
          heading="New Post"
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            { name: "Content", href: PATH_DASHBOARD.content.root },
            { name: "Blog", href: PATH_DASHBOARD.content.blog },
            { name: "New" },
          ]}
        />
        <BlogForm />
      </Container>
    </Page>
  );
}
