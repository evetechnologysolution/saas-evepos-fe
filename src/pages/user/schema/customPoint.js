import * as Yup from 'yup';

const userSchema = Yup.object({
  info: Yup.string().default(''),

  customPoint: Yup.array()
    .of(
      Yup.object({
        productRef: Yup.string().nullable().default(null),

        progressLabelRef: Yup.string().nullable().default(null),

        productName: Yup.string()
          .nullable()
          .default("")
          .trim(),

        progressName: Yup.string()
          .nullable()
          .default("")
          .trim(),

        point: Yup.number()
          .typeError("Point harus angka")
          .required("Point wajib diisi")
          .min(0, "Point tidak boleh negatif")
          .default(0),
      })
    )
    .default([]),
});

export default userSchema;