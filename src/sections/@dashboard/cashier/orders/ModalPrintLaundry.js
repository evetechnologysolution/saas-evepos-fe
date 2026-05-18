import PropTypes from 'prop-types';
import React, { useState, useRef, useEffect } from 'react';
// react-to-print
import { useReactToPrint } from 'react-to-print';
// @mui
import { IconButton, styled, Dialog, DialogTitle, DialogContent, Stack, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../../components/Iconify';
// hooks
import useAuth from '../../../../hooks/useAuth';
import useOrder from '../../../../pages/cashier/service/useOrder';
// utils
import { handleMutationFeedback } from '../../../../utils/mutationfeedback';
import PrintLaundry from '../pos/PrintLaundryFromOrders';

// ----------------------------------------------------------------------

ModalPrintLaundry.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  data: PropTypes.object,
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
  onClose: PropTypes.func.isRequired,
};

export default function ModalPrintLaundry(props) {
  const { data, open, onClose } = props;

  const { user } = useAuth();

  const { updateRaw, updatePrintLaundry } = useOrder();

  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(false);
  const [qty, setQty] = useState(0);
  const [objData, setObjData] = useState(null);
  const [shouldPrint, setShouldPrint] = useState(false);

  const fixId = data?._id || data?.tempId || data?.orderId;

  // Print Laundry
  const printLaundryRef = useRef();
  const handleAfterPrintLaundry = () => {
    updatePrintLaundry.mutate({ id: fixId, payload: { staff: user?.fullname } });
  };
  const handlePrintLaundry = useReactToPrint({
    content: () => printLaundryRef.current,
    onAfterPrint: handleAfterPrintLaundry,
  });

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setAlert(false);
      setQty(0);
    }, 500);
  };

  const handlePrintWithLabel = async (e) => {
    e.preventDefault();
    if (!qty) {
      setAlert(true);
      return;
    }
    const objData = {
      notes: `Tas Laundry ${qty} pcs`
    };

    try {
      setIsLoading(true);
      setObjData({ ...data, qtyLabel: qty });

      const mutation = updateRaw.mutateAsync({ id: fixId, payload: objData });
      await handleMutationFeedback(mutation, {
        successMsg: "",
        errorMsg: "",
        onSuccess: () => {
          setAlert(false);
          setTimeout(() => {
            setShouldPrint(true);
          }, 500);
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = async () => {
    setIsLoading(true);
    setObjData(data);
    setTimeout(() => {
      setShouldPrint(true);
    }, 500);
    setIsLoading(false);
  };

  useEffect(() => {
    if (shouldPrint && printLaundryRef.current) {
      handlePrintLaundry();
      setShouldPrint(false); // reset
      handleClose();
    }
  }, [shouldPrint, objData]);

  return (
    <>
      <BootstrapDialog aria-labelledby="customized-dialog-title" fullWidth maxWidth="sm" open={open}>
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
          style={{ borderBottom: '1px solid #ccc' }}
        >
          Print Laundry
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <div style={{ overflow: 'hidden', height: 0, width: 0 }}>
            <PrintLaundry ref={printLaundryRef} data={objData} />
          </div>
          <form onSubmit={handlePrintWithLabel}>
            <Stack gap={2}>
              <TextField
                name="qty"
                label="Jumlah Label"
                type="number"
                fullWidth
                InputProps={{
                  inputProps: { min: 1 },
                }}
                autoComplete="off"
                value={qty || ''}
                onChange={(e) => setQty(e.target.value)}
                error={!qty && alert ? Boolean(true) : Boolean(false)}
                helperText={!qty && alert ? 'Jumlah Label is required' : ''}
              />
              <Stack flexDirection="row" alignItems="center" justifyContent="center" gap={2}>
                <LoadingButton variant="contained" loading={isLoading} type="submit">
                  Dengan Label
                </LoadingButton>
                <LoadingButton
                  variant="contained"
                  color="warning"
                  loading={isLoading}
                  type="button"
                  onClick={() => handlePrint()}
                >
                  Tanpa Label
                </LoadingButton>
              </Stack>
            </Stack>
          </form>
        </DialogContent>
      </BootstrapDialog>
    </>
  );
}
