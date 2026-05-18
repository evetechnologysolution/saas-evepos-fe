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
  cashBalance: Yup.bool().default(false),
  themeSetting: Yup.bool().default(false),
});

export default ProductSchema;
