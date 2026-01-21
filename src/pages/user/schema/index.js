import * as Yup from 'yup';

const userSchema = Yup.object({
  username: Yup.string().required('Username wajib diisi').min(3, 'Username minimal 3 karakter'),
  fullname: Yup.string().required('Nama wajib diisi').min(3, 'Nama minimal 3 karakter'),
  phone: Yup.string()
    .transform((val) => (val === '' ? null : val))
    .nullable()
    .optional()
    .matches(/^\d+$/, 'Nomor hanya boleh berisi angka')
    .min(10, 'Minimal 10 digit')
    .max(15, 'Maksimal 15 digit'),
  email: Yup.string().email('Format email tidak valid').nullable().optional(),
  password: Yup.string().required('Password wajib diisi').min(6, 'Password minimal 6 karakter'),
  role: Yup.string().required('Role wajib diisi').oneOf(['Admin', 'Staff', 'Kasir'], 'Role tidak valid'),
});

export default userSchema;
