import * as Yup from 'yup';

const schema = Yup.object().shape({
  id: Yup.string(),
  name: Yup.string().required('Name is required'),
  listNumber: Yup.string().required('List Number is required'),
  selectedList: Yup.array().of(Yup.string()).default([]),
});

export default schema;
