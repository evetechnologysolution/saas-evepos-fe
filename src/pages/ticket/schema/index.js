import * as Yup from 'yup';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

export const ticketSchema = Yup.object().shape({
  title: Yup.string().required('Title wajib diisi').max(200, 'Title maksimal 200 karakter'),
  body: Yup.string().required('Deskripsi wajib diisi').max(2000, 'Deskripsi terlalu panjang'),
  status: Yup.string().default('open'),
  attachment: Yup.mixed()
    .nullable()
    .test('fileSize', 'Ukuran file maksimal 5MB', (value) => {
      if (!value) return true;
      return value.size <= MAX_FILE_SIZE;
    })
    .test('fileType', 'Format file tidak didukung', (value) => {
      if (!value) return true;
      return SUPPORTED_FORMATS.includes(value.type);
    }),
});
