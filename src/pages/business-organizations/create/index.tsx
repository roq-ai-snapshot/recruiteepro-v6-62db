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
import { createBusinessOrganization } from 'apiSdk/business-organizations';
import { Error } from 'components/error';
import { businessOrganizationValidationSchema } from 'validationSchema/business-organizations';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { getJobOpenings } from 'apiSdk/job-openings';
import { JobOpeningInterface } from 'interfaces/job-opening';
import { getUsers } from 'apiSdk/users';
import { BusinessOrganizationInterface } from 'interfaces/business-organization';

function BusinessOrganizationCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: BusinessOrganizationInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createBusinessOrganization(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<BusinessOrganizationInterface>({
    initialValues: {
      name: '',
      user_id: (router.query.user_id as string) ?? null,
      integration: [],
      job_opening: [],
      workflow: [],
    },
    validationSchema: businessOrganizationValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Business Organization
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="name" mb="4" isInvalid={!!formik.errors?.name}>
            <FormLabel>Name</FormLabel>
            <Input type="text" name="name" value={formik.values?.name} onChange={formik.handleChange} />
            {formik.errors.name && <FormErrorMessage>{formik.errors?.name}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
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
  entity: 'business_organization',
  operation: AccessOperationEnum.CREATE,
})(BusinessOrganizationCreatePage);
