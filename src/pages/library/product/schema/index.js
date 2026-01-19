import * as Yup from 'yup';

const ProductSchema = Yup.object({
  name: Yup.string().required('Name wajib diisi'),
  price: Yup.number().min(0, 'Price tidak boleh negatif').required('Price wajib diisi'),
  productionPrice: Yup.number().min(0).default(0),
  productionNotes: Yup.string().nullable().default(''),
  description: Yup.string().nullable().default(''),

  category: Yup.string().nullable(),
  subcategory: Yup.string().nullable(),

  unit: Yup.string().required('Unit wajib diisi'),

  isAvailable: Yup.boolean().required(),
  extraNotes: Yup.boolean().required(),
  listNumber: Yup.number().min(0).required(),
  isRecommended: Yup.boolean().required(),

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
    }),

  variant: Yup.array()
    .of(
      Yup.object({
        variantRef: Yup.string().nullable(),
        ismandatory: Yup.boolean().required(),
        isMultiple: Yup.boolean().required(),
      })
    )
    .default([]),
});

export default ProductSchema;
