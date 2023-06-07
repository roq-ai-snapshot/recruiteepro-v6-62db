import * as yup from 'yup';
import { integrationValidationSchema } from 'validationSchema/integrations';
import { jobOpeningValidationSchema } from 'validationSchema/job-openings';
import { workflowValidationSchema } from 'validationSchema/workflows';

export const businessOrganizationValidationSchema = yup.object().shape({
  name: yup.string().required(),
  user_id: yup.string().nullable().required(),
  integration: yup.array().of(integrationValidationSchema),
  job_opening: yup.array().of(jobOpeningValidationSchema),
  workflow: yup.array().of(workflowValidationSchema),
});
