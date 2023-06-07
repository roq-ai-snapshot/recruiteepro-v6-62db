import * as yup from 'yup';
import { interviewValidationSchema } from 'validationSchema/interviews';

export const jobApplicationValidationSchema = yup.object().shape({
  resume: yup.string().required(),
  application_status: yup.string().required(),
  job_opening_id: yup.string().nullable().required(),
  applicant_id: yup.string().nullable().required(),
  interview: yup.array().of(interviewValidationSchema),
});
