import * as Yup from 'yup';

const dataSchema = Yup.object({
  tenantId: Yup.string().default(''),
  ownerName: Yup.string().required('Nama Pemilik wajib diisi').min(3, 'Minimal 3 karakter').default(''),
  businessName: Yup.string().required('Nama Bisnis wajib diisi').min(3, 'Minimal 3 karakter').default(''),
  businessType: Yup.string()
    .transform((val) => (val === '' ? null : val))
    .nullable()
    .optional()
    .default(''),
  legalStatus: Yup.string().required('Bentuk Usaha wajib diisi').default(''),
  operatingSince: Yup.string()
    .transform((val) => (val === '' ? null : val))
    .nullable()
    .optional()
    .default(''),
  image: Yup.string().default(''),
  description: Yup.string()
    .transform((val) => (val === '' ? null : val))
    .nullable()
    .optional()
    .default(''),
  website: Yup.string()
    .transform((val) => (val === '' ? null : val))
    .nullable()
    .optional()
    .default(''),
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
  socialMedia: Yup.array()
    .of(
      Yup.object({
        platform: Yup.string().required('Platform wajib diisi').default(''),
        account: Yup.string().required('Akun wajib diisi').default(''),
      })
    )
    .default([]),
});

export default dataSchema;
