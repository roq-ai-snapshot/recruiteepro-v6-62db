import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { jobOpeningValidationSchema } from 'validationSchema/job-openings';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getJobOpenings();
    case 'POST':
      return createJobOpening();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getJobOpenings() {
    const data = await prisma.job_opening
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'job_opening'));
    return res.status(200).json(data);
  }

  async function createJobOpening() {
    await jobOpeningValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.job_application?.length > 0) {
      const create_job_application = body.job_application;
      body.job_application = {
        create: create_job_application,
      };
    } else {
      delete body.job_application;
    }
    if (body?.workflow?.length > 0) {
      const create_workflow = body.workflow;
      body.workflow = {
        create: create_workflow,
      };
    } else {
      delete body.workflow;
    }
    const data = await prisma.job_opening.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
