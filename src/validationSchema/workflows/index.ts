import * as yup from 'yup';

export const workflowValidationSchema = yup.object().shape({
  steps: yup.string().required(),
  business_organization_id: yup.string().nullable().required(),
  job_opening_id: yup.string().nullable().required(),
});
