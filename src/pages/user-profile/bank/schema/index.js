import * as Yup from 'yup';

const dataSchema = Yup.object({
  // outletRef: Yup.array()
  //   .transform((value, originalValue) => {
  //     if (originalValue === '' || originalValue === null) {
  //       return [];
  //     }
  //     return value;
  //   })
  //   .of(Yup.string())
  //   .min(1, 'Outlet wajib diisi')
  //   .default([]),
  bankName: Yup.string().required('Bank wajib diisi').default(''),
  accountNumber: Yup.string()
    .matches(/^\d+$/, 'Hanya boleh berisi angka')
    .required('No. Rekening wajib diisi')
    .default(''),
  accountHolderName: Yup.string().required('Pemegang Rekening wajib diisi').default(''),
  imageAccountUrl: Yup.string().default(''),
  imageHolderUrl: Yup.string().default(''),
  isActive: Yup.bool().default(true),
});

export default dataSchema;
