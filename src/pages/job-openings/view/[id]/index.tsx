import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import React, { useState } from 'react';
import { Text, Box, Spinner, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button, Link } from '@chakra-ui/react';
import { UserSelect } from 'components/user-select';
import { getJobOpeningById } from 'apiSdk/job-openings';
import { Error } from 'components/error';
import { JobOpeningInterface } from 'interfaces/job-opening';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';
import { deleteJobApplicationById } from 'apiSdk/job-applications';
import { deleteWorkflowById } from 'apiSdk/workflows';

function JobOpeningViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<JobOpeningInterface>(
    () => (id ? `/job-openings/${id}` : null),
    () =>
      getJobOpeningById(id, {
        relations: ['business_organization', 'job_application', 'workflow'],
      }),
  );

  const job_applicationHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteJobApplicationById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const workflowHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteWorkflowById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Job Opening Detail View
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Text fontSize="lg" fontWeight="bold" as="span">
              Title:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.title}
            </Text>
            <br />
            <Text fontSize="lg" fontWeight="bold" as="span">
              Description:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.description}
            </Text>
            <br />
            {hasAccess('business_organization', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Business Organization:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  <Link as={NextLink} href={`/business-organizations/view/${data?.business_organization?.id}`}>
                    {data?.business_organization?.name}
                  </Link>
                </Text>
              </>
            )}
            {hasAccess('job_application', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold">
                  Job Applications:
                </Text>
                <NextLink passHref href={`/job-applications/create?job_opening_id=${data?.id}`}>
                  <Button colorScheme="blue" mr="4" as="a">
                    Create
                  </Button>
                </NextLink>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>resume</Th>
                        <Th>application_status</Th>
                        <Th>Edit</Th>
                        <Th>View</Th>
                        <Th>Delete</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.job_application?.map((record) => (
                        <Tr key={record.id}>
                          <Td>{record.resume}</Td>
                          <Td>{record.application_status}</Td>
                          <Td>
                            <NextLink passHref href={`/job-applications/edit/${record.id}`}>
                              <Button as="a">Edit</Button>
                            </NextLink>
                          </Td>
                          <Td>
                            <NextLink passHref href={`/job-applications/view/${record.id}`}>
                              <Button as="a">View</Button>
                            </NextLink>
                          </Td>
                          <Td>
                            <Button onClick={() => job_applicationHandleDelete(record.id)}>Delete</Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </>
            )}

            {hasAccess('workflow', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold">
                  Workflows:
                </Text>
                <NextLink passHref href={`/workflows/create?job_opening_id=${data?.id}`}>
                  <Button colorScheme="blue" mr="4" as="a">
                    Create
                  </Button>
                </NextLink>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>steps</Th>
                        <Th>Edit</Th>
                        <Th>View</Th>
                        <Th>Delete</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.workflow?.map((record) => (
                        <Tr key={record.id}>
                          <Td>{record.steps}</Td>
                          <Td>
                            <NextLink passHref href={`/workflows/edit/${record.id}`}>
                              <Button as="a">Edit</Button>
                            </NextLink>
                          </Td>
                          <Td>
                            <NextLink passHref href={`/workflows/view/${record.id}`}>
                              <Button as="a">View</Button>
                            </NextLink>
                          </Td>
                          <Td>
                            <Button onClick={() => workflowHandleDelete(record.id)}>Delete</Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </>
            )}
          </>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'job_opening',
  operation: AccessOperationEnum.READ,
})(JobOpeningViewPage);
