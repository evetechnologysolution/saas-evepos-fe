import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useState, useEffect, useContext, useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack, Button, Typography } from '@mui/material';
import axios from '../../../../utils/axios';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
import { FormProvider, RHFTextField } from '../../../../components/hook-form';
// context
import { mainContext } from '../../../../contexts/MainContext';

// ----------------------------------------------------------------------

CategoryForm.propTypes = {
  isEdit: PropTypes.bool,
  currentData: PropTypes.object,
};

export default function CategoryForm({ isEdit, currentData }) {
  const navigate = useNavigate();

  const ctx = useContext(mainContext);

  const { enqueueSnackbar } = useSnackbar();

  const [selectedList, setSelectedList] = useState([]);

  const NewDataSchema = Yup.object().shape({
    id: Yup.string(),
    name: Yup.string().required('Name is required'),
    listNumber: Yup.string().required('List Number is required'),
  });

  const defaultValues = useMemo(
    () => ({
      id: currentData?._id || '',
      name: currentData?.name || '',
      listNumber: currentData?.listNumber || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentData]
  );

  const methods = useForm({
    resolver: yupResolver(NewDataSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const originalData = isEdit ? ctx.category.filter((item) => item._id !== currentData._id) : '';

  useEffect(() => {
    if (isEdit && currentData) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }

    const getData = async () => {
      try {
        await axios.get('/category?page=1&perPage=50').then((response) => {
          setSelectedList(response.data.docs);
        });
      } catch (error) {
        console.log(error);
      }
    };
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentData]);

  const onSubmit = async () => {
    try {
      if (!isEdit) {
        const data = {
          name: values.name,
          listNumber: values.listNumber,
        };
        await ctx.createCategory(data);
      } else {
        await ctx.updateCategory({ _id: currentData._id }, values);
        ctx.setCategory([
          ...originalData,
          {
            ...currentData,
            name: values.name,
            listNumber: values.listNumber,
          },
        ]);
      }
      reset();
      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      navigate(PATH_DASHBOARD.library.category);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <RHFTextField name="name" label="Category Name" autoComplete="off" />
                {/* <RHFTextField name="listNumber" type="number" label="List Number" autoComplete="off" /> */}
                <div>
                  <Typography sx={{ mb: 1, ml: 2 }}>List Number</Typography>
                  {/* {!values.listNumber && (
                                        <Typography color="error" sx={{ mb: 5, mt: 2, ml: 2, lineHeight: "1.5px", fontSize: "0.75rem" }}>List number is required</Typography>
                                    )} */}
                  <Stack display="grid" gap={1} gridTemplateColumns="repeat(auto-fit, 80px)">
                    {Array.from({ length: 30 }).map((_, n) => (
                      <Button
                        key={n}
                        variant={values.listNumber === n + 1 ? 'contained' : 'outlined'}
                        sx={{ height: 50 }}
                        onClick={() => setValue('listNumber', n + 1)}
                        disabled={
                          selectedList?.some((item) => item?.listNumber === n + 1) && currentData?.listNumber !== n + 1
                            ? Boolean(true)
                            : Boolean(false)
                        }
                      >
                        {n + 1}
                      </Button>
                    ))}
                  </Stack>
                </div>
              </Stack>

              <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }} gap={1}>
                <Button variant="outlined" onClick={() => navigate(PATH_DASHBOARD.library.category)}>
                  Cancel
                </Button>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                  disabled={!values.listNumber || !values.name ? Boolean(true) : Boolean(false)}
                >
                  {!isEdit ? 'New Category' : 'Save Changes'}
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </>
  );
}
