import * as yup from 'yup';

const schema = yup.object().shape({
  outletRef: yup.array()
    .transform((value, originalValue) => {
      if (originalValue === '' || originalValue === null) {
        return [];
      }
      return value;
    })
    .of(yup.string())
    .min(1, 'Outlet wajib diisi')
    .default([]),

  name: yup.string().required('Nama promo wajib diisi'),

  type: yup.number().oneOf([1, 2, 3]).required('Type promo wajib dipilih'),

  amount: yup.number().when('type', {
    is: 1, // discount
    then: (schema) =>
      schema
        .min(1, 'Diskon minimal 1%')
        .max(100, 'Diskon maksimal 100%')
        .required('Amount wajib diisi untuk promo discount'),
    otherwise: (schema) => schema.default(0),
  }),

  qtyMin: yup.number().when('type', {
    is: 3, // bundle
    then: (schema) =>
      schema.min(1, 'Qty minimum harus lebih dari 0').required('Qty minimum wajib diisi untuk promo bundle'),
    otherwise: (schema) => schema.default(0),
  }),

  qtyFree: yup.number().when('type', {
    is: 3, // bundle
    then: (schema) => schema.min(1, 'Qty free harus lebih dari 0').required('Qty free wajib diisi untuk promo bundle'),
    otherwise: (schema) => schema.default(0),
  }),

  validUntil: yup.boolean().required(),

  startDate: yup.date().required('Tanggal mulai wajib diisi'),

  endDate: yup
    .date()
    .nullable()
    .when('validUntil', {
      is: true,
      then: (schema) => schema.required('Tanggal berakhir wajib diisi'),
      otherwise: (schema) => schema.nullable(),
    }),

  selectedDay: yup
    .mixed()
    .test(
      'selected-day',
      'Hari harus antara 0 (Minggu) sampai 6 (Sabtu)',
      (value) => {
        if (value === '' || value === 'all' || value === null) return true;

        const num = Number(value);
        return Number.isInteger(num) && num >= 0 && num <= 6;
      }
    ),

  isAvailable: yup.boolean().required(),

  products: yup.array().of(yup.string().required()).min(1, 'Minimal pilih 1 produk').required('Produk wajib dipilih'),

  conditional: yup.object().shape({
    label: yup
      .string()
      .trim()
      .when('isActive', {
        is: true,
        then: (schema) => schema.required('Label kondisi wajib diisi'),
        otherwise: (schema) => schema.default('').nullable(),
      }),

    notes: yup.string().trim().default('').nullable(),

    isActive: yup.boolean().default(false),
  }),
});

export default schema;
