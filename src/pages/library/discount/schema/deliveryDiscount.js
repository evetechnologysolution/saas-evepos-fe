import * as Yup from 'yup';

const DeliveryDiscSchema = Yup.object({
  start: Yup.date().required('Start date wajib diisi').default(null).nullable(),
  end: Yup.date().required('End date wajib diisi').default(null).nullable(),
  amount: Yup.number().required('Diskon wajib diisi').min(0, 'Diskon wajib diisi').default(null).nullable(),
});

export default DeliveryDiscSchema;
