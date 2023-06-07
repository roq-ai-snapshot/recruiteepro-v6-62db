import { InterviewInterface } from 'interfaces/interview';
import { JobOpeningInterface } from 'interfaces/job-opening';
import { UserInterface } from 'interfaces/user';

export interface JobApplicationInterface {
  id?: string;
  job_opening_id: string;
  applicant_id: string;
  resume: string;
  application_status: string;
  interview?: InterviewInterface[];
  job_opening?: JobOpeningInterface;
  user?: UserInterface;
  _count?: {
    interview?: number;
  };
}
