import { IntegrationInterface } from 'interfaces/integration';
import { JobOpeningInterface } from 'interfaces/job-opening';
import { WorkflowInterface } from 'interfaces/workflow';
import { UserInterface } from 'interfaces/user';

export interface BusinessOrganizationInterface {
  id?: string;
  name: string;
  user_id: string;
  integration?: IntegrationInterface[];
  job_opening?: JobOpeningInterface[];
  workflow?: WorkflowInterface[];
  user?: UserInterface;
  _count?: {
    integration?: number;
    job_opening?: number;
    workflow?: number;
  };
}
