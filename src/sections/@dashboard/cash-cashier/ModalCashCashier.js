import PropTypes from 'prop-types';
import { useState, useEffect, useContext } from 'react';
import {
  Alert,
  Button,
  IconButton,
  styled,
  Grid,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { NumericFormat } from 'react-number-format';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
// context
import { mainContext } from '../../../contexts/MainContext';
// service
import useCash from './service/useCash';

// ----------------------------------------------------------------------
ModalCashCashier.propTypes = {
  required: PropTypes.bool,
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Iconify icon="eva:close-fill" width={24} height={24} />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func,
};

export default function ModalCashCashier(props) {
  const ctx = useContext(mainContext);

  const { create } = useCash();

  const [isCashOut, setIsCashOut] = useState(false);

  const NewDataSchema = Yup.object().shape({
    title: Yup.string().required('Transaction name is required'),
    amount: Yup.number().min(0, 'Amount is required'),
  });

  const defaultValues = {
    title: '',
    amount: -1,
  };

  const methods = useForm({
    resolver: yupResolver(NewDataSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    getValues,
    setValue,
    setError,
    clearErrors,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (!ctx.existCash?.isOpen) {
      setValue('title', 'Kas Awal');
    }
  }, [ctx.existCash?.isOpen]);

  const handleClose = () => {
    props.onClose();
    setTimeout(() => {
      setIsCashOut(false);
      reset();
    }, 500);
  };

  const onSubmit = async () => {
    let objData = {
      title: values.title,
      amount: values.amount,
    };

    if (isCashOut) {
      objData = {
        ...objData,
        cashOut: values.amount,
      };
    } else {
      objData = {
        ...objData,
        cashIn: values.amount,
      };
    }
    await create.mutateAsync(objData);
    handleClose();
  };

  return (
    <>
      <BootstrapDialog aria-labelledby="customized-dialog-title" fullWidth maxWidth="xs" open={props.open}>
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={!props.required ? handleClose : null}
          style={{ borderBottom: '1px solid #ccc' }}
        >
          {ctx.existCash?.isOpen ? 'Add Transaction' : 'Open Cashier'}
        </BootstrapDialogTitle>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <DialogContent dividers>
            <Grid container spacing={3} mb={3}>
              <Grid item xs={12} md={12}>
                <Stack spacing={3}>
                  {props.required && (
                    <Alert severity="error">
                      Kas kasir wajib dibuka, silakan input data untuk buka kas kasir. Minimal nominal <b>Rp 0</b>
                    </Alert>
                  )}
                  {ctx.existCash?.isOpen && (
                    <>
                      <Stack
                        flexDirection="row"
                        justifyContent="space-between"
                        gap={1}
                        bgcolor="#EBEEF2"
                        p={1}
                        borderRadius={100}
                      >
                        <Button
                          variant={!isCashOut ? 'contained' : 'text'}
                          fullWidth
                          sx={{
                            borderRadius: 100,
                            boxShadow: 0,
                            overflow: 'hidden',
                            color: !isCashOut ? 'white' : 'inherit',
                          }}
                          onClick={() => setIsCashOut(false)}
                        >
                          Cash In
                        </Button>
                        <Button
                          variant={isCashOut ? 'contained' : 'text'}
                          fullWidth
                          sx={{
                            borderRadius: 100,
                            boxShadow: 0,
                            overflow: 'hidden',
                            color: isCashOut ? 'white' : 'inherit',
                          }}
                          onClick={() => setIsCashOut(true)}
                        >
                          Cash Out
                        </Button>
                      </Stack>
                      {isCashOut && (
                        // <Alert severity="warning">Kas Keluar akan tercatat sebagai <b>Pengeluran Outlet</b></Alert>
                        <RHFTextField name="expense" label="Expense" value="Pengeluaran Outlet" disabled />
                      )}
                    </>
                  )}
                  <RHFTextField name="title" label="Transaction Name" />
                  <NumericFormat
                    customInput={RHFTextField}
                    name="amount"
                    label="Amount"
                    autoComplete="off"
                    decimalScale={2}
                    decimalSeparator="."
                    thousandSeparator=","
                    allowNegative={false}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                    }}
                    value={getValues('amount') === -1 ? '' : getValues('amount')}
                    onValueChange={(values) => {
                      if (isCashOut && Number(values.value) > ctx.existCash?.total) {
                        setError('amount', {
                          message: 'Amount exceeds total cash',
                        });
                      } else {
                        clearErrors('amount');
                      }
                      setValue('amount', Number(values.value));
                    }}
                  />
                </Stack>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center' }}>
            <LoadingButton
              type="submit"
              variant="contained"
              disabled={isCashOut && getValues('amount') > ctx.existCash?.total ? Boolean(true) : Boolean(false)}
              loading={isSubmitting}
            >
              Save
            </LoadingButton>
          </DialogActions>
        </FormProvider>
      </BootstrapDialog>
    </>
  );
}
