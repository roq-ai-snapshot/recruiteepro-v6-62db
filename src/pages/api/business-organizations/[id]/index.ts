import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { businessOrganizationValidationSchema } from 'validationSchema/business-organizations';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.business_organization
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getBusinessOrganizationById();
    case 'PUT':
      return updateBusinessOrganizationById();
    case 'DELETE':
      return deleteBusinessOrganizationById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getBusinessOrganizationById() {
    const data = await prisma.business_organization.findFirst(
      convertQueryToPrismaUtil(req.query, 'business_organization'),
    );
    return res.status(200).json(data);
  }

  async function updateBusinessOrganizationById() {
    await businessOrganizationValidationSchema.validate(req.body);
    const data = await prisma.business_organization.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteBusinessOrganizationById() {
    const data = await prisma.business_organization.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
