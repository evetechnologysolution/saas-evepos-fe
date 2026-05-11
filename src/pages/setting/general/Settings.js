import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { useSnackbar } from 'notistack';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import {
  Button, Container, Card, Stack, Typography, TextField, Autocomplete, Chip
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import { FormProvider, RHFSwitch } from '../../../components/hook-form';
// service
import useOutlet from '../../outlet/service/useOutlet';
// service
import useGeneralSetting from './service/useGeneralSetting';
import schema from './schema';

// ----------------------------------------------------------------------

const SettingItem = ({ name, title, ...other }) => {
  return (
    <Stack
      // bgcolor="#F4F6F8"
      border="2px solid #EBEEF2"
      borderRadius="8px"
      py={1}
      px={2}
      {...other}
    >
      <RHFSwitch
        name={name}
        labelPlacement="start"
        label={<Typography variant="subtitle2">{title}</Typography>}
        sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
      />
    </Stack>
  );
};

SettingItem.propTypes = {
  name: PropTypes.string,
  title: PropTypes.string,
};

export default function Settings() {
  const { enqueueSnackbar } = useSnackbar();

  const { list: listOulet } = useOutlet();
  const { data: dataOulet, isLoading: loadingOutlet } = listOulet({
    page: 1,
    perPage: 10,
  });

  const {
    getDataSetting,
    update,
  } = useGeneralSetting();

  const { data: dataSetting } = getDataSetting({
    byOutlet: "none"
  });


  const defaultValues = useMemo(
    () => ({
      outletRef: dataSetting?.outletRef || [],
      cashBalance: dataSetting?.cashBalance ?? false,
      themeSetting: dataSetting?.themeSetting ?? false,
      //   dineInTable: dataSetting?.dineIn?.table || false,
      //   dineInCustomer: dataSetting?.dineIn?.customer || false,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dataSetting]
  );

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const {
    control,
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (dataSetting) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSetting]);

  const onSubmit = async () => {
    try {
      const data = {
        outletRef: values.outletRef,
        cashBalance: values.cashBalance,
        themeSetting: values.themeSetting,
        // dineIn: {
        //     table: values.dineInTable,
        //     customer: values.dineInCustomer
        // }
      };
      await update.mutateAsync(data);
      enqueueSnackbar('Update success!');
    } catch (error) {
      enqueueSnackbar('Update failed!', { variant: 'error' });
      console.error(error);
    }
  };

  return (
    <Page title="Settings" sx={{ height: 1 }}>
      <Container maxWidth={false} sx={{ height: 1 }}>
        <HeaderBreadcrumbs
          heading="Settings"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            { name: 'Settings' },
          ]}
        />
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Card
            sx={{
              padding: '20px',
              margin: '0 5vw',
            }}
          >
            <Stack gap={2}>
              <Controller
                name="outletRef"
                control={control}
                defaultValue={[]}
                render={({ field, fieldState: { error } }) => (
                  <Autocomplete
                    multiple
                    filterSelectedOptions
                    options={dataOulet?.docs || []}
                    value={dataOulet?.docs?.filter((option) => field.value?.includes(option._id)) || []}
                    getOptionLabel={(option) => option.name || ''}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    onChange={(event, newValue) => field.onChange(newValue.map((item) => item._id))}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip {...getTagProps({ index })} key={option._id} size="small" label={option.name} />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="Pilih Outlet" error={!!error} helperText={error?.message} />
                    )}
                  />
                )}
              />
              <SettingItem name="cashBalance" title="Wajibkan kas awal sebelum transaksi" />
              {/* <SettingItem
                                name="themeSetting"
                                title="Selalu tampilkan button theme settings"
                            /> */}
              {/* <SettingItem
                                name="dineInTable"
                                title="Wajibkan pilih meja untuk dine-in"
                            />
                            {!values.dineInTable && (
                                <SettingItem
                                    name="dineInCustomer"
                                    title="Wajibkan input customer name untuk dine-in"
                                    ml={5}
                                />
                            )} */}
            </Stack>
            <Stack direction="row" justifyContent="flex-end" mt={5} gap={1}>
              <Button variant="outlined" onClick={() => reset(defaultValues)}>
                Cancel
              </Button>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting || loadingOutlet}>
                Save Changes
              </LoadingButton>
            </Stack>
          </Card>
        </FormProvider>
      </Container>
    </Page>
  );
}
