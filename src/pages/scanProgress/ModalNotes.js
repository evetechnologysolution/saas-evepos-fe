import PropTypes from 'prop-types';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useSnackbar } from 'notistack';
// @mui
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, IconButton } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Iconify from 'src/components/Iconify';
import axiosInstance from 'src/utils/axios';
import { handleMutationFeedback } from 'src/utils/mutationfeedback';

// ----------------------------------------------------------------------

ModalNotes.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  id: PropTypes.string,
  payload: PropTypes.object,
  refetch: PropTypes.func,
};

export default function ModalNotes({ open, onClose, id, payload, refetch }) {
  const { enqueueSnackbar } = useSnackbar();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      notes: '',
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data) => {
    const finalPayload = {
      ...payload,
    };
    finalPayload.log.notes = data.notes;

    const mutation = axiosInstance.post(`/progress/${id}`, finalPayload);

    await handleMutationFeedback(mutation, {
      successMsg: 'Notes berhasil disimpan!',
      errorMsg: 'Gagal menyimpan notes!',
      onSuccess: () => {
        refetch();
        handleClose();
      },
      enqueueSnackbar,
    });
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ pr: 5 }}>
        {payload?.log?.status} Notes
        <IconButton onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <Iconify icon="eva:close-fill" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Controller
          name="notes"
          control={control}
          rules={{ required: 'Notes wajib diisi' }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Notes"
              fullWidth
              multiline
              minRows={3}
              autoComplete="off"
              error={Boolean(errors.notes)}
              helperText={errors.notes?.message}
            />
          )}
        />
      </DialogContent>

      <DialogActions>
        <Grid container spacing={2}>
          {/* Cancel = 1/3 */}
          <Grid item xs={4}>
            <Button fullWidth variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
          </Grid>

          {/* Save = 2/3 */}
          <Grid item xs={8}>
            <LoadingButton fullWidth variant="contained" loading={isSubmitting} onClick={handleSubmit(onSubmit)}>
              Save
            </LoadingButton>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );
}
