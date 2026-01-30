// @mui
import { Box, CircularProgress, Container } from '@mui/material';
// routes
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import { handleMutationFeedback } from 'src/utils/mutationfeedback';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
// sections
import CategoryForm from './form/CategoryForm';
import schema from './schema';
import useCategory from './service/useCategory';

// ----------------------------------------------------------------------

export default function LibraryCategoryCreate() {
  const { themeStretch } = useSettings();
  const { create, list } = useCategory();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const {
    data: tableData,
    isSuccess,
    loadingData,
  } = list({
    page: 1,
    perPage: 50,
  });

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
    watch,
  } = methods;

  const liveFormState = watch();

  useEffect(() => {
    if (!tableData?.docs) return;

    const ids = tableData.docs.map((item) => item.listNumber);
    setValue('selectedList', ids);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableData]);

  const onSubmit = async (data) => {
    await handleMutationFeedback(create.mutateAsync(data), {
      successMsg: 'Kategori berhasil disimpan!',
      errorMsg: 'Gagal menyimpan kategori!',
      onSuccess: () => navigate('/dashboard/library/category'),
      enqueueSnackbar,
    });
  };

  return (
    <Page title="Category: New">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="New Category"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Library', href: PATH_DASHBOARD.library.root },
            { name: 'Category', href: PATH_DASHBOARD.library.category },
            { name: 'New' },
          ]}
        />

        {loadingData ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <CategoryForm
            type="create"
            methods={methods}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit(onSubmit, (e) => console.log(e))}
            setValue={setValue}
            formState={liveFormState}
          />
        )}
      </Container>
    </Page>
  );
}
