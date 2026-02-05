import * as Yup from 'yup';

const Schema = Yup.object().shape({
  ownerName: Yup.string().required(),
  businessName: Yup.string().required(),
  businessType: Yup.string().required(),
  operatingSince: Yup.string().required(),
  province: Yup.string().required(),
  city: Yup.string().required(),
  district: Yup.string().required(),
});

export default Schema;
