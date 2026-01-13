import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate, useParams } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack, Typography, Button } from '@mui/material';
// routes
import axiosInstance from 'src/utils/axios';
import { PATH_DASHBOARD } from '../../../../routes/paths';
// components
import {
  FormProvider,
  RHFTextField,
  // RHFEditor,
  RHFUploadSingleFile,
} from '../../../../components/hook-form';

// ----------------------------------------------------------------------

ProductForm.propTypes = {
  isEdit: PropTypes.bool,
  currentData: PropTypes.object,
};

export default function ProductForm({ isEdit, currentData }) {
  const navigate = useNavigate();
  const param = useParams();

  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);

  const NewDataSchema = Yup.object().shape({
    id: Yup.string(),
    name: Yup.string().required('Name is required'),
    image: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      id: currentData?._id || '',
      name: currentData?.name || '',
      image: currentData?.image || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentData]
  );

  const methods = useForm({
    resolver: yupResolver(NewDataSchema),
    defaultValues,
  });

  const { reset, watch, setValue, handleSubmit } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && currentData) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentData]);

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'image',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  const onSubmit = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('image', values.image);

      if (!isEdit) {
        await axiosInstance.post('/gallery', formData);
      } else {
        await axiosInstance.patch(`/gallery/${param.id}`, formData);
      }
      reset();
      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      navigate(PATH_DASHBOARD.content.gallery);
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
              <RHFTextField name="name" label="Image Name" autoComplete="off" />
              <div>
                <Typography sx={{ mb: 1 }}>Image (max size: 2MB)</Typography>
                <RHFUploadSingleFile name="image" accept="image/*" maxSize={900000} onDrop={handleDrop} />
              </div>
            </Stack>
            <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }} gap={1}>
              <Button variant="outlined" onClick={() => navigate(PATH_DASHBOARD.content.gallery)}>
                Cancel
              </Button>
              <LoadingButton type="submit" variant="contained" loading={loading}>
                {!isEdit ? 'New Image' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>
      </Card>
    </FormProvider>
  );
}
