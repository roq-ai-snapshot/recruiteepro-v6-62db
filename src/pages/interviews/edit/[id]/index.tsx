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
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useFormik, FormikHelpers } from 'formik';
import { getInterviewById, updateInterviewById } from 'apiSdk/interviews';
import { Error } from 'components/error';
import { interviewValidationSchema } from 'validationSchema/interviews';
import { InterviewInterface } from 'interfaces/interview';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { JobApplicationInterface } from 'interfaces/job-application';
import { UserInterface } from 'interfaces/user';
import { getJobApplications } from 'apiSdk/job-applications';
import { getUsers } from 'apiSdk/users';

function InterviewEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<InterviewInterface>(
    () => (id ? `/interviews/${id}` : null),
    () => getInterviewById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: InterviewInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateInterviewById(id, values);
      mutate(updated);
      resetForm();
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<InterviewInterface>({
    initialValues: data,
    validationSchema: interviewValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Edit Interview
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {formError && <Error error={formError} />}
        {isLoading || (!formik.values && !error) ? (
          <Spinner />
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="scheduled_date" mb="4">
              <FormLabel>Scheduled Date</FormLabel>
              <DatePicker
                dateFormat={'dd/MM/yyyy'}
                selected={formik.values?.scheduled_date}
                onChange={(value: Date) => formik.setFieldValue('scheduled_date', value)}
              />
            </FormControl>
            <FormControl id="feedback" mb="4" isInvalid={!!formik.errors?.feedback}>
              <FormLabel>Feedback</FormLabel>
              <Input type="text" name="feedback" value={formik.values?.feedback} onChange={formik.handleChange} />
              {formik.errors.feedback && <FormErrorMessage>{formik.errors?.feedback}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<JobApplicationInterface>
              formik={formik}
              name={'job_application_id'}
              label={'Select Job Application'}
              placeholder={'Select Job Application'}
              fetcher={getJobApplications}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.job_opening_id}
                </option>
              )}
            />
            <AsyncSelect<UserInterface>
              formik={formik}
              name={'interviewer_id'}
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
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'interview',
  operation: AccessOperationEnum.UPDATE,
})(InterviewEditPage);
