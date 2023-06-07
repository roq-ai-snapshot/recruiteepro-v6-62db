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
import { getIntegrationById, updateIntegrationById } from 'apiSdk/integrations';
import { Error } from 'components/error';
import { integrationValidationSchema } from 'validationSchema/integrations';
import { IntegrationInterface } from 'interfaces/integration';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { BusinessOrganizationInterface } from 'interfaces/business-organization';
import { getBusinessOrganizations } from 'apiSdk/business-organizations';

function IntegrationEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<IntegrationInterface>(
    () => (id ? `/integrations/${id}` : null),
    () => getIntegrationById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: IntegrationInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateIntegrationById(id, values);
      mutate(updated);
      resetForm();
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<IntegrationInterface>({
    initialValues: data,
    validationSchema: integrationValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Edit Integration
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {formError && <Error error={formError} />}
        {isLoading || (!formik.values && !error) ? (
          <Spinner />
        ) : (
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
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'integration',
  operation: AccessOperationEnum.UPDATE,
})(IntegrationEditPage);
