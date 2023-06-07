import * as yup from 'yup';
import { jobApplicationValidationSchema } from 'validationSchema/job-applications';
import { workflowValidationSchema } from 'validationSchema/workflows';

export const jobOpeningValidationSchema = yup.object().shape({
  title: yup.string().required(),
  description: yup.string().required(),
  business_organization_id: yup.string().nullable().required(),
  job_application: yup.array().of(jobApplicationValidationSchema),
  workflow: yup.array().of(workflowValidationSchema),
});
