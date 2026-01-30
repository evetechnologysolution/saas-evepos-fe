// @mui
import { Box, CircularProgress, Container } from '@mui/material';
// routes
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import { handleMutationFeedback } from 'src/utils/mutationfeedback';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
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
  const { update, getById, list } = useCategory();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: tableData, isSuccess } = list({
    page: 1,
    perPage: 50,
  });

  const { data: categoryById, isSuccess: isSuccessById, isLoading: loadingCategoryById } = getById(id);

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
    watch,
    reset,
  } = methods;

  const liveFormState = watch();

  useEffect(() => {
    if (!isSuccessById || !tableData?.docs) return;

    const ids = tableData.docs.map((item) => item.listNumber);

    reset({
      ...categoryById,
      selectedList: ids,
    });
  }, [isSuccessById, categoryById, tableData?.docs, reset]);

  const onSubmit = async (data) => {
    await handleMutationFeedback(update.mutateAsync({ id, payload: data }), {
      successMsg: 'Kategori berhasil disimpan!',
      errorMsg: 'Gagal menyimpan kategori!',
      onSuccess: () => navigate('/dashboard/library/subcategory'),
      enqueueSnackbar,
    });
  };

  return (
    <Page title="Sub Category: Edit">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="Edit Sub Category"
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
          <CategoryForm
            type="edit"
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
