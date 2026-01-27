import { memo } from 'react';
import PropTypes from 'prop-types';
// @mui
import { Grid } from '@mui/material';
// section
import ProductCard from '../ProductCard';
// default picture
import defaultMenu from '../../../../assets/default_image_product.webp';

Products.propTypes = {
  items: PropTypes.array,
};

function Products({ items }) {
  const showImage = (image) => {
    if (!image) {
      return defaultMenu;
    }
    return image;
  };

  return (
    <Grid container spacing={3} sx={{ padding: '1rem' }}>
      {items?.map((item, i) => (
        <Grid item xs={6} sm={3} lg={3} key={i}>
          <ProductCard
            key={i}
            id={item._id}
            name={item?.name}
            image={showImage(item.image)}
            price={item.price}
            productionPrice={item?.productionPrice || 0}
            discount={item?.discount || {}}
            category={item?.category?.name}
            unit={item?.unit || 'pcs'}
            variant={item?.variant || []}
            notes={item.extraNotes}
            amountKg={item?.amountKg || 0}
            isLaundryBag={item.isLaundryBag}
            isAvailable={item.isAvailable}
          />
        </Grid>
      ))}
    </Grid>
  );
}

export default memo(Products);
