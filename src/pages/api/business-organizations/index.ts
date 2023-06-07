import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { businessOrganizationValidationSchema } from 'validationSchema/business-organizations';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getBusinessOrganizations();
    case 'POST':
      return createBusinessOrganization();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getBusinessOrganizations() {
    const data = await prisma.business_organization
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'business_organization'));
    return res.status(200).json(data);
  }

  async function createBusinessOrganization() {
    await businessOrganizationValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.integration?.length > 0) {
      const create_integration = body.integration;
      body.integration = {
        create: create_integration,
      };
    } else {
      delete body.integration;
    }
    if (body?.job_opening?.length > 0) {
      const create_job_opening = body.job_opening;
      body.job_opening = {
        create: create_job_opening,
      };
    } else {
      delete body.job_opening;
    }
    if (body?.workflow?.length > 0) {
      const create_workflow = body.workflow;
      body.workflow = {
        create: create_workflow,
      };
    } else {
      delete body.workflow;
    }
    const data = await prisma.business_organization.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
