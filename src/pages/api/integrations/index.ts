import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { integrationValidationSchema } from 'validationSchema/integrations';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getIntegrations();
    case 'POST':
      return createIntegration();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getIntegrations() {
    const data = await prisma.integration
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'integration'));
    return res.status(200).json(data);
  }

  async function createIntegration() {
    await integrationValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.integration.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
