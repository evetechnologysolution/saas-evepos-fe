import PropTypes from 'prop-types';
import React, { useState, useRef, useEffect, useContext } from 'react';
import { useQueryClient } from 'react-query';
// react-to-print
import { useReactToPrint } from 'react-to-print';
// @mui
import { IconButton, styled, Dialog, DialogTitle, DialogContent, Stack, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../../components/Iconify';
// hooks
import useAuth from '../../../../hooks/useAuth';
import axios from '../../../../utils/axios';
// context
import { cashierContext } from '../../../../contexts/CashierContext';
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

  const ctx = useContext(cashierContext);
  const { user } = useAuth();

  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(false);
  const [qty, setQty] = useState(0);
  const [objData, setObjData] = useState(null);
  const [shouldPrint, setShouldPrint] = useState(false);

  const fixId = data?._id || data?.tempId || data?.orderId;

  // Print Laundry
  const printLaundryRef = useRef();
  const handleAfterPrintLaundry = () => {
    ctx.updatePrintLaundry(fixId, { staff: user?.fullname });
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
    setIsLoading(true);
    if (!qty) {
      setAlert(true);
      setIsLoading(false);
      return;
    }
    setObjData({ ...data, qtyLabel: qty });
    setAlert(false);
    if (qty > 0) {
      await axios.patch(`/order/raw/${fixId}`, { notes: `Tas Laundry ${qty} pcs` });
      queryClient.invalidateQueries('listOrders');
    }
    setTimeout(() => {
      setShouldPrint(true);
    }, 500);
    setIsLoading(false);
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
