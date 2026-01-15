import * as Yup from 'yup';

const Schema = Yup.object().shape({
  hasOnlineBusiness: Yup.boolean().required(),

  productType: Yup.string()
    .nullable()
    .when('hasOnlineBusiness', {
      is: true,
      then: (schema) => schema.required('Please specify the product type'),
      otherwise: (schema) => schema.notRequired(),
    }),

  needs: Yup.array().of(Yup.string()).min(1, 'Select at least one option').required().default([]),

  usedOtherAppBefore: Yup.boolean().required(),

  otherAppName: Yup.string()
    .nullable()
    .when('usedOtherAppBefore', {
      is: true,
      then: (schema) => schema.required('Please specify the previous app').max(100),
      otherwise: (schema) => schema.notRequired(),
    }),

  sourceInfo: Yup.string().oneOf(['google', 'referral', 'other']).required('Please choose where you heard about us'),
});

export default Schema;
