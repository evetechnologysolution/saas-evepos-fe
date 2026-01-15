import * as Yup from 'yup';

const Schema = Yup.object().shape({
  fullName: Yup.string().required(),
  businessName: Yup.string().required(),
  businessSector: Yup.string().required(),
  yearsInOperation: Yup.string().required(),
  province: Yup.string().required(),
  city: Yup.string().required(),
  district: Yup.string().required(),
});

export default Schema;
