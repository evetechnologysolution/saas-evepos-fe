import * as Yup from 'yup';
import { useContext, useMemo, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { useQueryClient } from 'react-query';
// form
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import {
  styled,
  Container,
  Typography,
  Card,
  Grid,
  Stack,
  Button,
  InputAdornment,
  FormControlLabel,
  Switch,
  Divider,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField, RHFNumericFormat } from '../../../components/hook-form';
// context
import { mainContext } from '../../../contexts/MainContext';
import axios from '../../../utils/axios';

// ----------------------------------------------------------------------

const CustomSwitch = styled(Switch)(({ theme }) => ({
  padding: 8,
  '& .MuiSwitch-switchBase': {
    '&.Mui-checked': {
      color: '#fff',
      '& + .MuiSwitch-track': {
        opacity: 1,
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
    width: 16,
    height: 16,
    margin: 2,
    transition: theme.transitions.create(['width'], {
      duration: 200,
    }),
  },
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
    opacity: 1,
    boxSizing: 'border-box',
  },
}));

// ----------------------------------------------------------------------

export default function PerfumeForm() {
  const ctx = useContext(mainContext);

  const queryClient = useQueryClient();

  const { enqueueSnackbar } = useSnackbar();

  const NewDataSchema = Yup.object().shape({
    id: Yup.string(),
    name: Yup.string().default('Parfum'),
  });

  const defaultOption = { name: '', notes: '', price: 0, productionPrice: 0, isMultiple: false, isDefault: false };
  const defaultSuboption = { name: '', notes: '', price: 0, productionPrice: 0, isMultiple: false, isDefault: false };

  const defaultValues = useMemo(
    () => ({
      id: ctx.generalPerfume?._id || '',
      name: ctx.generalPerfume?.name || 'Parfum',
      options: ctx.generalPerfume?.options?.length > 0 ? ctx.generalPerfume.options : [defaultOption],
      suboptions: ctx.generalPerfume?.suboptions?.length > 0 ? ctx.generalPerfume.suboptions : [defaultSuboption],
    }),
    [ctx.generalPerfume]
  );

  const methods = useForm({
    resolver: yupResolver(NewDataSchema),
    defaultValues,
  });

  useEffect(() => {
    if (ctx.generalPerfume) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx.generalPerfume]);

  const {
    control,
    reset,
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const {
    fields: optionList,
    append: appendOption,
    remove: removeOption,
  } = useFieldArray({
    control,
    name: 'options',
  });

  const {
    fields: subList,
    append: appendSub,
    remove: removeSub,
  } = useFieldArray({
    control,
    name: 'suboptions',
  });

  const handleCancel = () => {
    reset(defaultValues);
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.name,
        options: data.options,
        suboptions: data.suboptions,
      };

      await axios.post('/variant/perfume/', payload);
      queryClient.invalidateQueries('generalPerfume');
      enqueueSnackbar('Update success!');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Page title="Perfume" sx={{ height: 1 }}>
      <Container maxWidth={false} sx={{ height: 1 }}>
        <HeaderBreadcrumbs
          heading="Perfume"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            { name: 'Perfume' },
          ]}
        />
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Card sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Stack spacing={3}>
                  {/* <RHFTextField name="name" label="Variant Name" autoComplete="off" /> */}

                  <Typography variant="subtitle1">List of Perfume</Typography>

                  {optionList?.map((_, index) => (
                    <Stack key={index} gap={1}>
                      <Typography variant="subtitle2">No. {index + 1}</Typography>
                      <RHFTextField
                        name={`options.${index}.name`}
                        placeholder="Perfume Name"
                        autoComplete="off"
                        required
                        fullWidth
                      />
                      <Stack
                        flexDirection={{ xs: 'column', sm: 'row' }}
                        alignItems="center"
                        justifyContent="center"
                        gap={3}
                      >
                        <Stack
                          flexDirection="row"
                          justifyContent="space-between"
                          alignItems="center"
                          gap={1}
                          sx={{ width: '100%' }}
                        >
                          <RHFTextField
                            name={`options.${index}.notes`}
                            placeholder="Perfume Notes"
                            autoComplete="off"
                            required
                            fullWidth
                          />
                          {optionList?.length !== 1 && (
                            <Button
                              color="error"
                              sx={{
                                boxShadow: '0',
                                p: 0,
                                minWidth: 30,
                                height: 30,
                              }}
                              size="large"
                              onClick={() => removeOption(index)}
                            >
                              <Iconify icon="eva:trash-2-outline" width={20} height={20} />
                            </Button>
                          )}
                        </Stack>
                      </Stack>
                    </Stack>
                  ))}
                  <Stack alignItems="center">
                    <Button variant="text" onClick={() => appendOption(defaultOption)}>
                      <Iconify icon="eva:plus-fill" width={20} height={20} /> Add Perfume
                    </Button>
                  </Stack>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={3}>
                  <Typography variant="subtitle1">List of Options</Typography>

                  {subList?.map((item, index) => (
                    <Stack key={index} gap={3}>
                      <Stack
                        flexDirection={{ xs: 'column', sm: 'row' }}
                        alignItems="center"
                        justifyContent="center"
                        gap={3}
                      >
                        <RHFTextField
                          name={`suboptions.${index}.name`}
                          placeholder="Option Name"
                          autoComplete="off"
                          required
                          fullWidth
                        />
                        <RHFNumericFormat
                          name={`suboptions.${index}.price`}
                          label="Price"
                          autoComplete="off"
                          thousandSeparator=","
                          decimalScale={2}
                          allowNegative={false}
                          InputProps={{
                            startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                          }}
                        />
                      </Stack>
                      <Stack
                        flexDirection={{ xs: 'column', sm: 'row' }}
                        alignItems="center"
                        justifyContent="center"
                        gap={3}
                      >
                        <RHFNumericFormat
                          name={`suboptions.${index}.productionPrice`}
                          label="Production Cost"
                          autoComplete="off"
                          thousandSeparator=","
                          decimalScale={2}
                          allowNegative={false}
                          InputProps={{
                            startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                          }}
                        />
                        <Stack
                          flexDirection="row"
                          justifyContent="space-between"
                          alignItems="center"
                          gap={1}
                          sx={{ width: '100%' }}
                        >
                          {/* <Controller
                            name={`suboptions.${index}.isMultiple`}
                            control={control}
                            render={({ field }) => (
                              <FormControlLabel
                                labelPlacement="start"
                                label={
                                  <>
                                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                                      Multiple Qty
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                      Enable for multiple
                                    </Typography>
                                  </>
                                }
                                control={
                                  <CustomSwitch
                                    checked={field.value}
                                    onChange={(e) => field.onChange(e.target.checked)}
                                  />
                                }
                              />
                            )}
                          /> */}
                          <Controller
                            name={`suboptions.${index}.isDefault`}
                            control={control}
                            render={({ field }) => (
                              <FormControlLabel
                                labelPlacement="start"
                                label={
                                  <>
                                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                                      Default Option
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                      Enable for default option
                                    </Typography>
                                  </>
                                }
                                control={
                                  <CustomSwitch
                                    checked={field.value}
                                    onChange={(e) => {
                                      const checked = e.target.checked;

                                      const list = getValues('suboptions');

                                      list.forEach((_, i) => {
                                        setValue(`suboptions.${i}.isDefault`, i === index ? checked : false);
                                      });
                                    }}
                                  />
                                }
                              />
                            )}
                          />
                          {subList?.length !== 1 && (
                            <Button
                              color="error"
                              sx={{
                                boxShadow: '0',
                                p: 0,
                                minWidth: 30,
                                height: 30,
                              }}
                              size="large"
                              onClick={() => removeSub(index)}
                            >
                              <Iconify icon="eva:trash-2-outline" width={20} height={20} />
                            </Button>
                          )}
                        </Stack>
                      </Stack>
                      <Divider />
                    </Stack>
                  ))}
                  <Stack alignItems="center">
                    <Button variant="text" onClick={() => appendSub(defaultSuboption)}>
                      <Iconify icon="eva:plus-fill" width={20} height={20} /> Add Option
                    </Button>
                  </Stack>
                </Stack>

                <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }} gap={1}>
                  <Button variant="outlined" onClick={() => handleCancel()}>
                    Cancel
                  </Button>
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                    disabled={optionList?.length > 0 ? Boolean(false) : Boolean(true)}
                  >
                    Save Changes
                  </LoadingButton>
                </Stack>
              </Grid>
            </Grid>
          </Card>
        </FormProvider>
      </Container>
    </Page>
  );
}
