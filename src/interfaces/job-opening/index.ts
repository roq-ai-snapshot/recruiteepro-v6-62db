import { JobApplicationInterface } from 'interfaces/job-application';
import { WorkflowInterface } from 'interfaces/workflow';
import { BusinessOrganizationInterface } from 'interfaces/business-organization';

export interface JobOpeningInterface {
  id?: string;
  title: string;
  description: string;
  business_organization_id: string;
  job_application?: JobApplicationInterface[];
  workflow?: WorkflowInterface[];
  business_organization?: BusinessOrganizationInterface;
  _count?: {
    job_application?: number;
    workflow?: number;
  };
}
