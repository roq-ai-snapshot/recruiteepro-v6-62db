import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useRouter } from 'next/router';
import { createWorkflow } from 'apiSdk/workflows';
import { Error } from 'components/error';
import { workflowValidationSchema } from 'validationSchema/workflows';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { BusinessOrganizationInterface } from 'interfaces/business-organization';
import { JobOpeningInterface } from 'interfaces/job-opening';
import { getBusinessOrganizations } from 'apiSdk/business-organizations';
import { getJobOpenings } from 'apiSdk/job-openings';
import { WorkflowInterface } from 'interfaces/workflow';

function WorkflowCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: WorkflowInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createWorkflow(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<WorkflowInterface>({
    initialValues: {
      steps: '',
      business_organization_id: (router.query.business_organization_id as string) ?? null,
      job_opening_id: (router.query.job_opening_id as string) ?? null,
    },
    validationSchema: workflowValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Workflow
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="steps" mb="4" isInvalid={!!formik.errors?.steps}>
            <FormLabel>Steps</FormLabel>
            <Input type="text" name="steps" value={formik.values?.steps} onChange={formik.handleChange} />
            {formik.errors.steps && <FormErrorMessage>{formik.errors?.steps}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<BusinessOrganizationInterface>
            formik={formik}
            name={'business_organization_id'}
            label={'Select Business Organization'}
            placeholder={'Select Business Organization'}
            fetcher={getBusinessOrganizations}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <AsyncSelect<JobOpeningInterface>
            formik={formik}
            name={'job_opening_id'}
            label={'Select Job Opening'}
            placeholder={'Select Job Opening'}
            fetcher={getJobOpenings}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.title}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'workflow',
  operation: AccessOperationEnum.CREATE,
})(WorkflowCreatePage);
