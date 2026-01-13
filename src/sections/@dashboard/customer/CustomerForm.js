import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useState, useEffect, useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack, Button } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
import {
  FormProvider,
  RHFTextField,
} from '../../../components/hook-form';
// utils
import axios from '../../../utils/axios';

// ----------------------------------------------------------------------

CustomerForm.propTypes = {
  isEdit: PropTypes.bool,
  currentData: PropTypes.object,
};

export default function CustomerForm({ isEdit, currentData }) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);

  const NewDataSchema = Yup.object().shape({
    id: Yup.string(),
    customerId: Yup.string(),
    name: Yup.string().required('Name is required'),
    phone: Yup.string(),
    notes: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      id: currentData?._id || '',
      customerId: currentData?.customerId || '',
      name: currentData?.name || '',
      phone: currentData?.phone || '',
      notes: currentData?.notes || ''
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentData]
  );

  const methods = useForm({
    resolver: yupResolver(NewDataSchema),
    defaultValues,
  });

  const { reset, handleSubmit } = methods;

  useEffect(() => {
    if (isEdit && currentData) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentData]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      if (!isEdit) {
        await axios.post(`/customers`, data);
      } else {
        await axios.patch(`/customers/${currentData._id}`, data);
      }
      reset();
      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      navigate(PATH_DASHBOARD.customer.root);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              {isEdit &&
                <>
                  <RHFTextField name="customerId" label="Customer ID" disabled />
                </>
              }
              <RHFTextField name="name" label="Name" autoComplete="off" />
              <RHFTextField name="phone" label="Phone" autoComplete="off" />
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <RHFTextField name="notes" label="Notes" autoComplete="off" multiline rows={4} />
            </Stack>
          </Grid>
        </Grid>
        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }} gap={1}>
          <Button variant="outlined" onClick={() => navigate(PATH_DASHBOARD.customer.root)}>Back</Button>
          <LoadingButton type="submit" variant="contained" loading={loading}>
            {!isEdit ? 'New Customer' : 'Save Changes'}
          </LoadingButton>
        </Stack>
      </Card>
    </FormProvider>
  );
}
