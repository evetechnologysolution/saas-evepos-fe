import * as Yup from 'yup';

const schema = Yup.object().shape({
  id: Yup.string(),
  name: Yup.string().required('Name is required').default(''),
  // listNumber: Yup.string().required('List Number is required').default(''),\
  basePoint: Yup.number().required('Progress point wajib diisi').min(0, 'Progress point wajib diisi').default(null).nullable(),
});

export default schema;
