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
import { createJobApplication } from 'apiSdk/job-applications';
import { Error } from 'components/error';
import { jobApplicationValidationSchema } from 'validationSchema/job-applications';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { JobOpeningInterface } from 'interfaces/job-opening';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';
import { getJobOpenings } from 'apiSdk/job-openings';
import { JobApplicationInterface } from 'interfaces/job-application';

function JobApplicationCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: JobApplicationInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createJobApplication(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<JobApplicationInterface>({
    initialValues: {
      resume: '',
      application_status: '',
      job_opening_id: (router.query.job_opening_id as string) ?? null,
      applicant_id: (router.query.applicant_id as string) ?? null,
      interview: [],
    },
    validationSchema: jobApplicationValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Job Application
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="resume" mb="4" isInvalid={!!formik.errors?.resume}>
            <FormLabel>Resume</FormLabel>
            <Input type="text" name="resume" value={formik.values?.resume} onChange={formik.handleChange} />
            {formik.errors.resume && <FormErrorMessage>{formik.errors?.resume}</FormErrorMessage>}
          </FormControl>
          <FormControl id="application_status" mb="4" isInvalid={!!formik.errors?.application_status}>
            <FormLabel>Application Status</FormLabel>
            <Input
              type="text"
              name="application_status"
              value={formik.values?.application_status}
              onChange={formik.handleChange}
            />
            {formik.errors.application_status && (
              <FormErrorMessage>{formik.errors?.application_status}</FormErrorMessage>
            )}
          </FormControl>
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
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'applicant_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
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
  entity: 'job_application',
  operation: AccessOperationEnum.CREATE,
})(JobApplicationCreatePage);
