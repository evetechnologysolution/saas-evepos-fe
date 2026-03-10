import * as Yup from 'yup';

const schema = Yup.object().shape({
  id: Yup.string().default(''),
  name: Yup.string().required('Name is required').default(''),
  listNumber: Yup.string().required('List Number is required').default(''),
  selectedList: Yup.array().of(Yup.string()).default([]),
});

export default schema;
