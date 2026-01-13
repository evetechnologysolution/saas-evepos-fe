// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from 'src/routes/paths';
// hooks
import useSettings from 'src/hooks/useSettings';
// components
import Page from 'src/components/Page';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
// sections
import { GalleryForm } from 'src/sections/@dashboard/library/gallery';
import { useEffect, useState } from 'react';
import axiosInstance from 'src/utils/axios';
import { useParams } from 'react-router';

// ----------------------------------------------------------------------

export default function GalleryEdit() {
  const { themeStretch } = useSettings();
  const [data, setData] = useState({});
  const param = useParams();

  useEffect(() => {
    async function getGalleryById() {
      try {
        const res = await axiosInstance.get(`/gallery/${param.id}`);
        setData(res.data);
      } catch (error) {
        setData({});
      }
    }
    getGalleryById();
  }, [param.id]);

  return (
    <Page title="Edit Gallery">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="Edit Gallery"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Library', href: PATH_DASHBOARD.library.root },
            { name: 'Product', href: PATH_DASHBOARD.library.product },
            { name: 'New' },
          ]}
        />
        <GalleryForm isEdit currentData={data} />
      </Container>
    </Page>
  );
}
