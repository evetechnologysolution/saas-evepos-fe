import React, { useState, useEffect, useContext } from 'react';
// @mui
import { Box, Button, CircularProgress, IconButton, Stack, Typography } from '@mui/material';
// horizontal scroll
import { ScrollMenu } from 'react-horizontal-scrolling-menu';
import 'react-horizontal-scrolling-menu/dist/styles.css';
// sections
import { Products } from '../../sections/@dashboard/cashier/pos';
// components
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import { LeftArrow, RightArrow } from '../../components/SliderButton';
import '../../sections/@dashboard/cashier/pos/HorizontalScroll.scss';
// context
import { mainContext } from '../../contexts/MainContext';

// ----------------------------------------------------------------------

export default function CashierPosProduct() {
  const ctm = useContext(mainContext);

  const rowsPerPage = 52;
  const [page, setPage] = useState(0);

  // select category
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const currProduct = products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  useEffect(() => {
    setProducts(ctm.product);
  }, [ctm.product]);

  const handleClickCategory = (val) => {
    setSelectedCategory(val);
    if (val === 'All') {
      setProducts(ctm.product);
    } else {
      setProducts(ctm.product.filter((data) => data?.category?.name === val));
    }
    setPage(0);
  };

  const getButtonVariant = (val) => {
    if (val === selectedCategory) {
      return 'contained';
    }
    return 'outlined';
  };

  return (
    <>
      <Box sx={{ alignItems: 'center' }}>
        <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow}>
          {[{ _id: 'all', name: 'All' }, ...ctm.category].map((cat, i) => (
            <Button
              key={i}
              color="primary"
              variant={getButtonVariant(cat.name)}
              onClick={() => handleClickCategory(cat.name)}
              sx={{ mr: 1, minHeight: 45, minWidth: 90 }}
            >
              <Typography variant="body2" noWrap>
                {cat.name}
              </Typography>
            </Button>
          ))}
        </ScrollMenu>
        <Stack flexDirection="row" justifyContent="center" alignItems="center">
          <IconButton
            color="primary"
            disabled={page > 0 ? Boolean(false) : Boolean(true)}
            onClick={() => setPage(page - 1)}
          >
            <Iconify
              icon="tabler:chevron-left"
              width={24}
              height={24}
              sx={{ color: page > 0 ? 'inherit' : 'transparent' }}
            />
          </IconButton>
          <Typography variant="body2">
            {products.length > 0 &&
              (products.length > rowsPerPage
                ? `${page * rowsPerPage + 1} - ${currProduct.length - 1 + (page * rowsPerPage + 1)} of ${
                    products.length
                  }`
                : `${page * rowsPerPage + 1} - ${products.length} of ${products.length}`)}
            {products.length === 0 && '0 - 0 of 0'}
          </Typography>
          <IconButton
            color="primary"
            disabled={
              page + 1 === Math.ceil(products.length / rowsPerPage) || products.length <= rowsPerPage
                ? Boolean(true)
                : Boolean(false)
            }
            onClick={() => setPage(page + 1)}
          >
            <Iconify
              icon="tabler:chevron-right"
              width={24}
              height={24}
              sx={{
                color:
                  page + 1 === Math.ceil(products.length / rowsPerPage) || products.length <= rowsPerPage
                    ? 'transparent'
                    : 'inherit',
              }}
            />
          </IconButton>
        </Stack>
      </Box>
      <Scrollbar>
        <Box sx={{ height: '71vh', position: 'relative' }}>
          {ctm.loadingProduct ? (
            <Box display="flex" justifyContent="center" py={6}>
              <CircularProgress />
            </Box>
          ) : currProduct?.length > 0 ? (
            <Products items={currProduct} />
          ) : (
            <Box py={12}>
              <Typography textAlign="center">
                Kamu belum memiliki produk. Mohon refresh jika Anda sudah punya produk.
              </Typography>
            </Box>
          )}
        </Box>
      </Scrollbar>
    </>
  );
}
