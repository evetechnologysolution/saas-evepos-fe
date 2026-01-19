/* eslint-disable no-restricted-globals */
import * as Yup from 'yup';

const VariantSchema = Yup.object({
  name: Yup.string().required('Nama wajib diisi'),
  options: Yup.array()
    .of(
      Yup.object({
        name: Yup.string().required('Nama opsi wajib diisi'),
        price: Yup.number()
          .transform((value, originalValue) => {
            if (typeof originalValue === 'string') {
              const clean = originalValue.replace(/,/g, '');
              const parsed = parseFloat(clean);
              return isNaN(parsed) ? undefined : parsed;
            }
            return value;
          })
          .min(0, 'Harga tidak boleh negatif')
          .required('Harga wajib diisi'),
        productionPrice: Yup.number()
          .transform((value, originalValue) => {
            if (typeof originalValue === 'string') {
              const clean = originalValue.replace(/,/g, '');
              const parsed = parseFloat(clean);
              return isNaN(parsed) ? undefined : parsed;
            }
            return value;
          })
          .min(0, 'Production price tidak boleh negatif')
          .required('Production price wajib diisi'),
        productionNotes: Yup.string().nullable(),
        isMultiple: Yup.boolean().default(false),
      })
    )
    .min(1, 'Minimal terdapat 1 opsi')
    .required('Options wajib diisi'),
});

export default VariantSchema;
