import { useEffect, useState, useContext } from "react";
import { ReactSortable } from "react-sortablejs";
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// @mui
import { Container, Box, Button, Stack, Card, Typography, Tooltip, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import Label from '../../../components/Label';
// utils
import { handleMutationFeedback } from '../../../utils/mutationfeedback';
// contexts
import { mainContext } from '../../../contexts/MainContext';
import defaultMenu from '../../../assets/default_image_product.webp';
import useProduct from './service/useProduct';
import './Sorting.scss';

// ----------------------------------------------------------------------

export default function LibraryProductSorting() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { themeStretch } = useSettings();
  const ctm = useContext(mainContext);

  const { updateSorting } = useProduct();

  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts(ctm.product);
  }, [ctm.product]);

  // drag hanya update state
  const handleChange = (newList) => {
    setProducts(newList);
  };

  // klik simpan → kirim ke backend
  const handleSave = async () => {
    try {
      const listItem = products.map((item, index) => ({
        _id: item._id,
        listNumber: index + 1,
      }));

      const payload = {
        items: listItem
      };

      console.log(payload);

      const mutation = updateSorting.mutateAsync(payload);

      await handleMutationFeedback(mutation, {
        successMsg: 'Urutan berhasil disimpan',
        errorMsg: 'Urutan gagal disimpan',
        // onSuccess: () => navigate('/dashboard/library/product'),
        enqueueSnackbar,
      });
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <Page title="Product: Sorting">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="Sorting Product"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Library', href: PATH_DASHBOARD.library.root },
            { name: 'Product', href: PATH_DASHBOARD.library.product },
            { name: 'Sorting' },
          ]}
        />
        <Card sx={{ p: 3 }}>
          {/* ACTION BUTTON */}
          <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }} gap={1}>
            <Button variant="outlined" onClick={() => navigate(PATH_DASHBOARD.library.product)}>
              Cancel
            </Button>
            <Button
              onClick={() => setProducts(ctm.product)}
              variant="contained"
              color="warning"
            >
              Reset
            </Button>
            <LoadingButton
              variant="contained"
              onClick={handleSave}
              loading={updateSorting.isLoading}
            >
              Update Sorting
            </LoadingButton>
          </Stack>

          <Alert severity="warning" sx={{ mb: 2 }}>
            <b>{'Drag & Drop'}</b> untuk geser urutan, kemudian klik tombol <b>update.</b>
          </Alert>

          {/* CONTENT */}
          <div>
            {/* GRID SORTABLE */}
            <ReactSortable
              list={products}
              setList={handleChange}
              animation={200}
              swap
              style={{
                display: "grid",
                gap: "24px",
              }}
              className="sortable-grid"
            >
              {products.map((item, n) => (
                <Card
                  key={item._id}
                  sx={{
                    textAlign: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                    boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
                    // width: 100
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <Label
                      variant="filled"
                      color="warning"
                      sx={{
                        top: 15,
                        right: 0,
                        zIndex: 9,
                        borderRadius: '20px 0px 0px 20px',
                        height: 30,
                        padding: 2,
                        position: 'absolute',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                        opacity: '1',
                      }}
                    >
                      {n + 1}
                    </Label>
                    <Box
                      component="span"
                      sx={{
                        width: 1,
                        lineHeight: 0,
                        display: 'block',
                        overflow: 'hidden',
                        position: 'relative',
                        pt: 'calc(100% / 4 * 3)',
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          lineHeight: 0,
                          position: 'absolute',
                          backgroundSize: 'cover !important',
                        }}
                      >
                        <img
                          src={item?.image || defaultMenu}
                          alt={item?.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </Box>
                    </Box>
                  </Box>
                  <Tooltip title={item?.name} arrow>
                    <Typography
                      variant="subtitle2"
                      noWrap
                      sx={{ my: 1, px: 2 }}
                    >
                      {item?.name}
                    </Typography>
                  </Tooltip>
                </Card>
              ))}
            </ReactSortable>
          </div>
        </Card>
      </Container>
    </Page>
  );
}
