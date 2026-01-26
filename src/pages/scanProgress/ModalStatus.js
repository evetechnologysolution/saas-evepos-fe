import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useSnackbar } from 'notistack';
// @mui
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, IconButton } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Iconify from 'src/components/Iconify';
import axiosInstance from 'src/utils/axios';
import { handleMutationFeedback } from 'src/utils/mutationfeedback';
import useStatus from './service/useStatus';

// ----------------------------------------------------------------------

ModalAddStatus.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  isEdit: PropTypes.bool,
  currentData: PropTypes.any,
};

export default function ModalAddStatus({ open, onClose, isEdit, currentData }) {
  const { enqueueSnackbar } = useSnackbar();
  const { create, update, remove } = useStatus();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
    },
  });

  useEffect(() => {
    if (isEdit) {
      reset({
        name: currentData?.name,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentData]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data) => {
    const mutation = isEdit
      ? update.mutateAsync({
          id: currentData._id,
          payload: data,
        })
      : create.mutateAsync(data);

    await handleMutationFeedback(mutation, {
      successMsg: isEdit ? 'Status berhasil diperbarui!' : 'Status berhasil ditambahkan!',
      errorMsg: 'Gagal menyimpan status!',
      onSuccess: () => {
        handleClose(); // reset + close modal
      },
      enqueueSnackbar,
    });
  };

  const handleDelete = async () => {
    const mutation = remove.mutateAsync(currentData._id);

    await handleMutationFeedback(mutation, {
      successMsg: 'Status berhasil dihapus!',
      errorMsg: 'Gagal menghapus status!',
      onSuccess: () => {
        handleClose();
      },
      enqueueSnackbar,
    });
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ pr: 5 }}>
        {isEdit ? 'Edit Status' : 'Add Status'}
        <IconButton onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <Iconify icon="eva:close-fill" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Controller
          name="name"
          control={control}
          rules={{ required: 'Nama status wajib diisi' }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Status Name"
              fullWidth
              autoComplete="off"
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
              inputProps={{ maxLength: 30 }}
            />
          )}
        />
      </DialogContent>

      <DialogActions>
        <Grid container spacing={2}>
          {/* Cancel = 1/3 */}
          <Grid item xs={isEdit ? 3 : 4}>
            <Button fullWidth variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
          </Grid>
          {isEdit && (
            <Grid item xs={3}>
              <LoadingButton
                fullWidth
                color="error"
                variant="outlined"
                loading={remove.isLoading}
                onClick={handleDelete}
              >
                Hapus
              </LoadingButton>
            </Grid>
          )}

          <Grid item xs={isEdit ? 6 : 8}>
            <LoadingButton fullWidth variant="contained" loading={isSubmitting} onClick={handleSubmit(onSubmit)}>
              Save
            </LoadingButton>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );
}
