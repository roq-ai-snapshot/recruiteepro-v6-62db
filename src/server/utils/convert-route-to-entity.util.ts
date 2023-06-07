const mapping: Record<string, string> = {
  'business-organizations': 'business_organization',
  integrations: 'integration',
  interviews: 'interview',
  'job-applications': 'job_application',
  'job-openings': 'job_opening',
  users: 'user',
  workflows: 'workflow',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
