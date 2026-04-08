import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
// @mui
import { Container } from '@mui/material';
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
  const { create } = useStatus();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

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
  } = methods;

  const liveFormState = watch();

  const onSubmit = async (data) => {
    await handleMutationFeedback(create.mutateAsync(data), {
      successMsg: 'Status berhasil disimpan!',
      errorMsg: 'Gagal menyimpan status!',
      onSuccess: () => navigate('/dashboard/library/status-scan'),
      enqueueSnackbar,
    });
  };

  return (
    <Page title="Status Scan: New">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="Status Scan"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Library', href: PATH_DASHBOARD.library.root },
            { name: 'Category', href: PATH_DASHBOARD.library.category },
            { name: 'New' },
          ]}
        />

        <StatusForm
          type="create"
          methods={methods}
          setValue={setValue}
          getValues={getValues}
          formState={liveFormState}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit(onSubmit, (e) => console.log(e))}
        />
      </Container>
    </Page>
  );
}
