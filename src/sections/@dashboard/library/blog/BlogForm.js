import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate, useParams } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import SimpleMDE from 'react-simplemde-editor';
// @mui
import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack, Typography, Button, Checkbox, FormControlLabel } from '@mui/material';
// hooks
import useAuth from '../../../../hooks/useAuth';
// routes
import axiosInstance from '../../../../utils/axios';
import { PATH_DASHBOARD } from '../../../../routes/paths';
// components
import { FormProvider, RHFTextField, RHFUploadSingleFile } from '../../../../components/hook-form';

// context

// ----------------------------------------------------------------------

BlogForm.propTypes = {
  isEdit: PropTypes.bool,
  currentData: PropTypes.object,
};

// const CategoriesBlog = [
//   { id: 1, label: 'Business', value: 'Business' },
//   { id: 2, label: 'Career', value: 'Career' },
//   { id: 3, label: 'Cloud', value: 'Cloud' },
//   { id: 4, label: 'E-Commerce & Shopping', value: 'E-Commerce & Shopping' },
//   { id: 5, label: 'Education Tech', value: 'Education Tech' },
//   { id: 6, label: 'Entrepreneur', value: 'Entrepreneur' },
//   { id: 7, label: 'Finance', value: 'Finance' },
//   { id: 8, label: 'Healthcare', value: 'Healthcare' },
//   { id: 9, label: 'Logistics', value: 'Logistics' },
//   { id: 10, label: 'Marketing', value: 'Marketing' },
//   { id: 11, label: 'Mobile', value: 'Mobile' },
//   { id: 12, label: 'QA', value: 'QA' },
//   { id: 13, label: 'Travel & Hospital', value: 'Travel & Hospital' },
//   { id: 14, label: 'UIUX', value: 'UIUX' },
//   { id: 15, label: 'Website', value: 'Website' },
// ];

export default function BlogForm({ isEdit, currentData }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const param = useParams();

  // const ctx = useContext(mainContext);

  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState([]);
  const [listCategory, setlistCategory] = useState([]);
  const [active, setActive] = useState(true);

  const NewDataSchema = Yup.object().shape({
    id: Yup.string(),
    title: Yup.string().required('Title is required'),
    spoiler: Yup.string().required(),
    content: Yup.string().required(),
    image: Yup.string().required(),
  });

  const defaultValues = useMemo(
    () => ({
      id: currentData?._id || '',
      title: currentData?.title || '',
      spoiler: currentData?.spoiler || '',
      image: currentData?.image || '',
      content: currentData?.content || '',
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
      setCategory(
        currentData?.category
          ?.toString()
          .split(',')
          .map((item) => item.trim()) || []
      );
      setActive(currentData.isActive ?? true);
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
      setCategory(currentData?.category || []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentData]);

  useEffect(() => {
    const getData = async () => {
      const url = `/blog/list-category`;

      try {
        await axiosInstance.get(url).then((response) => {
          setlistCategory(response.data?.name || []);
        });
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

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
      formData.append('title', values.title);
      formData.append('spoiler', values.spoiler);
      formData.append('image', values.image);
      formData.append('content', values.content);
      formData.append('category', category);
      formData.append('isActive', active);

      if (!isEdit) {
        formData.append('author', user?._id);
        await axiosInstance.post('/blog', formData);
      } else {
        await axiosInstance.patch(`/blog/${param.id}`, formData);
      }
      reset();
      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      navigate(PATH_DASHBOARD.content.blog);
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
              <Stack>
                <RHFTextField name="title" label="Blog Title" autoComplete="off" />
              </Stack>
              <Stack>
                <RHFTextField name="spoiler" label="Spoiler" autoComplete="off" multiline rows={5} />
              </Stack>
              <div>
                <Typography sx={{ mb: 1 }}>Cover (max size: 2MB)</Typography>
                <RHFUploadSingleFile name="image" accept="image/*" maxSize={900000} onDrop={handleDrop} />
              </div>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <Stack>
                <SimpleMDE value={values.content} onChange={(value) => setValue('content', value)} />
                {/* <RHFEditor name="content" />
                <div style={{ opacity: '0' }}>
                  <RHFTextField name="content" type="hidden" />
                </div> */}
              </Stack>
              <Stack>
                <Typography variant="subtitle2">Category</Typography>
                <Grid>
                  {/* <RHFRadioGroup
                    name="gender"
                    options={CategoriesBlog}
                    sx={{
                      '& .MuiFormControlLabel-root': { mr: 4 },
                    }}
                  /> */}
                  {listCategory.map((item, index) => (
                    <FormControlLabel
                      key={index}
                      label={item}
                      control={
                        <Checkbox
                          name=""
                          checked={category.includes(item.trim())}
                          value={item.trim()}
                          onChange={() => {
                            setCategory((prev) => {
                              if (prev.includes(item)) {
                                return prev.filter((value) => value !== item.trim());
                              }
                              return [...prev, item.trim()];
                            });
                          }}
                        />
                      }
                    />
                  ))}
                </Grid>
              </Stack>
              <Stack>
                <Typography variant="subtitle2">Article Visibility</Typography>
                <FormControlLabel
                  label="Active"
                  control={
                    <Checkbox
                      name=""
                      checked={active}
                      value={active}
                      onChange={() => {
                        setActive(!active);
                      }}
                    />
                  }
                />
              </Stack>
            </Stack>
          </Grid>
        </Grid>
        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }} gap={1}>
          <Button variant="outlined" onClick={() => navigate(PATH_DASHBOARD.content.blog)}>
            Cancel
          </Button>
          <LoadingButton type="submit" variant="contained" loading={loading}>
            {!isEdit ? 'New Post' : 'Save Changes'}
          </LoadingButton>
        </Stack>
      </Card>
    </FormProvider>
  );
}
