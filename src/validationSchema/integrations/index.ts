import * as yup from 'yup';

export const integrationValidationSchema = yup.object().shape({
  integration_type: yup.string().required(),
  configuration: yup.string().required(),
  business_organization_id: yup.string().nullable().required(),
});
