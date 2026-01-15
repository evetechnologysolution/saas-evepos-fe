import * as Yup from 'yup';

const Schema = Yup.object().shape({
  email: Yup.string().email('Format email tidak valid').required('Email wajib diisi').default(''),

  whatsapp: Yup.string()
    .matches(/^[0-9]+$/, 'WhatsApp hanya boleh berisi angka')
    .min(10, 'Nomor terlalu pendek')
    .max(15, 'Nomor terlalu panjang')
    .required('WhatsApp wajib diisi')
    .default(''),

  password: Yup.string().min(6, 'Password minimal 6 karakter').required('Password wajib diisi').default(''),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Password tidak cocok')
    .required('Konfirmasi password wajib diisi')
    .default(''),

  agree: Yup.boolean().default(false),
});

export default Schema;
