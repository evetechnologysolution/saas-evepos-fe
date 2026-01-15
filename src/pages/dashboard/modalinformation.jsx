/* eslint-disable camelcase */
/* eslint-disable react/jsx-boolean-value */
import React, { useState, forwardRef } from 'react';
import {
  Box,
  Checkbox,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  ListItemText,
  MenuItem,
  Slide,
  Stack,
} from '@mui/material';
import useAuth from 'src/hooks/useAuth';
import { FormProvider, RHFRadioGroup, RHFSelect, RHFSelectMultiple, RHFTextField } from 'src/components/hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { product_category, customer_needed } from './mock';
import schema from './schema';

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function AlertNewUser() {
  const auth = useAuth();

  const [open, setOpen] = useState(true);

  const closeDialog = () => setOpen(false);

  const methods = useForm({
    resolver: yupResolver(schema),
    schema: schema.getDefault(),
    defaultValues: schema.getDefault(),
  });

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch,
  } = methods;

  const usedOtherAppBefore = watch('usedOtherAppBefore');

  const onSubmit = async (data) => {};

  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={closeDialog}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Selamat datang di Evepos, {auth.user?.username} !</DialogTitle>

        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Lengkapi pertanyaan di bawah ini untuk personalisasi dashboard Anda
          </DialogContentText>
          <Box sx={{ marginTop: '1em' }}>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)} fullwidth>
              <Stack spacing={1}>
                <FormControl>
                  <DialogContentText>Apakah Anda memiliki bisnis online?</DialogContentText>
                  <RHFRadioGroup
                    name="hasOnlineBusiness"
                    options={[
                      { value: true, label: 'Ya' },
                      { value: false, label: 'Tidak' },
                    ]}
                  />
                </FormControl>
                <Box>
                  <DialogContentText sx={{ marginBottom: '0.5em' }}>Apa jenis produk Anda?</DialogContentText>
                  <RHFSelect name="businessSector" label="Pilih" SelectProps={{ native: false }}>
                    {product_category.map((result, index) => (
                      <MenuItem value={result.value} key={index}>
                        {result.name}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                </Box>
                <Box>
                  <DialogContentText sx={{ marginBottom: '0.5em' }}>
                    Apa yang Anda butuhkan di Evepos?
                  </DialogContentText>

                  <RHFSelectMultiple
                    name="needs"
                    label="Pilih"
                    placeholder="Pilih kebutuhan Anda"
                    options={customer_needed}
                  >
                    {customer_needed.map((result, index) => (
                      <MenuItem value={result.value} key={index}>
                        <Checkbox checked={methods.watch('needs')?.indexOf(result.value) > -1} size="small" />
                        <ListItemText primary={result.name} />
                      </MenuItem>
                    ))}
                  </RHFSelectMultiple>
                </Box>
                <FormControl>
                  <DialogContentText>Apakah Anda pernah menggunakan aplikasi lain sebelumnya?</DialogContentText>
                  <RHFRadioGroup
                    name="usedOtherAppBefore"
                    options={[
                      { value: true, label: 'Ya' },
                      { value: false, label: 'Tidak' },
                    ]}
                  />
                </FormControl>
                {usedOtherAppBefore === 'true' && (
                  <Box>
                    <DialogContentText sx={{ marginBottom: '0.5em' }}>Nama aplikasi</DialogContentText>
                    <RHFTextField name="otherAppName" label="Nama aplikasi" placeholder="contoh: iReap, Pawoon, dll" />
                  </Box>
                )}
                <FormControl>
                  <DialogContentText>Dari manakah Anda mengetahui Evepos?</DialogContentText>
                  <RHFRadioGroup
                    name="usedOtherAppBefore"
                    options={[
                      { value: 'google', label: 'Google' },
                      { value: 'rekan atau partner bisnis', label: 'Rekan/Partner Bisnis' },
                      { value: 'lainnya', label: 'Lainnya' },
                    ]}
                  />
                </FormControl>
              </Stack>
              <Box sx={{ marginTop: '1.5em' }}>
                <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
                  simpan
                </LoadingButton>
              </Box>
            </FormProvider>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
