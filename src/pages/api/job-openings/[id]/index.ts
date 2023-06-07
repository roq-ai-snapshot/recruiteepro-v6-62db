import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { jobOpeningValidationSchema } from 'validationSchema/job-openings';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.job_opening
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getJobOpeningById();
    case 'PUT':
      return updateJobOpeningById();
    case 'DELETE':
      return deleteJobOpeningById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getJobOpeningById() {
    const data = await prisma.job_opening.findFirst(convertQueryToPrismaUtil(req.query, 'job_opening'));
    return res.status(200).json(data);
  }

  async function updateJobOpeningById() {
    await jobOpeningValidationSchema.validate(req.body);
    const data = await prisma.job_opening.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteJobOpeningById() {
    const data = await prisma.job_opening.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
