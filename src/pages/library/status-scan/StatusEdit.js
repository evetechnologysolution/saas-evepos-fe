import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
// @mui
import { Box, CircularProgress, Container } from '@mui/material';
import { handleMutationFeedback } from 'src/utils/mutationfeedback';
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
// sections
import StatusForm from './form/StatusForm';
import schema from './schema';
import useStatus from './service/useService';
// ----------------------------------------------------------------------
export default function LibraryCategoryCreate() {
  const { themeStretch } = useSettings();
  const { update, getById, list } = useStatus();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: categoryById, isSuccess: isSuccessById, isLoading: loadingCategoryById } = getById(id);
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });
  const {
    handleSubmit,
    setValue,
    getValues,
    formState: { isSubmitting },
    watch,
    reset,
  } = methods;
  const liveFormState = watch();

  useEffect(() => {
    if (!isSuccessById) return;
    reset(categoryById);
  }, [isSuccessById, categoryById, reset]);

  const onSubmit = async (data) => {
    await handleMutationFeedback(update.mutateAsync({ id, payload: data }), {
      successMsg: 'Status berhasil disimpan!',
      errorMsg: 'Gagal menyimpan status!',
      onSuccess: () => navigate('/dashboard/library/status-scan'),
      enqueueSnackbar,
    });
  };

  console.log(liveFormState);

  return (
    <Page title="Status Scan: Edit">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="Edit Status Scan"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Library', href: PATH_DASHBOARD.library.root },
            { name: 'Category', href: PATH_DASHBOARD.library.category },
            { name: 'New' },
          ]}
        />
        {loadingCategoryById ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <StatusForm
            type="edit"
            methods={methods}
            setValue={setValue}
            getValues={getValues}
            formState={liveFormState}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit(onSubmit, (e) => console.log(e))}
          />
        )}
      </Container>
    </Page>
  );
}
