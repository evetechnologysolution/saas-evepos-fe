import * as Yup from 'yup';

const Schema = Yup.object().shape({
  password: Yup.string().min(6, 'Password minimal 6 karakter').required('Password wajib diisi').default(''),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Password tidak cocok')
    .required('Konfirmasi password wajib diisi')
    .default(''),
});

export default Schema;
