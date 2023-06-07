import { BusinessOrganizationInterface } from 'interfaces/business-organization';

export interface IntegrationInterface {
  id?: string;
  business_organization_id: string;
  integration_type: string;
  configuration: string;

  business_organization?: BusinessOrganizationInterface;
  _count?: {};
}
