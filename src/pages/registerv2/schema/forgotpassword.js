import * as Yup from 'yup';

const Schema = Yup.object().shape({
  email: Yup.string().email('Format email tidak valid').required('Email wajib diisi').default(''),
});

export default Schema;
