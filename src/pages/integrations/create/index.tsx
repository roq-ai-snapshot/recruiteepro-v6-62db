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
import { createIntegration } from 'apiSdk/integrations';
import { Error } from 'components/error';
import { integrationValidationSchema } from 'validationSchema/integrations';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { BusinessOrganizationInterface } from 'interfaces/business-organization';
import { getBusinessOrganizations } from 'apiSdk/business-organizations';
import { IntegrationInterface } from 'interfaces/integration';

function IntegrationCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: IntegrationInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createIntegration(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<IntegrationInterface>({
    initialValues: {
      integration_type: '',
      configuration: '',
      business_organization_id: (router.query.business_organization_id as string) ?? null,
    },
    validationSchema: integrationValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Integration
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="integration_type" mb="4" isInvalid={!!formik.errors?.integration_type}>
            <FormLabel>Integration Type</FormLabel>
            <Input
              type="text"
              name="integration_type"
              value={formik.values?.integration_type}
              onChange={formik.handleChange}
            />
            {formik.errors.integration_type && <FormErrorMessage>{formik.errors?.integration_type}</FormErrorMessage>}
          </FormControl>
          <FormControl id="configuration" mb="4" isInvalid={!!formik.errors?.configuration}>
            <FormLabel>Configuration</FormLabel>
            <Input
              type="text"
              name="configuration"
              value={formik.values?.configuration}
              onChange={formik.handleChange}
            />
            {formik.errors.configuration && <FormErrorMessage>{formik.errors?.configuration}</FormErrorMessage>}
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
  entity: 'integration',
  operation: AccessOperationEnum.CREATE,
})(IntegrationCreatePage);
