import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  IconButton,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Alert,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Iconify from 'src/components/Iconify';
import axiosInstance from 'src/utils/axios';
import { handleMutationFeedback } from 'src/utils/mutationfeedback';

const roundQty = (v) => Math.round(v * 10) / 10;

export default function ModalProgress({
  open,
  onClose,
  detail,
  currProgress,
  refetch,
  currentStatusId,
}) {
  const { enqueueSnackbar } = useSnackbar();

  const [showAlert, setShowAlert] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      listProcess: [],
    },
  });

  const currData = watch();

  // progressDetail sudah sesuai index order
  const progressDetail = detail?.progressDetail || [];

  useEffect(() => {
    if (detail?.orders) {
      reset({
        listProcess: detail.orders.map((item) => ({
          status: currProgress || '',
          id: item?.id,
          name: item?.name,
          unit: item?.unit,
          qty: '',
          notes: '',
          isChecked: false,
          statusRef: currentStatusId,
        })),
      });
    }
  }, [currProgress, detail, reset, currentStatusId]);

  const handleClose = () => {
    reset();
    onClose();
    setTimeout(() => {
      setShowAlert(false);
    }, 500);
  };

  const onSubmit = async (data) => {
    const filteredProcess = data?.listProcess?.filter(
      (item) => item?.qty > 0 && item?.status !== ''
    );

    if (filteredProcess?.length > 0) {
      setShowAlert(false);
      const finalPayload = {
        log: filteredProcess,
      };

      const mutation = axiosInstance.post(`/progress/${detail?._id}`, finalPayload);

      await handleMutationFeedback(mutation, {
        successMsg: 'Notes berhasil disimpan!',
        errorMsg: 'Gagal menyimpan notes!',
        onSuccess: () => {
          refetch();
          handleClose();
        },
        enqueueSnackbar,
      });
    } else {
      setShowAlert(true);
    }
  };

  return (
    <Dialog open={open} onClose={() => { }} fullWidth maxWidth="md">
      <DialogTitle sx={{ pr: 5 }}>
        Proses {currProgress}
        <IconButton
          onClick={handleClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <Iconify icon="eva:close-fill" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {showAlert && (
          <Alert severity="error" sx={{ mb: 1 }}>Qty proses belum diinput. Jika tidak tampil, geser tabel ke kanan.</Alert>
        )}
        <TableContainer component={Paper} sx={{ borderRadius: 1 }}>
          <Table
            size="small"
            sx={{
              '& th': {
                fontWeight: 600,
                fontSize: 13,
                color: 'text.secondary',
              },
              '& td': {
                fontSize: 13,
                verticalAlign: 'top',
              },
            }}
          >
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.100' }}>
                <TableCell>Items</TableCell>
                <TableCell align="center">Remaining</TableCell>
                <TableCell align="center">Qty Process</TableCell>
                <TableCell align="center">All</TableCell>
                <TableCell>Notes</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {detail?.orders
                ?.filter((item) =>
                  item?.masterProgressRef?.masterStatus?.some(
                    (s) => String(s._id) === String(currentStatusId)
                  )
                )
                ?.map((item, i) => {
                  // const progressItem = progressDetail[i];
                  const progressItem = progressDetail.find(
                    (p) => String(p.id) === String(item.id)
                  );

                  const qtyProcessed =
                    progressItem?.progressByStatus?.[
                    currProgress?.toLowerCase()
                    ] || 0;

                  const remaining = Math.max(
                    0,
                    roundQty(item.qty - qtyProcessed)
                  );

                  return (
                    <TableRow key={i} hover>
                      {/* ITEM */}
                      <TableCell sx={{ minWidth: 200 }}>
                        <Typography variant="body2" mt={1}>
                          {item.qty} {item.unit || 'pcs'} x {item.name}
                        </Typography>

                        {item.variant?.map((variant, v) => (
                          <Typography
                            key={v}
                            variant="caption"
                            display="block"
                            sx={{ opacity: 0.7 }}
                          >
                            {variant.name}: {variant.option}{' '}
                            {variant.qty > 1 && `(x${variant.qty})`}
                          </Typography>
                        ))}

                        {item.notes && (
                          <Typography
                            variant="caption"
                            display="block"
                            sx={{ opacity: 0.7 }}
                          >
                            Notes: {item.notes}
                          </Typography>
                        )}
                      </TableCell>

                      {/* REMAINING */}
                      <TableCell align="center">
                        <Typography variant="body2" mt={1}>
                          {remaining} {item.unit || 'pcs'}
                        </Typography>
                      </TableCell>

                      {/* QTY PROCESS */}
                      <TableCell align="center" sx={{ minWidth: 120 }}>
                        <Controller
                          name={`listProcess.${i}.qty`}
                          control={control}
                          rules={{
                            min: {
                              value: 0,
                              message: 'Tidak boleh minus',
                            },
                            validate: (value) => {
                              if (Number(value) > remaining) {
                                return `Maks. ${remaining}`;
                              }
                              return true;
                            },
                          }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              type="number"
                              size="small"
                              fullWidth
                              disabled={
                                currData?.listProcess?.[i]?.isChecked || !remaining
                              }
                              error={Boolean(errors?.listProcess?.[i]?.qty)}
                              helperText={errors?.listProcess?.[i]?.qty?.message}
                              inputProps={{
                                min: 0,
                                max: remaining,
                              }}
                              sx={{
                                '& .MuiInputBase-input': {
                                  typography: 'body2',
                                  textAlign: 'center',
                                },
                              }}
                            />
                          )}
                        />
                      </TableCell>

                      {/* PROCESS ALL */}
                      <TableCell align="center">
                        <Checkbox
                          onChange={(e) => {
                            if (e.target.checked) {
                              setValue(`listProcess.${i}.qty`, remaining);
                              setValue(`listProcess.${i}.isChecked`, true);
                            } else {
                              setValue(`listProcess.${i}.qty`, '');
                              setValue(`listProcess.${i}.isChecked`, false);
                            }
                          }}
                          disabled={!remaining}
                        />
                      </TableCell>

                      {/* NOTES */}
                      <TableCell sx={{ minWidth: 300 }}>
                        <Controller
                          name={`listProcess.${i}.notes`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              multiline
                              minRows={2}
                              size="small"
                              fullWidth
                              placeholder="Type here..."
                              disabled={!remaining}
                            />
                          )}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>

      <DialogActions sx={{ pt: '0 !important' }}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Button fullWidth variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
          </Grid>

          <Grid item xs={8}>
            <LoadingButton
              fullWidth
              variant="contained"
              loading={isSubmitting}
              onClick={handleSubmit(onSubmit)}
            >
              Save
            </LoadingButton>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );
}