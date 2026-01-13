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
import axiosInstance from "src/utils/axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

// ----------------------------------------------------------------------

export default function EditBlog() {
  const { themeStretch } = useSettings();
  const [data, setData] = useState({});
  const param = useParams();

  useEffect(() => {
    async function getGalleryById() {
      try {
        const res = await axiosInstance.get(`/blog/${param.id}`);
        setData(res.data);
      } catch (error) {
        setData({});
      }
    }
    getGalleryById();
  }, [param.id]);

  return (
    <Page title="Edit Post">
      <Container maxWidth={themeStretch ? false : "xl"}>
        <HeaderBreadcrumbs
          heading="Edit Post"
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            { name: "Content", href: PATH_DASHBOARD.content.root },
            { name: "Blog", href: PATH_DASHBOARD.content.blog },
            { name: "Edit" },
          ]}
        />
        <BlogForm isEdit currentData={data} />
      </Container>
    </Page>
  );
}
