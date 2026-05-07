import * as Yup from 'yup';

const schema = Yup.object().shape({
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
  name: Yup.string().required('Name is required').default(''),
  listNumber: Yup.string().required('List Number is required').default(''),
  selectedList: Yup.array().of(Yup.string()).default([]),
});

export default schema;
