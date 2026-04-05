import * as Yup from 'yup';

const ProductSchema = Yup.object({
  name: Yup.string().required('Name wajib diisi').default(''),
  price: Yup.number().min(0, 'Price tidak boleh negatif').required('Price wajib diisi').default(''),
  productionPrice: Yup.number().min(0).default(0),
  productionNotes: Yup.string().nullable().default(''),
  description: Yup.string().nullable().default(''),

  category: Yup.string().nullable().default(''),
  subcategory: Yup.string().nullable().default(''),

  unit: Yup.string().required('Unit wajib diisi').default(''),

  isAvailable: Yup.boolean().required().default(true),
  extraNotes: Yup.boolean().required().default(false),
  // listNumber: Yup.number().default(0),
  isRecommended: Yup.boolean().required().default(false),

  // file image (opsional)
  image: Yup.mixed()
    .nullable()
    .test('fileType', 'Format file tidak valid', (val) => {
      if (!val) return true; // boleh kosong
      // val bisa string (URL) atau File (form-data)
      if (typeof val === 'string') return true;
      return ['image/jpeg', 'image/png', 'image/webp'].includes(val.type);
    })
    .test('fileSize', 'Ukuran file max 2MB', (val) => {
      if (!val || typeof val === 'string') return true;
      return val.size <= 2 * 1024 * 1024;
    })
    .default(''),

  minimumOrderQty: Yup.number().default(0),
  isHaveMinimumQty: Yup.boolean().default(false),

  variant: Yup.array()
    .of(
      Yup.object({
        variantRef: Yup.string().nullable(),
        ismandatory: Yup.boolean().required(),
        isMultiple: Yup.boolean().required(),
      })
    )
    .default([]),

  masterStatus: Yup.array().of(Yup.string()).default([]),
  // masterStatus: Yup.array()
  //   .of(
  //     Yup.object().shape({
  //       statusRef: Yup.string().nullable()
  //     })
  //   )
  //   .default([])
});

export default ProductSchema;
