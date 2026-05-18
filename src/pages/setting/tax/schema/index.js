import * as Yup from 'yup';

const ProductSchema = Yup.object({
  outletRef: Yup.array()
    .transform((value, originalValue) => {
      if (originalValue === '' || originalValue === null) {
        return [];
      }
      return value;
    })
    .of(Yup.string())
    .min(1, 'Outlet wajib diisi')
    .default([]),
  tax: Yup.object({
    isActive: Yup.bool().default(false),
    percentage: Yup.number()
      .min(0)
      .default(0),
    orderType: Yup.array()
      .of(Yup.string())
      .default([]),
  }).default(undefined),
  serviceCharge: Yup.object({
    isActive: Yup.bool().default(false),
    percentage: Yup.number()
      .min(0)
      .default(0),
    orderType: Yup.array()
      .of(Yup.string())
      .default([]),
  }).default(undefined),
});

export default ProductSchema;
