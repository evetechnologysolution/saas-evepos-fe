import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { NumericFormat } from 'react-number-format';
// form
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import {
  Autocomplete,
  TextField,
  Card, Grid, Stack, Button, Typography, Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
// components
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import { TableNoData } from '../../../components/table';
import Iconify from '../../../components/Iconify';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
import { handleMutationFeedback } from '../../../utils/mutationfeedback';
import { numberWithCommas } from '../../../utils/getData';
import schema from '../../../pages/user/schema/customPoint';
import useUser from '../../../pages/user/service/useUser';

// ----------------------------------------------------------------------

UserFormCustomPoint.propTypes = {
  currentData: PropTypes.object,
};

export default function UserFormCustomPoint({ currentData }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { listProgress, update } = useUser();

  const [point, setPoint] = useState(0);
  const [selectedProgress, setSelectedProgress] = useState('');

  const { data: dataProgress, isLoading } = listProgress({
    page: 1,
    perPage: 100,
  });

  const handleChange = (_, val) => {
    setSelectedProgress({
      _id: val?._id || "",
      name: val?.name || "",
      basePoint: val?.basePoint || "",
    });
  };

  const defaultValues = useMemo(
    () => ({
      id: currentData?._id || '',
      info: currentData?.info || '',
      customPoint: currentData?.customPoint?.map((item) => ({
        productRef: item?.productRef?._id || null,
        progressLabelRef: item?.progressLabelRef?._id || null,
        productName: item?.productRef?.name || "",
        progressName: item?.progressLabelRef?.name || "",
        point: item?.point || 0,
      })) || [],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentData]
  );

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const {
    control,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "customPoint",
  });

  useEffect(() => {
    if (currentData) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentData]);

  const handleAdd = () => {
    if (!selectedProgress?._id || !point) return;

    const isExist = fields.some(
      (item) => item.progressLabelRef === selectedProgress._id
    );

    if (isExist) {
      enqueueSnackbar("Progress sudah ditambahkan!", { variant: "error" });
      return;
    }

    append({
      productRef: null,
      progressLabelRef: selectedProgress._id,
      productName: "",
      progressName: selectedProgress.name,
      point: point || 0,
    });

    // reset input
    setSelectedProgress(null);
    setPoint(0);
  };

  const onSubmit = async (data) => {
    const mutation = update.mutateAsync({ id: currentData._id, payload: data });

    await handleMutationFeedback(mutation, {
      successMsg: 'Custom Point berhasil diperbarui!',
      errorMsg: 'Gagal menyimpan user!',
      onSuccess: () => navigate(PATH_DASHBOARD.user.root),
      enqueueSnackbar,
    });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Stack spacing={3}>
                    <Stack>
                      <Typography variant="body2">Full Name</Typography>
                      <Typography variant="subtitle2">{currentData?.fullname || '-'}</Typography>
                    </Stack>
                    <Stack>
                      <Typography variant="body2">Email</Typography>
                      <Typography variant="subtitle2">{currentData?.email || '-'}</Typography>
                    </Stack>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack spacing={3}>
                    <Stack>
                      <Typography variant="body2">Phone</Typography>
                      <Typography variant="subtitle2">{currentData?.phone || '-'}</Typography>
                    </Stack>
                    <Stack>
                      <Typography variant="body2">Role</Typography>
                      <Typography variant="subtitle2" textTransform="capitalize">{currentData?.role || '-'}</Typography>
                    </Stack>
                  </Stack>
                </Grid>
              </Grid>

              <RHFTextField name="info" label="Information" type="text" autoComplete="off" multiline rows={3} />
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <Stack flexDirection={{ xs: "column", md: "row" }} gap={3}>
                <Autocomplete
                  options={dataProgress?.docs?.map((option) => ({
                    _id: option?._id,
                    name: option?.name,
                    basePoint: option?.basePoint,
                  }))}
                  getOptionLabel={(option) => option?.name ? `${option?.name} - ${option?.basePoint} Point` : option}
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Progress"
                      variant="outlined"
                    />
                  )}
                  fullWidth
                  autoComplete
                  loading={isLoading}
                  onChange={handleChange}
                  value={selectedProgress || null}
                />

                <NumericFormat
                  customInput={TextField}
                  name="point"
                  label="Custom Point"
                  autoComplete="off"
                  decimalScale={2}
                  decimalSeparator="."
                  thousandSeparator=","
                  allowNegative={false}
                  value={point === 0 ? '' : point}
                  onValueChange={(values) => {
                    setPoint(Number(values.value));
                  }}
                />
                <Stack justifyContent="center">
                  <Button
                    variant="contained"
                    startIcon={<Iconify icon="eva:plus-fill" />}
                    onClick={handleAdd}
                  >
                    Add
                  </Button>
                </Stack>
              </Stack>

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
                      <TableCell>Progress</TableCell>
                      <TableCell align="center">Custom Point</TableCell>
                      <TableCell align="center">Action</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {fields?.map((item, i) => {
                      return (
                        <TableRow hover key={i}>
                          <TableCell sx={{ verticalAlign: "middle !important" }}>
                            {item?.progressName || "-"}
                          </TableCell>
                          <TableCell align="center" sx={{ verticalAlign: "middle !important" }}>
                            {numberWithCommas(item?.point || 0)}
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              title="Delete"
                              variant="contained"
                              color="error"
                              sx={{ p: 0, minWidth: 35, height: 35 }}
                              onClick={() => remove(i)}
                            >
                              <Iconify icon="eva:trash-2-outline" sx={{ width: 24, height: 24 }} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}

                    <TableNoData isNotFound={!currentData?.customPoint?.length} height={100} />
                  </TableBody>
                </Table>
              </TableContainer>
            </Stack>

          </Grid>
        </Grid>
        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }} gap={1}>
          <Button variant="outlined" onClick={() => navigate(PATH_DASHBOARD.user.root)}>
            Cancel
          </Button>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Update
          </LoadingButton>
        </Stack>
      </Card>
    </FormProvider>
  );
}
