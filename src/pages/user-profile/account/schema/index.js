import * as Yup from 'yup';

const dataSchema = Yup.object({
  username: Yup.string().required('Username wajib diisi').min(3, 'Username minimal 3 karakter').default(''),
  fullname: Yup.string().required('Nama wajib diisi').min(3, 'Nama minimal 3 karakter').default(''),
  phone: Yup.string()
    .required('Phone wajib diisi')
    .matches(/^\d+$/, 'Hanya boleh berisi angka')
    .min(10, 'Minimal 10 digit')
    .max(15, 'Maksimal 15 digit')
    .default(''),
  phone2: Yup.string()
    .transform((val) => (val === '' ? null : val))
    .nullable()
    .optional()
    .matches(/^\d+$/, 'Hanya boleh berisi angka')
    .min(10, 'Minimal 10 digit')
    .max(15, 'Maksimal 15 digit')
    .default(''),
  phone3: Yup.string()
    .transform((val) => (val === '' ? null : val))
    .nullable()
    .optional()
    .matches(/^\d+$/, 'Hanya boleh berisi angka')
    .min(10, 'Minimal 10 digit')
    .max(15, 'Maksimal 15 digit')
    .default(''),
  email: Yup.string().email('Format email tidak valid').nullable().optional().default(''),
  ktp: Yup.object({
    number: Yup.string()
      .transform((val) => (val === '' ? null : val))
      .nullable()
      .optional()
      .matches(/^\d+$/, 'Hanya boleh angka')
      .length(16, 'Harus 16 digit'),
  }).default({
    number: '',
  }),
  imageKtp: Yup.string().default(''),
  npwp: Yup.object({
    number: Yup.string()
      .transform((val) => (val === '' ? null : val))
      .nullable()
      .optional()
      .matches(/^\d+$/, 'Hanya boleh angka')
      .min(15, 'Min. 15 digit')
      .max(16, 'Max. 16 digit'),
  }).default({
    number: '',
  }),
  imageNpwp: Yup.string().default(''),
  oldPassword: Yup.string()
    .transform((val) => (val === '' ? null : val))
    .nullable()
    .optional()
    .min(6, 'Password minimal 6 karakter')
    .default(''),
  newPassword: Yup.string()
    .transform((val) => (val === '' ? null : val))
    .nullable()
    .optional()
    .min(6, 'Password minimal 6 karakter')
    .default(''),
  confirmPassword: Yup.string()
    .transform((val) => (val === '' ? null : val))
    .nullable()
    .when('newPassword', {
      is: (val) => !!val,
      then: (schema) =>
        schema
          .required('Konfirmasi password wajib diisi')
          .oneOf([Yup.ref('newPassword')], 'Konfirmasi password tidak sama'),
    })
    .min(6, 'Password minimal 6 karakter')
    .default(''),
  address: Yup.string()
    .transform((val) => (val === '' ? null : val))
    .nullable()
    .optional()
    .default(''),
  province: Yup.string()
    .transform((val) => (val === '' ? null : val))
    .nullable()
    .optional()
    .default(''),
  city: Yup.string()
    .transform((val) => (val === '' ? null : val))
    .nullable()
    .optional()
    .default(''),
  district: Yup.string()
    .transform((val) => (val === '' ? null : val))
    .nullable()
    .optional()
    .default(''),
  subdistrict: Yup.string()
    .transform((val) => (val === '' ? null : val))
    .nullable()
    .optional()
    .default(''),
  zipCode: Yup.string()
    .transform((val) => (val === '' ? null : val))
    .nullable()
    .optional()
    .matches(/^\d+$/, 'Hanya boleh berisi angka')
    .min(4, 'Minimal 4 digit')
    .max(5, 'Maksimal 5 digit')
    .default(''),
  role: Yup.string().default(''),
});

export default dataSchema;
